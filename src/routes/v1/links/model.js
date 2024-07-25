import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    urlLink: {
      type: String,
      required: true,
      unique: true,
    },
    encryptedUrl: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: RESOURCE.CONTENTS,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.LINKS] ||
  mongoose.model(RESOURCE.LINKS, schema);
