import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "loan_eligibility",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fails fast with a clear message if MySQL isn't reachable, instead of
// letting every request hang until it times out.
export async function verifyDbConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log("MySQL connection OK");
  } finally {
    conn.release();
  }
}
