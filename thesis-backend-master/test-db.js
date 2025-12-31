import "dotenv/config";
import { pool } from "./db.js";

const run = async () => {
  try {
    const { rows } = await pool.query("select current_database() db, inet_server_addr() host, inet_server_port() port");
    console.log("Connected to:", rows[0]);
  } catch (e) {
    console.error("DB error:", e);
  } finally {
    await pool.end();
  }
};
run();
