const express = require('express');
const router = express.Router();
const User = require('../models/User');   // Import model
// const { generateToken } = require('../utils/jwt');
const {generateToken, verifyToken } = require("../utils/jwt");


// Register route
router.post('/register', async (req, res) => {
    try {
        
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ error : false ,  user: { id: user._id, username, email }, token });
    } catch (err) {
        res.status(500).json({  error : true,  message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({  error : false  , user: { id: user._id, username: user.username, email }, token });
    } catch (err) {
        res.status(500).json({  error : true, message: err.message });
    }
});

module.exports = router;
