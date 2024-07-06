import { Schema, model } from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
  strict: false,
};

const schema = new Schema(
  {
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);

export default model(RESOURCE.CONTENTS, schema);
