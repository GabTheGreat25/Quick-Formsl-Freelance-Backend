import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";
import { customBadWords } from "../../../utils/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    values: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (value) {
          const text = JSON.stringify(value).toLowerCase();
          return !customBadWords.some((badWord) => text.includes(badWord));
        },
        message: "Content contains inappropriate language.",
      },
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.SUBMISSIONS] ||
  mongoose.model(RESOURCE.SUBMISSIONS, schema);
