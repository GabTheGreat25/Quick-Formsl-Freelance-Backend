import mongoose from "mongoose";
import model from "./model.js";
import { lookup } from "../../../utils/index.js";
import { RESOURCE } from "../../../constants/index.js";

async function getAll() {
  return await model
    .aggregate()
    .append(
      lookup(
        RESOURCE.SUBMISSIONS,
        RESOURCE.SUBMISSION,
        RESOURCE.SUBMISSION,
        [],
      ),
    );
}

async function getById(_id) {
  return await model
    .aggregate()
    .match({
      _id: mongoose.Types.ObjectId.createFromHexString(_id),
    })
    .append(
      lookup(
        RESOURCE.SUBMISSIONS,
        RESOURCE.SUBMISSION,
        RESOURCE.SUBMISSION,
        [],
      ),
    );
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

async function addSubmissionById(_id, submissionId, session) {
  return await model.findByIdAndUpdate(
    _id,
    { $push: { submission: submissionId } },
    { new: true, session },
  );
}

async function findSubmissionById(submissionId) {
  return await model.findOne({ submission: submissionId });
}

async function deleteSubmissionById(_id, submissionId, session) {
  return await model.findByIdAndUpdate(
    _id,
    { $pull: { submission: submissionId } },
    { new: true, session },
  );
}

export default {
  getAll,
  getById,
  add,
  update,
  deleteById,
  addSubmissionById,
  findSubmissionById,
  deleteSubmissionById,
};
