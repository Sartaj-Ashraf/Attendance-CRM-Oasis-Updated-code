import jwt from "jsonwebtoken";
const GenerateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    department: user.department,
    versionToken: user.versionToken,
    // canEditPastAttendance: user.canEditPastAttendance,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};
export default GenerateToken;
