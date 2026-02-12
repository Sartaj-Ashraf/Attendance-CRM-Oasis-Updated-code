import crypto from "crypto";

export const generatePasswordToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
