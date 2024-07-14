import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RESOURCE.CONTENTS,
      required: true,
    },
    values: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.SUBMISSIONS] ||
  mongoose.model(RESOURCE.SUBMISSIONS, schema);
