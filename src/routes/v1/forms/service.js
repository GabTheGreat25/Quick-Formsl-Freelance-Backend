import mongoose from "mongoose";
import model from "./model.js";
import { lookup } from "../../../utils/index.js";
import { RESOURCE } from "../../../constants/index.js";

async function getAll() {
  return await model
    .aggregate()
    .append(lookup(RESOURCE.CONTENTS, RESOURCE.CONTENT, RESOURCE.CONTENT, []))
    .append(lookup(RESOURCE.DESIGNS, RESOURCE.DESIGN, RESOURCE.DESIGN, []))
    .append(lookup(RESOURCE.PUBLISHES, RESOURCE.PUBLISH, RESOURCE.PUBLISH, []));
}

async function getById(_id) {
  return await model
    .aggregate()
    .match({
      _id: mongoose.Types.ObjectId.createFromHexString(_id),
    })
    .append(lookup(RESOURCE.CONTENTS, RESOURCE.CONTENT, RESOURCE.CONTENT, []))
    .append(lookup(RESOURCE.DESIGNS, RESOURCE.DESIGN, RESOURCE.DESIGN, []))
    .append(lookup(RESOURCE.PUBLISHES, RESOURCE.PUBLISH, RESOURCE.PUBLISH, []));
}

async function add(userId, contentId, session) {
  const existingFormEntry = await model
    .findOne({ user: userId })
    .session(session);

  return existingFormEntry
    ? await model.findByIdAndUpdate(
        existingFormEntry._id,
        { $addToSet: { content: contentId } },
        { new: true, session },
      )
    : await model.create([{ user: userId, content: [contentId] }], { session });
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
