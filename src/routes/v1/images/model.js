import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    image: [
      {
        public_id: String,
        url: String,
        originalname: String,
      },
    ],
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.IMAGES] ||
  mongoose.model(RESOURCE.IMAGES, schema);
