const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';
const dotenv = require('dotenv');
dotenv.config();

const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.authToken; 

    if (!token) {
     
        return res.redirect('/adminpanel/login'); 
    }


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/adminpanel/login');
        }

        req.adminId = decoded.adminId;

        next();
    });
};

module.exports = authenticateAdmin;
