import jwt from "jsonwebtoken";
// import UserModel from "../Models/User.model.js";
import userModel from "../Models/User.model.js";
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.AttendenceToken;
  if (!token) {
    return res.status(401).json({ msg: "No token avalaible" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // const user = await userModel.findById(decode.id);
    // if (!user) {
    //   return res.status(401).json({ msg: "User not found" });
    // }
    // if (decoded.versionToken !== user.versionToken) {
    //   console.log("error ");
    //   return res.status(401).json({
    //     msg: "Session expired. Please login again.",
    //   });
    // }
    req.user = decode;
    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
// middlewares/role.js
export const isAdmin = (req, res, next) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ msg: "Access denied: Admins only" });
  // }
  next();
};

// import jwt from "jsonwebtoken";

// import UserModel from "../Models/User.model.js";
// export const authMiddleware = async (req, res, next) => {
//   const token = req.cookies?.AttendenceToken;
//   if (!token) {
//     return res.status(401).json({ msg: "No token avalaible" });
//   }
//   try {
//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await UserModel.findById(decoded.id);
//     if (!user) {
//       return res.status(401).json({ msg: "User not found" });
//     }
//     if (decoded.versionToken !== user.versionToken) {
//       return res.status(401).json({
//         msg: "Session expired. Please login again.",
//       });
//     }
//     req.user = decode;
//     next();
//   } catch (e) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };
// // middlewares/role.js
// export const isAdmin = (req, res, next) => {
//   // if (req.user.role !== "owner") {
//   //   return res.status(403).json({ msg: "Access denied: Admins only" });
//   // }
//   next();
// };
