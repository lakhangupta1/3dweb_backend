/**
 * db.js
 * Connects to PostgreSQL if DATABASE_URL present; otherwise uses a JSON fallback.
 */
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || null;

if (DATABASE_URL) {
  // Use PostgreSQL
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // required for Render PostgreSQL
  });

  console.log("✅ Using PostgreSQL database");

  module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
  };
} else {
  // JSON fallback - reads backend/data/products.json
  console.log("⚠️ Using JSON fallback");

  const dataPath = path.join(__dirname, 'data', 'products.json');

  function readProducts() {
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  }

  module.exports = {
    query: async (text, params) => {
      const all = readProducts();

      // Support simple SELECT * or SELECT * WHERE id = $1
      if (text.includes('WHERE') && params && params.length) {
        const id = Number(params[0]);
        const found = all.find(p => p.id === id);
        return { rows: found ? [found] : [] };
      }

      return { rows: all };
    }
  };
}
