const mysql = require("mysql2/promise");
require("dotenv").config();

// Railway DB URL
const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

// Create connection pool
const pool = mysql.createPool(urlDB);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
}

// Query helper
async function query(sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Run helper (for INSERT/UPDATE/DELETE)
async function run(sql, params = []) {
  try {
    const [result] = await pool.query(sql, params);
    return result;
  } catch (error) {
    console.error("Database run error:", error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  query,
  run,
};
