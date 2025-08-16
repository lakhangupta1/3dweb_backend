// config/db.js
const mongoose = require('mongoose');
// let mongoUrl = 'mongodb+srv://absdolfinlakhan1:TrIoH5zQw3NrCPro@cluster0.a3h2oai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' //   ||  'mongodb://127.0.0.1:27017/myshop'
// config/db.js
let mongoUrl  = 'mongodb+srv://absdolfinlakhan1:TrIoH5zQw3NrCPro@cluster0.a3h2oai.mongodb.net/myshop?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB at:", mongoUrl);
    await mongoose.connect(mongoUrl); // No need for deprecated options
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

