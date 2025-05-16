const jwt = require('jsonwebtoken');

// Simple role-based authorization middleware
module.exports = function(roles) {
    // Convert single role to array for consistent handling
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req, res, next) => {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access Denied: No Token Found' 
            });
        }

        try {
            // Extract token from Bearer
            const tokenToVerify = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
            
            // Verify token
            const decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET || 'your_jwt_secret_key');
            
            // Check if user has required role
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Access Forbidden: Role '${decoded.role}' is not authorized` 
                });
            }
            
            // Attach user to request
            req.user = decoded;
            next();
            
        } catch (error) {
            console.error('Authorization error:', error.message);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
    };
};
