import { Schema, model } from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
  timestamps: true,
};

const schema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    isPublish:{
      type: Boolean,
      default: false,
    }
  },
  schemaOptions,
);

export default model(RESOURCE.LINKS, schema);