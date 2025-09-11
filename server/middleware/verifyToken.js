// // middleware/verifyToken.js
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   // console.log(`authHeader: ${authHeader}`);
//   if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     console.log(`error while decoding jwt token: ${err}`)
//     res.status(403).json({ success: false, message: 'Invalid token' });
//   }
// };

// module.exports = verifyToken;


// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(`authHeader: ${authHeader}`);/
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(`error while decoding jwt token: ${err}`)
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = verifyToken;   