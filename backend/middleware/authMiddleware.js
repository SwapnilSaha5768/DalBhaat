const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
        console.log('AuthMiddleware: Token decoded', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('AuthMiddleware: Token verification failed', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
