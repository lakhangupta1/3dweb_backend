
const express = require('express');
const app = express();
const router = express.Router();
const db = require('../db');
const { createProducts } = require('./createProducts');
const { verifyToken }  = require("../utils/jwt")
const productModel = require('../models/Products');


function auth (req, res , next){
  try{
    console.log(" authentication ")
    let token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTA1NzY3MjJiNWJjODA0ZjFiZjU4YyIsImVtYWlsIjoibGFraGFuZ3VwdGE1MzIyM0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6Imxha2hhbiBndXB0YSIsImlhdCI6MTc1NTMzODU5OSwiZXhwIjoxNzU1MzQyMTk5fQ.jBbLI3OAvjfMOU_v1-ktkqUR6EytV039JQ_3KgRUrWQ";
      // const token = req.body || req.query || req.headers['authorization'];
      console.log(" tiken verify -> ", verifyToken(token));
      if(verifyToken(token)){
        next();
      }else{
        return res.status(200).json({
          error : true, 
          message : ' please provide token .'
        })
      }
  }catch(error){
    console.log(" error in auth  -> ", error );
     return res.status(200).json({
          error : true, 
          message : ' please provide token, ' + error.message
        })
  }
}
 

 // here i can use auth in middleware  like 
// router.get('/', auth , async (req, res)


// GET /api/products
router.get('/', async (req, res) => {
  try {
    console.log(" data get ")
    // If using Postgres, run SELECT; JSON fallback handled in db.js
    const q = 'SELECT id, name, category, price, image FROM products ORDER BY id';
    const r = await db.query(q);
    return res.json(r.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

 // here i can use auth in middleware  like 
// router.get('/:id',  auth ,  async (req, res)
 
// GET /api/products/:id
router.get('/:id' ,  async (req, res) => {
  try {
    console.log(" data get  by id ");
    console.log(" req.body.params  -> ", req.params.id);
    const q = 'SELECT * FROM products WHERE id = $1';
    const r = await db.query(q, [req.params.id]);
    console.log( ' row -> ' ,r );
    if (!r.rows || r.rows.length === 0) return res.status(404).json({ error: 'not found' });
    return res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

router.post('/create/products', createProducts);
router.get('/created/products', async(req, res )=>{
  try{

    let products = await productModel.find() || [];
    if(products && products.length){
      return res.status(200).json({
        payload : products,
        error : false,
        message : 'successfully get products.'
      })
    }


  }catch(error){
    return res.status(404).json({
      error: true,
      payload : [],
      message : " something went wrong on server "
    })
  }
});



router.post('/delete/product', async (req, res )=>{
  try {
    // console.log("params -> ", req.query);
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
