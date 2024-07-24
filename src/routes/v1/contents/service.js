import model from "./model.js";
import designModel from "../designs/model.js";
import settingModel from "../settings/model.js";
import submissionModel from "../submissions/model.js";
import linkModel from "../links/model.js";
import { RESOURCE } from "../../../constants/index.js";

async function getAll() {
  return model.find().populate({
    path: RESOURCE.SUBMISSION,
  });
}

async function getById(_id) {
  return await model.findById({ _id }).populate({
    path: RESOURCE.SUBMISSION,
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
  return await model.findById(_id).then((content) =>
    Promise.all([
      designModel.deleteMany({ "content.contentId": _id }).session(session),
      settingModel.deleteMany({ contentId: _id }).session(session),
      linkModel.deleteOne({ content: _id }).session(session),
    ]).then(() =>
      Promise.all(
        content.submission.map((sub) =>
          submissionModel.deleteMany({ _id: sub.toString() }),
        ),
      ).then(() =>
        model
          .findByIdAndDelete(_id)
          .session(session)
          .then(() => content),
      ),
    ),
  );
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
