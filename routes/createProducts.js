


const productModel = require('../models/Products');

exports.createProducts = async (req, res )=>{

    try{
        console.log(" req body -> ", req.body );
        let products =  await productModel({...req.body});
        let result = await products.save();
        return res.status(200).json({
            error : false ,
            payload  : [],
            result, 
            message : 'successfully added.'
        })
    }catch(error){
        return res.status(200).json({
            error : true ,
            payload  : [],
            result, 
            message : ' somethiing went wrong. '
        })
    }
}