// config/db.js
const mongoose = require('mongoose');
let mongoUrl = 'mongodb+srv://absdolfinlakhan1:TrIoH5zQw3NrCPro@cluster0.a3h2oai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' //   ||  'mongodb://127.0.0.1:27017/myshop'
const connectDB = async () => {
  try {
    console.log(" by -> " ,mongoUrl );
    await mongoose.connect(
      mongoUrl, // Or your MongoDB Atlas URL
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(' MongoDB connected');
  } catch (err) {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
