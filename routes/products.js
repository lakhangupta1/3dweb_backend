const express = require('express');
const router = express.Router();
const db = require('../db');
const { createProducts } = require('./createProducts');
const { verifyToken }  = require("../utils/jwt");
const productModel = require('../models/Products');
const upload = require("../middleware/upload");

// Middleware for token authentication
function auth (req, res , next){
  try {
    console.log(" authentication ");
    let token = req.headers['authorization']; // take token from request headers
    console.log(" token verify -> ", verifyToken(token));

    if (verifyToken(token)) {
      next();
    } else {
      return res.status(401).json({
        error: true, 
        message: 'Invalid or missing token.'
      });
    }
  } catch (error) {
    console.log(" error in auth  -> ", error );
    return res.status(401).json({
      error: true, 
      message: 'Please provide valid token, ' + error.message
    });
  }
}

// ✅ GET /api/products
router.get('/', async (req, res) => {
  try {
    const q = 'SELECT id, name, category, price, image FROM products ORDER BY id';
    const r = await db.query(q);
    return res.json(r.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// ✅ GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const q = 'SELECT * FROM products WHERE id = $1';
    const r = await db.query(q, [req.params.id]);
    if (!r.rows || r.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// ✅ POST /api/create/products (with image upload)
router.post('/create/products', upload.single("image"), createProducts);

// ✅ GET all created products from Mongo
router.get('/created/products', async (req, res) => {
  try {
    let products = await productModel.find() || [];
    if (products.length) {
      return res.status(200).json({
        payload: products,
        error: false,
        message: 'Successfully fetched products.'
      });
    }
    return res.status(404).json({
      error: true,
      payload: [],
      message: "No products found."
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      payload: [],
      message: "Something went wrong on server."
    });
  }
});

// ✅ DELETE product
router.post('/delete/product', async (req, res) => {
  try {
    const productId = req.query._id;
    const result = await productModel.deleteOne({ _id: productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: true,
        payload: [],
        message: "Product not found or already deleted."
      });
    }
    return res.status(200).json({
      payload: [],
      error: false,
      message: "Successfully deleted product."
    });
  } catch (error) {
    console.log("error -> ", error);
    return res.status(500).json({
      error: true,
      payload: [],
      message: "Something went wrong on server."
    });
  }
});

module.exports = router;
