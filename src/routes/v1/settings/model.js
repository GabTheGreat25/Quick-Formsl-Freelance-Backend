import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RESOURCE.CONTENTS,
    },
    isEmailParticipant: {
      type: Boolean,
      default: false,
    },
    isEmailAdmin: {
      type: Boolean,
      default: false,
    },
    isRecord: {
      type: Boolean,
      default: true,
    },
    isSuccess: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.SETTINGS] ||
  mongoose.model(RESOURCE.SETTINGS, schema);
