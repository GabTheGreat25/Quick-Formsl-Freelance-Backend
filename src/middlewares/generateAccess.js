import { generateToken } from "../middlewares/index.js";

export function generateAccess(payload = {}) {
  const token = generateToken(payload, "1d");
  return {
    access: token,
  };
}
