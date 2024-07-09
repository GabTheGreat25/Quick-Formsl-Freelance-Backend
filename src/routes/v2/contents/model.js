import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
  strict: false,
};

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: RESOURCE.USERS,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: RESOURCE.IMAGES,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.CONTENTS] ||
  mongoose.model(RESOURCE.CONTENTS, schema);
