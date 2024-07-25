import crypto from "crypto";
import { RESOURCE } from "../../../constants/resource.js";
import { ENV } from "../../../config/environment.js";
import model from "./model.js";

const algorithm = ENV.ALGORITHM;
const secretKey = Buffer.from(ENV.SECRET_KEY_HEX, "hex");

function generateShortId(segmentLengths = [3, 4, 3]) {
  const totalLength = segmentLengths.reduce((sum, len) => sum + len, 0);
  const bytes = crypto.randomBytes(totalLength);
  const segments = [];
  let index = 0;

  for (const length of segmentLengths) {
    const segmentBytes = bytes.subarray(index, index + length);
    const segment = Buffer.from(segmentBytes)
      .toString("base64")
      .replace(/\+/g, "0")
      .replace(/\//g, "1")
      .substring(0, length);
    segments.push(segment);
    index += length;
  }

  return segments.join("-").toLowerCase();
}

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

async function findByUrl(url) {
  return await model.findOne({ urlLink: url });
}

export default {
  getAll,
  getById,
  find,
  add,
  deleteById,
  encrypt,
  generateShortId,
  findByUrl,
};
