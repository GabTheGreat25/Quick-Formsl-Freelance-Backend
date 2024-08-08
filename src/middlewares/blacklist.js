import { RESOURCE } from "../constants/index.js";
import { ENV } from "../config/index.js";

let jwtToken = "";
let blacklistedToken = "";

export function setToken(token, res) {
  jwtToken = token;

  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === RESOURCE.PRODUCTION,
    sameSite: RESOURCE.NONE,
    maxAge: 24 * 60 * 60 * 1000,
  });
}

export function getToken() {
  return jwtToken || null;
}

export function blacklistToken() {
  blacklistedToken = jwtToken;
}

export function isTokenBlacklisted() {
  return jwtToken === blacklistedToken;
}
