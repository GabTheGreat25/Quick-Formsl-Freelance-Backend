import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    fields: [
      {
        inputType: {
          type: String,
          required: true,
        },
        fieldName: {
          type: String,
          required: true,
        },
      },
    ],
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.CONTENTS] ||
  mongoose.model(RESOURCE.CONTENTS, schema);
