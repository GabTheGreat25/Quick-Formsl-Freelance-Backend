import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    values: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.SUBMISSIONS] ||
  mongoose.model(RESOURCE.SUBMISSIONS, schema);
