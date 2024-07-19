import { RESOURCE } from "../../../constants/resource.js";
import model from "./model.js";

async function getAll() {
  return await model.find().populate({
    path: RESOURCE.USER,
  });
}

async function getById(_id) {
  return await model.findOne({ _id }).populate({
    path: RESOURCE.USER,
  });
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
