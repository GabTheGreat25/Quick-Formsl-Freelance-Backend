import model from "./model.js";
import imageModel from "../images/model.js";
import designModel from "../designs/model.js";
import settingModel from "../settings/model.js";
import contentModel from "../contents/model.js";
import submissionModel from "../submissions/model.js";
import formModel from "../forms/model.js";
import linkModel from "../links/model.js";
import {
  AdminDiscriminator,
  CustomerDiscriminator,
} from "./discriminators/index.js";
import { ROLE, RESOURCE } from "../../../constants/index.js";
import { ENV } from "../../../config/index.js";
import bcrypt from "bcrypt";

async function getAll() {
  return await model.find({ deleted: false });
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id) {
  return await model.findOne({ _id, deleted: false });
}

async function getEmail(email) {
  return await model
    .findOne({ email, deleted: false })
    .select(RESOURCE.PASSWORD);
}

async function add(body, session) {
  return await (
    body.role === ROLE.ADMIN
      ? AdminDiscriminator
      : body.role === ROLE.CUSTOMER
        ? CustomerDiscriminator
        : model
  ).create([body], { session });
}

async function update(_id, body, session) {
  return await model.findByIdAndUpdate(_id, body, {
    overwriteDiscriminatorKey: true,
    new: true,
    runValidators: true,
    deleted: false,
    session,
  });
}

async function deleteById(_id, session) {
  return model.findByIdAndUpdate(_id, { deleted: true }, { session });
}

async function restoreById(_id, session) {
  return model.findByIdAndUpdate(_id, { deleted: false }, { session });
}

async function forceDelete(_id, session) {
  return await (async () => {
    const [forms, images, user] = await Promise.all([
      formModel.find({ user: _id }),
      imageModel.find({ user: _id }),
      model.findById(_id),
    ]);

    await Promise.all([
      (async () => {
        await Promise.all(
          forms.map(async (form) => {
            await Promise.all(
              form.form.map(async (item) => {
                const contentId = item.content.toString();
                const content = await contentModel.findById(contentId);
                if (content) {
                  await Promise.all([
                    submissionModel.deleteMany({
                      _id: { $in: content.submission },
                    }),
                    contentModel.findByIdAndDelete(contentId),
                    linkModel.deleteOne({ content: contentId }),
                  ]);
                }
              }),
            );
            await Promise.all([
              designModel.deleteMany({
                _id: { $in: form.form.map((item) => item.design) },
              }),
              settingModel.deleteMany({
                _id: { $in: form.form.map((item) => item.setting) },
              }),
              formModel.findByIdAndDelete(form._id),
            ]);
          }),
        );
      })(),
      imageModel.deleteMany({ user: _id })?.session(session),
      model.findByIdAndDelete(_id, { session }),
    ]);

    return {
      imagesDeleted: images,
      userData: user,
    };
  })();
}

async function changePassword(_id, newPassword, session) {
  return await model.findByIdAndUpdate(
    _id,
    { password: await bcrypt.hash(newPassword, ENV.SALT_NUMBER) },
    {
      new: true,
      runValidators: true,
      select: RESOURCE.PASSWORD,
      deleted: false,
      session,
    },
  );
}

async function getCode(verificationCode) {
  return await model.findOne({
    "verificationCode.code": verificationCode,
    deleted: false,
  });
}

async function sendEmailOTP(email, otp, session) {
  return await model.findByIdAndUpdate(
    (await model.findOne({ email }))?._id,
    { verificationCode: { code: otp, createdAt: new Date() } },
    { new: true, runValidators: true, deleted: false, session },
  );
}

async function resetPassword(verificationCode, newPassword, session) {
  return await model
    .findByIdAndUpdate(
      (await model.findOne({ "verificationCode.code": verificationCode }))?._id,
      {
        verificationCode: null,
        password: await bcrypt.hash(newPassword, ENV.SALT_NUMBER),
      },
      { new: true, runValidators: true, deleted: false, session },
    )
    .select(RESOURCE.PASSWORD);
}

export default {
  getAll,
  getAllDeleted,
  getById,
  getEmail,
  add,
  update,
  deleteById,
  restoreById,
  forceDelete,
  changePassword,
  getCode,
  sendEmailOTP,
  resetPassword,
};
