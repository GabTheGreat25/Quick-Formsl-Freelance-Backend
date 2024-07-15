import mongoose from "mongoose";
import createError from "http-errors";
import model from "./model.js";
import { lookup } from "../../../utils/index.js";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";

async function getAll() {
  return await model.aggregate([
    lookup(RESOURCE.CONTENTS, RESOURCE.CONTENT, RESOURCE.CONTENT, [
      lookup(
        RESOURCE.SUBMISSIONS,
        RESOURCE.SUBMISSION,
        RESOURCE.SUBMISSION,
        [],
      ),
    ]),
    lookup(RESOURCE.DESIGNS, RESOURCE.DESIGN, RESOURCE.DESIGN, []),
    lookup(RESOURCE.SETTINGS, RESOURCE.SETTING, RESOURCE.SETTING, []),
  ]);
}

async function getById(_id) {
  return await model
    .aggregate()
    .match({
      _id: mongoose.Types.ObjectId.createFromHexString(_id),
    })
    .append(
      lookup(RESOURCE.CONTENTS, RESOURCE.CONTENT, RESOURCE.CONTENT, [
        lookup(
          RESOURCE.SUBMISSIONS,
          RESOURCE.SUBMISSION,
          RESOURCE.SUBMISSION,
          [],
        ),
      ]),
    )
    .append(lookup(RESOURCE.DESIGNS, RESOURCE.DESIGN, RESOURCE.DESIGN, []))
    .append(lookup(RESOURCE.SETTINGS, RESOURCE.SETTING, RESOURCE.SETTING, []));
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
                content: contentId,
              },
            },
            { new: true, session },
          )
        : await model
            .create(
              [
                {
                  user: userId || "",
                  content: [contentId] || [],
                  design: [],
                  settings: [],
                },
              ],
              { session },
            )
            .then((result) => result[0]),
    );
}

async function addDesign(userId, designId, session) {
  return await model
    .findOne({ user: userId })
    .session(session)
    .then(async (form) =>
      form
        ? await ((form.design = [designId]), form.save({ session, new: true }))
        : await model
            .create(
              [
                {
                  user: userId || "",
                  content: [],
                  design: [designId] || [],
                  settings: [],
                },
              ],
              { session },
            )
            .then((result) => result[0]),
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
    { $pull: { content: contentId } },
    { new: true, session },
  );
}

async function removeDesign(userId, designId, session) {
  return await model.findOneAndUpdate(
    { user: userId },
    { $pull: { design: designId } },
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
