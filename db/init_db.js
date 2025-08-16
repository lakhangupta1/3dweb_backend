
/**
 * init_db.js
 * - If DATABASE_URL is present, create table and seed sample data in Postgres.
 * - Otherwise write backend/data/products.json (already present).
 */
const fs = require('fs');
const path = require('path');
const DATABASE_URL = process.env.DATABASE_URL || null;

if (DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: DATABASE_URL });

  (async ()=> {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT,
          category TEXT,
          price NUMERIC,
          image TEXT,
          model_path TEXT,
          description TEXT
        );
      `);
      // Insert sample if empty
      const { rows } = await pool.query('SELECT COUNT(*) FROM products');
      const count = Number(rows[0].count);
      if (count === 0) {
        await pool.query(
          `INSERT INTO products (name, category, price, image, model_path, description) VALUES
          ('Oak Wood Chair','Furniture',129.99,'/models/thumbs/chair.png','/models/sample_chair.glb','A minimal oak wood chair.'),
          ('Ceramic Vase','Decor',49.50,'/models/thumbs/vase.png','/models/sample_vase.glb','Handmade ceramic vase.');`
        );
        console.log('Seeded products table.');
      } else {
        console.log('Products table already has data.');
      }
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
} else {
  console.log('No DATABASE_URL provided. JSON fallback already available at backend/data/products.json');
}
