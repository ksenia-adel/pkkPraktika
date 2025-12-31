import { pool } from "./db.js";
const SCHEMA = process.env.DB_SCHEMA || "thesis";

async function getTableColumns(table) {
  const { rows } = await pool.query(
    `SELECT column_name,is_nullable,column_default
     FROM information_schema.columns
     WHERE table_schema=$1 AND table_name=$2`,
    [SCHEMA, table]
  );
  return rows;
}

function hasIdentityOrDefault(c) {
  return c.column_default && /nextval\(|identity/i.test(c.column_default);
}
function isRequired(c) {
  return c.is_nullable === "NO" && !hasIdentityOrDefault(c);
}

async function smartInsert(table, values, label) {
  const cols = await getTableColumns(table);
  if (!cols.length) return console.warn(`(skip) ${table}: нет метаданных`);
  const pairs = Object.entries(values).filter(([k]) =>
    cols.find((c) => c.column_name === k)
  );
  const required = cols.filter(isRequired).map((c) => c.column_name);
  const missing = required.filter((r) => !pairs.find(([n]) => n === r));
  if (missing.length)
    return console.warn(
      `(skip) ${label}: пропуск, не заданы обязательные поля: ${missing.join(", ")}`
    );
  if (!pairs.length) return console.warn(`(skip) ${label}: нечего вставлять`);
  const names = pairs.map(([n]) => `"${n}"`);
  const params = pairs.map((_, i) => `$${i + 1}`);
  const vals = pairs.map(([, v]) => v);
  const { rows } = await pool.query(
    `INSERT INTO ${SCHEMA}."${table}" (${names.join(",")})
     VALUES (${params.join(",")}) RETURNING *`,
    vals
  );
  console.log(`✅ ${label}`, rows[0]);
  return rows[0];
}

async function upsertRole() {
  try {
    await pool.query(
      `INSERT INTO ${SCHEMA}.role (role_id,name) VALUES (1,'admin')
       ON CONFLICT (role_id) DO NOTHING`
    );
  } catch {
    await pool.query(
      `INSERT INTO ${SCHEMA}.role (role_id,role_name) VALUES (1,'admin')
       ON CONFLICT (role_id) DO NOTHING`
    );
  }
  console.log("✅ role admin");
}

async function main() {
  await upsertRole();

  const customer = await smartInsert(
    "customer",
    {
      name: "Acme Biotech LLC",
      customer_name: "Acme Biotech LLC",
      company_name: "Acme Biotech LLC",
      email: "contact@acme-biotech.test",
      address: "123 Test Street, Tallinn",
      create_date: new Date(),
      archived: false,
      active: true,
    },
    "customer"
  );

  const methodA = await smartInsert(
    "method",
    {
      name: "Spectrometry",
      method_name: "Spectrometry",
      code: "METH-SP-001",
      accredited: true,
      archived: false,
      create_date: new Date(),
      active: true,
    },
    "method A"
  );

  const methodB = await smartInsert(
    "method",
    {
      name: "Chromatography",
      method_name: "Chromatography",
      code: "METH-CH-002",
      accredited: false,
      archived: false,
      create_date: new Date(),
      active: true,
    },
    "method B"
  );

  const proc1 = await smartInsert(
    "procedure",
    {
      name: "Protein Quantification",
      procedure_name: "Protein Quantification",
      code: "PROC-PQ-101",
      name_est: "Valkude kvantifitseerimine",
      name_eng: "Protein Quantification",
      archived: false,
      create_date: new Date(),
      active: true,
    },
    "procedure 1"
  );

  const proc2 = await smartInsert(
    "procedure",
    {
      name: "Impurity Analysis",
      procedure_name: "Impurity Analysis",
      code: "PROC-IA-102",
      name_est: "Lisandite analüüs",
      name_eng: "Impurity Analysis",
      archived: false,
      create_date: new Date(),
      active: true,
    },
    "procedure 2"
  );

  if (proc1 && methodA)
    await smartInsert(
      "procedure_method_map",
      {
        procedure_id: proc1.procedure_id ?? proc1.id,
        method_id: methodA.method_id ?? methodA.id,
        archived: false,
        active: true,
        create_date: new Date(),
      },
      "map proc1-methodA"
    );

  if (proc2 && methodB)
    await smartInsert(
      "procedure_method_map",
      {
        procedure_id: proc2.procedure_id ?? proc2.id,
        method_id: methodB.method_id ?? methodB.id,
        archived: false,
        active: true,
        create_date: new Date(),
      },
      "map proc2-methodB"
    );

  const sample1 = await smartInsert(
    "sample",
    {
      customer_id: customer?.customer_id ?? customer?.id,
      code: "SMP-0001",
      sample_code: "SMP-0001",
      name: "Protein Sample A",
      name_est: "Valgu proov A",
      name_eng: "Protein Sample A",
      archived: false,
      create_date: new Date(),
      active: true,
    },
    "sample 1"
  );

  if (sample1 && proc1)
    await smartInsert(
      "procedure_sample_map",
      {
        sample_id: sample1.sample_id ?? sample1.id,
        procedure_id: proc1.procedure_id ?? proc1.id,
        archived: false,
        active: true,
        create_date: new Date(),
      },
      "map sample1-proc1"
    );

  if (sample1 && proc2)
    await smartInsert(
      "procedure_sample_map",
      {
        sample_id: sample1.sample_id ?? sample1.id,
        procedure_id: proc2.procedure_id ?? proc2.id,
        archived: false,
        active: true,
        create_date: new Date(),
      },
      "map sample1-proc2"
    );

  await smartInsert(
    "measurement",
    {
      sample_id: sample1?.sample_id ?? sample1?.id,
      value: 12.34,
      unit: "mg/mL",
      note: "Initial run",
      create_date: new Date(),
      active: true,
    },
    "measurement 1"
  );

  await smartInsert(
    "measurement",
    {
      sample_id: sample1?.sample_id ?? sample1?.id,
      value: 12.29,
      unit: "mg/mL",
      note: "Repeat for QA",
      create_date: new Date(),
      active: true,
    },
    "measurement 2"
  );

const report1 = await smartInsert(
  "report",
  {
    customer_id: customer?.customer_id ?? customer?.id,
    report_code: "RPT-2025-001",
    title: "Protein Sample A — Demo Report",
    insertor_user_id: 1,
    create_date: new Date(),
    active: true,
    archived: false,
  },
  "report 1"
);


if (report1 && proc1)
  await smartInsert(
    "report_procedure_map",
    {
      report_id: report1.report_id ?? report1.id,
      procedure_id: proc1.procedure_id ?? proc1.id,
      sample_id: sample1?.sample_id ?? sample1?.id,
      archived: false,
      active: true,
      create_date: new Date(),
    },
    "map report1-proc1"
  );

if (report1 && proc2)
  await smartInsert(
    "report_procedure_map",
    {
      report_id: report1.report_id ?? report1.id,
      procedure_id: proc2.procedure_id ?? proc2.id,
      sample_id: sample1?.sample_id ?? sample1?.id,
      archived: false,
      active: true,
      create_date: new Date(),
    },
    "map report1-proc2"
  );


  console.log("🎉 Demo seed complete!");
}

main()
  .catch((e) => console.error("❌", e.message))
  .finally(() => pool.end());
