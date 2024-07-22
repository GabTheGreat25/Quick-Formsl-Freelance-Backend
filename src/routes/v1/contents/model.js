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
          required: false,
        },
        columns: [
          {
            inputType: {
              type: String,
              required: false,
            },
            fieldName: {
              type: String,
              required: false,
            },
          },
        ],
      },
    ],
    submission: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.SUBMISSIONS,
      },
    ],
    title: {
      type: String,
      required: false,
      default: "Untitled Form",
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.CONTENTS] ||
  mongoose.model(RESOURCE.CONTENTS, schema);
