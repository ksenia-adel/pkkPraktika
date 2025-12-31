// import-sql.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = __dirname;
const SQL_DIR = path.join(ROOT, "SQL");
const VIEWS_DIR = path.join(SQL_DIR, "views");

const orderedFiles = [
  "role.sql",
  "user.sql",
  "customer.sql",
  "method.sql",
  "procedure.sql",
  "measurement.sql",
  "sample.sql",
  "report.sql",
  "procedure_method_map.sql",
  "procedure_sample_map.sql",
  "report_procedure_map.sql",
  "annulated_report.sql",
];

async function readIfExists(p) {
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return null;
  }
}

async function runInTx(sql, fileLabel, schema) {
  try {
    await pool.query("BEGIN");
    const prefix = schema
      ? `CREATE SCHEMA IF NOT EXISTS ${schema}; SET search_path TO ${schema}, public;`
      : "";
    await pool.query(prefix + "\n" + sql);
    await pool.query("COMMIT");
    console.log(`✅ OK: ${fileLabel}`);
  } catch (e) {
    await pool.query("ROLLBACK");
    console.error(`❌ FAIL: ${fileLabel}\n`, e.message);
    throw e; 
  }
}

async function main() {
  const schema = process.env.DB_SCHEMA || "thesis";
  console.log(`Using schema: ${schema}`);
  console.log("Connecting and importing SQL...");

  for (const fname of orderedFiles) {
    const full = path.join(SQL_DIR, fname);
    const sql = await readIfExists(full);
    if (!sql) {
      console.warn(`(skip) not found: ${fname}`);
      continue;
    }
    console.log(`→ Running ${fname} ...`);
    await runInTx(sql, fname, schema);
  }

  let viewFiles = [];
  try {
    const entries = await fs.readdir(VIEWS_DIR);
    viewFiles = entries
      .filter((f) => f.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    console.warn("(skip) no views dir");
  }

  for (const vf of viewFiles) {
    const full = path.join(VIEWS_DIR, vf);
    const sql = await readIfExists(full);
    if (!sql) continue;
    console.log(`→ Running view ${vf} ...`);
    await runInTx(sql, `view:${vf}`, schema);
  }

  console.log("🎉 Import complete!");
}

main()
  .catch((e) => {
    console.error("Import stopped with error:");
    console.error(e); // выведет весь стек и код ошибки
  })
  .finally(() => pool.end());
