export const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    
    if (token !== "admin123") {
        return res.status(403).json({ error: "Invalid token." });
    }

    next();
};