import crypto from "crypto";
import { RESOURCE } from "../../../constants/resource.js";
import { ENV } from "../../../config/environment.js";
import model from "./model.js";

const algorithm = ENV.ALGORITHM;
const secretKey = Buffer.from(ENV.SECRET_KEY_HEX, "hex");

async function encrypt(text) {
  return await new Promise((resolve) => {
    const iv = crypto.randomBytes(8);
    const cipher = crypto.createCipheriv(
      algorithm,
      secretKey,
      Buffer.concat([iv, Buffer.alloc(8)]),
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    resolve(`${iv.toString("hex")}:${encrypted}`);
  });
}

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

async function getAll() {
  return await model.find().populate({
    path: RESOURCE.CONTENT,
  });
}

async function getById(_id) {
  return await model.findOne({ _id }).populate({
    path: RESOURCE.CONTENT,
  });
}
async function find(query) {
  return await model.findOne(query);
}

async function add(body, session) {
  return await model.create([body], { session });
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
}

export default {
  getAll,
  getById,
  find,
  add,
  deleteById,
  encrypt,
  decrypt,
};
