import jwt from 'jsonwebtoken';
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            console.log(`[AUTH DEBUG] No token found in cookies or headers for ${req.method} ${req.url}`);
            return res.status(401).json({ message: 'Unauthorized: No token provided', success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token', success: false });
        }
        req.user = decoded.id;
        next();
    } catch (error) {
        console.log(`[AUTH ERROR] ${error.message}`);
        return res.status(401).json({ message: 'Unauthorized: Token verification failed', success: false });
    }
}
export default isAuthenticated;