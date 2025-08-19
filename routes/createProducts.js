const productModel = require('../models/Products');

exports.createProducts = async (req, res) => {
  try {
    console.log("req body -> ", req.body);
    console.log("req file -> ", req.file);

    const imagePath = req.file ? req.file.path : null;

    let product = new productModel({
      ...req.body,
      image: imagePath
    });

    let result = await product.save();

    return res.status(200).json({
      error: false,
      payload: [],
      result,
      message: 'Product successfully added.'
    });
  } catch (error) {
    console.error("Error in createProducts:", error);
    return res.status(500).json({
      error: true,
      payload: [],
      result: null,
      message: 'Something went wrong.'
    });
  }
};
