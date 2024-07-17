import mongoose from "mongoose";
import createError from "http-errors";
import model from "./model.js";
import designModel from "../designs/model.js";
import { lookup } from "../../../utils/index.js";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";

async function getAll() {
  return await model.aggregate([
    lookup(RESOURCE.CONTENTS, "content.contentId", RESOURCE.CONTENT, [
      lookup(RESOURCE.DESIGNS, "design", "design", []),
      lookup(RESOURCE.SETTINGS, "setting", "setting", []),
    ]),
  ]);
}

async function getById(_id) {
  return await model
    .aggregate()
    .match({
      _id: mongoose.Types.ObjectId.createFromHexString(_id),
    })
    .append(
      lookup(RESOURCE.CONTENTS, "content.contentId", RESOURCE.CONTENT, [
        lookup(RESOURCE.DESIGNS, "content.design", RESOURCE.DESIGN, []),
        lookup(RESOURCE.SETTINGS, "content.setting", RESOURCE.SETTING, []),
        lookup(
          RESOURCE.SUBMISSIONS,
          RESOURCE.SUBMISSION,
          RESOURCE.SUBMISSION,
          [],
        ),
      ]),
    );
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

async function addSetting(userId, settingId, session) {
  return model
    .findOne({ user: userId })
    .session(session)
    .then(async (existingUserSetting) =>
      existingUserSetting
        ? existingUserSetting.setting.length === 0
          ? ((existingUserSetting.setting = [settingId]),
            await existingUserSetting.save({ session }),
            existingUserSetting)
          : Promise.reject(
              createError(
                STATUSCODE.CONFLICT,
                "User already has a form with settings",
              ),
            )
        : model.create(
            {
              user: userId || "",
              content: [],
              design: [],
              settings: [settingId] || [],
            },
            { session },
          ),
    );
}

async function update(_id, body, session) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
    session,
  });
}

async function updateDesign(_id, designId, session) {
  return await model.findByIdAndUpdate(
    _id,
    { $set: { design: [designId] } },

    { new: true, session },
  );
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
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

export default {
  getAll,
  getById,
  addContent,
  addDesign,
  addSetting,
  update,
  updateDesign,
  deleteById,
  removeContent,
  removeDesign,
};
