import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: RESOURCE.USERS,
    },
    content: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: RESOURCE.CONTENTS,
      },
    ],
    design: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: RESOURCE.DESIGNS,
    },
    publish: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: RESOURCE.PUBLISHES,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.FORMS] ||
  mongoose.model(RESOURCE.FORMS, schema);
