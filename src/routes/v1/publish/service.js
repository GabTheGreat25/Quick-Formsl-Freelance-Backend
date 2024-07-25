import crypto from "crypto";
import { ENV } from "../../../config/environment.js";

const algorithm = ENV.ALGORITHM;
const secretKey = Buffer.from(ENV.SECRET_KEY_HEX, "hex");

async function decrypt(text) {
  return await new Promise((resolve) => {
    const [ivHex, encrypted] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.concat([iv, Buffer.alloc(8)]),
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    resolve(decrypted);
  });
}

export default {
  decrypt,
};
