// watcher.js
import "dotenv/config";
import chokidar from "chokidar";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import xlsx from "xlsx";
import { pool } from "./db.js";

const SCHEMA = process.env.DB_SCHEMA || "thesis";

// Поддержка ВЛОЖЕННЫХ папок: либо WATCH_GLOB, либо собираем из WATCH_DIR
const WATCH_DIR  = process.env.WATCH_DIR  || "C:/Users/yooch/Desktop/lab";
const WATCH_GLOB = process.env.WATCH_GLOB || "C:/Users/yooch/Desktop/lab/**/*.xlsx"

const CONFIG_PATH = path.join(process.cwd(), "config", "import-mapping.json");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const norm  = (s) => String(s ?? "").replace(/\u00A0/g," ").trim().replace(/\s+/g," ");

// ----- utils -----
const toNum = (v) => {
  if (v == null) return null;
  const s = String(v).trim().replace("<","").replace(",",".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

async function sha256File(file) {
  const buf = await fs.readFile(file);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function alreadyProcessed(file, stat, hash) {
  const { rows } = await pool.query(`
    SELECT status, sha256, size
    FROM ${SCHEMA}.import_file_log
    WHERE path=$1 AND status='ok'              -- ← только успешный импорт
    ORDER BY import_id DESC
    LIMIT 1
  `,[file]);

  if (!rows.length) return false;
  const r = rows[0];
  const same = r.sha256 === hash && Number(r.size) === Number(stat.size);
  if (same) {
    console.log("= skip (unchanged and already OK):", file);
  }
  return same;
}

async function markLog(file, stat, hash, status, error = null) {
  await pool.query(
    `INSERT INTO ${SCHEMA}.import_file_log(path, sha256, size, mtime, status, processed_at, error)
     VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
    [file, hash, stat.size, stat.mtime, status, error]
  );
}


// Выбираем реальное имя колонки из списка синонимов
const pickCol = (headers, variants) => {
  const H = headers.map(norm);
  for (const v of variants) {
    const vv = norm(v);
    const idx = H.indexOf(vv);
    if (idx !== -1) return headers[idx]; // вернуть ИСХОДНОЕ имя
  }
  return null;
};

// Парсим лист: автоматически находим строку заголовков (первые ~10 строк)
function parseWorksheet(ws, config) {
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1, blankrows: false }) || [];

  // хотим встретить хотя бы один из "опорных" заголовков
  const wanted = [
    ...(config.columns.customer    || []),
    ...(config.columns.sample_name || []),
    ...(config.columns.method      || []),
  ].map(norm);

  let headerRow = 0;
  let bestScore = -1;
  const cap = Math.min(rows.length, 10);
  for (let i = 0; i < cap; i++) {
    const r = (rows[i] || []).map(norm);
    const score = r.reduce((acc, cell) => acc + (wanted.includes(cell) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; headerRow = i; }
  }

  const headers = (rows[headerRow] || []).map(norm);

  // преобразуем последующие строки в объекты {header: value}
  const data = [];
  for (let i = headerRow + 1; i < rows.length; i++) {
    const r = rows[i] || [];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      if (!key) continue;
      obj[key] = r[j];
    }
    // пропускаем полностью пустые
    if (Object.values(obj).every(v => v === null || v === "")) continue;
    data.push(obj);
  }

  return { headersOriginal: headers, data };
}

// ----- основной импорт одного файла -----
async function processFile(file, config) {
  // ждём, чтобы Excel дописал файл
  await sleep(800);

  const stat = await fs.stat(file);
  const hash = await sha256File(file);
  if (await alreadyProcessed(file, stat, hash)) {
    console.log("= skip (no changes):", file);
    return;
  }

  let wb;
  try {
    wb = xlsx.readFile(file, { cellDates: true, dateNF: "yyyy-mm-dd" });
  } catch (e) {
    await markLog(file, stat, hash, "error", `xlsx: ${e.message}`);
    throw e;
  }

  const ws = wb.Sheets[config.sheet] || wb.Sheets[wb.SheetNames[0]];
  const { headersOriginal, data } = parseWorksheet(ws, config);

  // сопоставляем колонки
  const cols = {};
  for (const [key, variants] of Object.entries(config.columns)) {
    cols[key] = pickCol(headersOriginal, variants) || null;
  }

  console.log("Headers:", headersOriginal);
  console.log("Detected cols:", cols);

  // Обязательные колонки: пока НИЧЕГО не требуем жёстко
  // (чтобы не падать; method и customer допустимы пустыми)
  // Если хочешь требовать method, раскомментируй:
  // if (!cols.method) throw new Error("missing required column: method");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`SET search_path TO ${SCHEMA}`);

    for (const row of data) {
      // если пусто вообще — дальше
      const hasSomeContent =
        (cols.customer    && row[cols.customer]) ||
        (cols.sample_name && row[cols.sample_name]) ||
        (cols.C && row[cols.C]) ||
        (cols.H && row[cols.H]) ||
        (cols.N && row[cols.N]) ||
        (cols.S && row[cols.S]);
      if (!hasSomeContent) continue;

      // customer (дефолтим если не нашли колонку)
      const customer_name = norm(cols.customer ? row[cols.customer] : "") || "Unknown customer";
      const { rows: cust } = await client.query(
        `INSERT INTO ${SCHEMA}.customer(company_name)
         VALUES($1)
         ON CONFLICT (company_name) DO UPDATE SET company_name=EXCLUDED.company_name
         RETURNING customer_id`,
        [customer_name]
      );
      const customer_id = cust[0].customer_id;

      const start_date = cols.start_date ? row[cols.start_date] : null;
      const end_date   = cols.end_date   ? row[cols.end_date]   : null;
      const notes      = cols.sample_name ? norm(row[cols.sample_name]) || null : null;
      const insertor_user_id = 1; // TODO: подставь реального пользователя

      // report
      const { rows: rep } = await client.query(
        `INSERT INTO ${SCHEMA}.report(customer_id, samples_received_date, start_date, end_date, insertor_user_id, notes)
         VALUES ($1, NULL, $2, $3, $4, $5)
         RETURNING report_id`,
        [customer_id, start_date, end_date, insertor_user_id, notes]
      );
      const report_id = rep[0].report_id;

      // method (не обязателен)
      const method_name = cols.method && row[cols.method] ? norm(row[cols.method]) : null;
      let method_id = null;
      if (method_name) {
        const { rows: m } = await client.query(
          `INSERT INTO ${SCHEMA}.method(name)
           VALUES($1)
           ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name
           RETURNING method_id`,
          [method_name]
        );
        method_id = m[0].method_id;
      }

      // sample (generic, если нет явного)
      const { rows: s } = await client.query(
        `INSERT INTO ${SCHEMA}.sample(name_est, name_eng)
         VALUES('proov','sample')
         ON CONFLICT (name_eng) DO NOTHING
         RETURNING sample_id`
      );
      const sample_id = s.length
        ? s[0].sample_id
        : (await client.query(`SELECT sample_id FROM ${SCHEMA}.sample WHERE name_eng='sample'`)).rows[0].sample_id;

      // unit (по умолчанию для CHNS)
      const unit = (config.units && config.units.CHNS) || "m/m%";
      const { rows: mu } = await client.query(
        `INSERT INTO ${SCHEMA}.measurement(unit)
         VALUES($1)
         ON CONFLICT (unit) DO UPDATE SET unit=EXCLUDED.unit
         RETURNING measurement_id`,
        [unit]
      );
      const measurement_id = mu[0].measurement_id;

      const addRow = async (procName, valRaw) => {
        const value = toNum(valRaw);
        if (value == null) return;

        const { rows: pr } = await client.query(
          `INSERT INTO ${SCHEMA}.procedure(name_est, name_eng)
           VALUES($1,$1)
           ON CONFLICT (name_eng) DO UPDATE SET name_eng=EXCLUDED.name_eng
           RETURNING procedure_id`,
          [procName]
        );
        const procedure_id = pr[0].procedure_id;

        await client.query(
          `INSERT INTO ${SCHEMA}.report_procedure_map
             (report_id, procedure_id, method_id, sample_id, value, measurement_id)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (report_id, procedure_id, method_id, sample_id, measurement_id)
           DO UPDATE SET value = EXCLUDED.value`,
          [report_id, procedure_id, method_id, sample_id, String(value), measurement_id]
        );
      };

      if (cols.C) await addRow("Total carbon, TC", row[cols.C]);
      if (cols.H) await addRow("Hydrogen, H",      row[cols.H]);
      if (cols.N) await addRow("Nitrogen, N",      row[cols.N]);
      if (cols.S) await addRow("Total sulfur, St", row[cols.S]);

      console.log(`[OK] ${path.basename(file)} -> report_id=${report_id}, customer=${customer_name}`);
    }

    await client.query("COMMIT");
    await markLog(file, stat, hash, "ok");
  } catch (e) {
    await client.query("ROLLBACK");
    await markLog(file, stat, hash, "error", e.message);
    throw e;
  } finally {
    client.release();
  }
}

// ----- запуск вотчера -----
async function main() {
  const cfgRaw = await fs.readFile(CONFIG_PATH, "utf8");
  const config = JSON.parse(cfgRaw);

  console.log("DB target:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db:   process.env.DB_NAME,
    ssl:  String(process.env.DB_SSL || "false"),
    schema: SCHEMA,
  });
  console.log("Watching:", WATCH_GLOB);

  const watcher = chokidar.watch(WATCH_GLOB, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: { stabilityThreshold: 1200, pollInterval: 250 },
    ignored: /(^|[\/\\])~\$.+|(^|[\/\\])\./, // игнор временных/скрытых
  });

  const handle = async (file) => {
    const ext = path.extname(file).toLowerCase();
    if (![".xlsx",".xls",".xlsm"].includes(ext)) return;
    try {
      await processFile(file, config);
    } catch (e) {
      console.error("❌ Import error:", e.message);
    }
  };

  watcher.on("add", handle).on("change", handle).on("error", (err) => console.error("Watcher error:", err));
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
