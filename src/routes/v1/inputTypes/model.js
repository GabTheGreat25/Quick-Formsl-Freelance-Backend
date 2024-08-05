import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    fieldName: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ["General", "Advanced"],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.INPUT_TYPES] ||
  mongoose.model(RESOURCE.INPUT_TYPES, schema);
