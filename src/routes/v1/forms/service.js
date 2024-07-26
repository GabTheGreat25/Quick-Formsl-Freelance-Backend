import createError from "http-errors";
import model from "./model.js";
import designModel from "../designs/model.js";
import settingModel from "../settings/model.js";
import contentModel from "../contents/model.js";
import submissionModel from "../submissions/model.js";
import linkModel from "../links/model.js";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";

async function getAll() {
  return await model
    .find()
    .populate({
      path: RESOURCE.USER,
    })
    .populate({
      path: "form.content",
      populate: {
        path: RESOURCE.SUBMISSION,
      },
    })
    .populate({
      path: "form.design",
      populate: {
        path: "content.imageId",
      },
    })
    .populate({
      path: "form.setting",
    });
}

async function getById(_id) {
  return await model
    .findById({ _id })
    .populate({
      path: RESOURCE.USER,
    })
    .populate({
      path: "form.content",
      populate: {
        path: RESOURCE.SUBMISSION,
      },
    })
    .populate({
      path: "form.design",
      populate: {
        path: "content.imageId",
      },
    })
    .populate({
      path: "form.setting",
    });
}

async function findByContentId(contentId) {
  return await model
    .findOne({
      "form.content": contentId,
    })
    .populate({
      path: RESOURCE.USER,
    })
    .populate({
      path: "form.content",
      populate: {
        path: RESOURCE.SUBMISSION,
      },
    })
    .populate({
      path: "form.design",
      populate: {
        path: "content.imageId",
      },
    })
    .populate({
      path: "form.setting",
    });
}

async function addContent(userId, contentId, session) {
  return await model
    .findOne({ user: userId })
    .session(session)
    .then(async (form) =>
      form
        ? await model.findByIdAndUpdate(
            form._id,
            {
              $addToSet: {
                form: {
                  content: contentId,
                },
              },
            },
            { new: true, session },
          )
        : await model
            .create(
              [
                {
                  user: userId || "",
                  form: [
                    {
                      content: contentId || "",
                    },
                  ],
                },
              ],
              { session },
            )
            .then((result) => result[0]),
    );
}

async function addDesign(userId, contentId, designId, session) {
  return await model
    .findOne({ user: userId })
    .session(session)
    .then(async (data) =>
      data?.form.some((item) => item.content.toString() === contentId)
        ? await model.findOneAndUpdate(
            { _id: data._id, "form.content": contentId },
            { $set: { "form.$.design": designId } },
            { new: true, session },
          )
        : Promise.reject(
            createError(
              STATUSCODE.BAD_REQUEST,
              "Add a form content first to add design",
            ),
          ),
    );
}

async function addSetting(userId, contentId, settingId, session) {
  return await model
    .findOne({ user: userId })
    .session(session)
    .then(async (data) =>
      data.form.find((item) => item.content.toString() === contentId)
        ? data.form.find((item) => item.content.toString() === contentId)
            .setting
          ? Promise.reject(
              createError(
                STATUSCODE.BAD_REQUEST,
                "Setting already exists for this content",
              ),
            )
          : ((data.form.find(
              (item) => item.content.toString() === contentId,
            ).setting = settingId),
            await model.findOneAndUpdate(
              {
                _id: data._id,
                "form.content": contentId,
              },
              { $set: { "form.$.setting": settingId } },
              { new: true, session },
            ))
        : Promise.reject(
            createError(
              STATUSCODE.BAD_REQUEST,
              "Add a form content first to add setting",
            ),
          ),
    );
}

async function deleteById(_id, session) {
  return await model
    .findById(_id)
    .session(session)
    .then(async (form) =>
      form
        ? await Promise.all(
            form.form.map(async (item) => {
              const contentId = item.content.toString();
              const content = await contentModel
                .findById(contentId)
                .session(session);
              return await Promise.all(
                content.submission.map((sub) =>
                  submissionModel
                    .deleteMany({ _id: sub.toString() })
                    .session(session),
                ),
                await contentModel
                  .findByIdAndDelete(contentId)
                  .session(session),
                await linkModel
                  .deleteOne({ content: contentId })
                  .session(session),
                true,
              );
            }),
            await Promise.all([
              designModel
                .deleteMany({
                  _id: { $in: form.form.map((item) => item.design) },
                })
                .session(session),
              settingModel
                .deleteMany({
                  _id: { $in: form.form.map((item) => item.setting) },
                })
                .session(session),
            ]),
            await model.findByIdAndDelete(_id).session(session),
            form,
          ).then(() => form)
        : null,
    );
}

async function removeContent(userId, contentId, session) {
  return await model.findOneAndUpdate(
    { user: userId },
    { $pull: { form: { content: contentId } } },
    { new: true, session },
  );
}

async function removeDesign(userId, designId, session) {
  return await model.findOneAndUpdate(
    { user: userId, "form.design": designId },
    { $set: { "form.$.design": null } },
    { new: true, session },
  );
}

async function incrementSubmissionCount(formId, contentId, session) {
  return await model.findOneAndUpdate(
    { _id: formId, "form.content": contentId },
    { $inc: { "form.$.submissionCount": 1 } },
    { new: true, session },
  );
}

export default {
  getAll,
  getById,
  findByContentId,
  addContent,
  addDesign,
  addSetting,
  deleteById,
  removeContent,
  removeDesign,
  incrementSubmissionCount,
};
