
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const connectDB = require('./config/db');
const createProducts = require('./routes/createProducts');
const authRoutes = require("./routes/auth")
const app = express();
const path = require('path');
app.use(cors());
app.use(express.json());
connectDB();
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/products', productsRouter);
app.use('/api', productsRouter )
app.use('/api/auth', authRoutes);


// serve static from frontend build if provided (for simple single-host deploy)
const frontendBuild = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));
