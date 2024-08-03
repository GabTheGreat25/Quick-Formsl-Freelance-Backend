import model from "./model.js";
import { RESOURCE } from "../../../constants/resource.js";

async function getAll() {
  return await model.find().populate({
    path: "contentId",
  });
}

async function getById(_id) {
  return await model.findOne({ _id }).populate({
    path: "contentId",
  });
}

async function getByContentId(_id) {
  return await model.findOne({ contentId: _id });
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

export default {
  getAll,
  getById,
  add,
  update,
  getByContentId,
};
