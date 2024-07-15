import mongoose from "mongoose";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: STATUSCODE.SIX,
    },
    image: [
      {
        public_id: String,
        url: String,
        originalname: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      code: {
        type: String,
        default: null,
      },
      createdAt: {
        type: Date,
        default: null,
      },
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.USERS] ||
  mongoose.model(RESOURCE.USERS, schema);
