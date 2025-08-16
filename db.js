
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
  const pool = new Pool({ connectionString: DATABASE_URL });
  module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
  };
} else {
  // JSON fallback - reads backend/data/products.json
  console.log(" db else parts ");
  const dataPath = path.join(__dirname, 'data', 'products.json');
  function readProducts() {
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  }
  module.exports = {
    query: async (text, params) => {
      // support two queries:
      // 1) SELECT * FROM products
      // 2) SELECT * FROM products WHERE id = $1
      const all = readProducts();
      if (text.includes('WHERE') && params && params.length) {
        const id = Number(params[0]);
        const found = all.find(p => p.id === id);
        return { rows: found ? [found] : [] };
      }
      return { rows: all };
    }
  };
}
