import jwt from 'jsonwebtoken';
const isAuthenticated =async (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' , success:false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: 'Unauthorized: Invalid token' , success:false });
        }
        req.user = decoded.id;
        next();
    }catch{
        console.log(error);
    }
}
export default isAuthenticated;