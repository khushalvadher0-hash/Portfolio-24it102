const jwt = require('jsonwebtoken');

/**
 * Authentication middleware to verify JWT in Authorization header.
 * Attaches authenticated user's ID to req.user.
 * Returns 401 Unauthorized for missing, malformed, invalid, or expired tokens.
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Authentication required. Missing Authorization header.'
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Malformed Authorization header. Format must be Bearer <token>.'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Authentication token missing.'
        });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not configured on the server.');
        return res.status(500).json({
            error: 'Server configuration error.'
        });
    }

    try {
        const decoded = jwt.verify(token, secret);
        // Attach user info (user ID) to request
        req.user = {
            id: decoded.userId || decoded.id,
            email: decoded.email
        };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired. Please log in again.'
            });
        }
        return res.status(401).json({
            error: 'Invalid token. Authentication failed.'
        });
    }
}

module.exports = authMiddleware;
