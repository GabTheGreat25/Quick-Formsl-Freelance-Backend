import mongoose from "mongoose";
import model from "./model.js";
import { lookup } from "../../../utils/index.js";
import { RESOURCE } from "../../../constants/index.js";

async function getAll() {
  return await model
    .aggregate()
    .append(lookup(RESOURCE.FORMS, RESOURCE.FORM, RESOURCE.FORM, []));
}

async function getById(_id) {
  return await model
    .aggregate()
    .match({
      _id: mongoose.Types.ObjectId.createFromHexString(_id),
    })
    .append(lookup(RESOURCE.FORMS, RESOURCE.FORM, RESOURCE.FORM, []));
}

async function add(body, session) {
  return await model.create([body], { session });
}

async function update(_id, body, session) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
    session,
  });
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
}

export default {
  getAll,
  getById,
  add,
  update,
  deleteById,
};
