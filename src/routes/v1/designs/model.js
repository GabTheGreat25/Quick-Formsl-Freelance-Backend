import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    content: [
      {
        contentId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: RESOURCE.CONTENTS,
        },
        imageId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: RESOURCE.IMAGES,
        },
        position: {
          type: String,
          required: true,
          enum: ["left", "center", "right"],
        },
      },
    ],
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.DESIGNS] ||
  mongoose.model(RESOURCE.DESIGNS, schema);
