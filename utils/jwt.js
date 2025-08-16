const jwt = require('jsonwebtoken');

// Use environment variable for secret key in production
const SECRET_KEY = process.env.JWT_SECRET || 'lakhan_gupta';

// Generate JWT token
function generateToken(user) {
    console.log(" lakhan gupta 1 ");
    // Payload can include any user info you need
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username
    };

    // Token valid for 1 hour
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        throw new Error('Invalid token');
    }
}

module.exports = { generateToken, verifyToken };
