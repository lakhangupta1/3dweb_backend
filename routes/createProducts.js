


const productModel = require('../models/Products');

exports.createProducts = async (req, res )=>{

    console.log(" req body -> ", req.body );
    let products =  await productModel({...req.body});
    let result = await products.save();
    return res.status(200).json({
        error : false ,
        payload  : [],
        result, 
        message : 'successfully added.'
    })
}