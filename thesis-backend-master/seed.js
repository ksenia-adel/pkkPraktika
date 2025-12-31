// seed.js — минимальный seed для запуска: роль admin + пользователь admin с bcrypt-паролем
import { pool } from "./db.js";
import bcrypt from "bcryptjs";

/** Возвращает список колонок таблицы */
async function getColumns(schema, table) {
  const { rows } = await pool.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2`,
    [schema, table]
  );
  return rows.map(r => r.column_name);
}

/** Пытается выполнить один из вариантов INSERT (на случай разных названий колонок), до первого успеха */
async function tryInserts(variants, label) {
  let lastErr;
  for (const v of variants) {
    try {
      await pool.query(v.sql, v.params || []);
      console.log(`✅ ${label}: вариант сработал -> ${v.note}`);
      return;
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`❌ ${label}: все варианты не сработали. Последняя ошибка: ${lastErr?.message}`);
}

async function main() {
  const schema = process.env.DB_SCHEMA || "thesis";
  console.log(`Using schema: ${schema}`);

  // 1) роль admin с id=1 (название колонки может различаться)
  const roleCols = await getColumns(schema, "role");
  console.log("role columns:", roleCols);

  const hasRoleName = roleCols.includes("name");
  const hasRoleNameAlt = roleCols.includes("role_name");
  const insertRoleVariants = [];

  if (hasRoleName) {
    insertRoleVariants.push({
      note: `role_id + name`,
      sql: `INSERT INTO ${schema}.role (role_id, name) VALUES (1,'admin')
            ON CONFLICT (role_id) DO NOTHING;`
    });
  }
  if (hasRoleNameAlt) {
    insertRoleVariants.push({
      note: `role_id + role_name`,
      sql: `INSERT INTO ${schema}.role (role_id, role_name) VALUES (1,'admin')
            ON CONFLICT (role_id) DO NOTHING;`
    });
  }
  // запасной вариант — если в таблице всего один текстовый столбец-имя:
  if (!hasRoleName && !hasRoleNameAlt) {
    insertRoleVariants.push({
      note: `только role_id`,
      sql: `INSERT INTO ${schema}.role (role_id) VALUES (1)
            ON CONFLICT (role_id) DO NOTHING;`
    });
  }

  await tryInserts(insertRoleVariants, "Вставка роли admin");

  // 2) пользователь admin с bcrypt-паролем
  // пароль можно поменять ниже (по умолчанию "admin"):
  const plain = "admin";
  const hash = await bcrypt.hash(plain, 10);

  // у нас есть точная схема user.sql: требуются эти поля:
  // username, password, firstname, lastname, email, role_id, role_grantor_user_id, active
  // остальные имеют дефолты
  const upsertAdminSQL = `
    INSERT INTO ${schema}."user"
      (username, password, firstname, lastname, email, role_id, role_grantor_user_id, active)
    VALUES ($1, $2, $3, $4, $5, 1, 1, TRUE)
    ON CONFLICT (username)
    DO UPDATE SET
      password = EXCLUDED.password,
      active = TRUE,
      role_id = 1
  `;
  await pool.query(upsertAdminSQL, [
    "admin",
    hash,
    "Lab",
    "Admin",
    "lab.admin@example.com",
  ]);
  console.log(`✅ Пользователь admin создан/обновлён (пароль: "${plain}")`);

  console.log("🎉 Seed complete. Теперь можно логиниться: admin / " + plain);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => pool.end());
