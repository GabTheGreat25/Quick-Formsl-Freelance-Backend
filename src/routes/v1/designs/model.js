import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: RESOURCE.IMAGES,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.DESIGNS] ||
  mongoose.model(RESOURCE.DESIGNS, schema);
