import { generateToken } from "../middlewares/index.js";

export function generateAccess(payload = {}) {
  const accessToken = generateToken(payload, "1d");
  return {
    access: accessToken,
  };
}
