import model from "./model.js";
import imageModel from "../images/model.js";
import formModel from "../forms/model.js";
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
  return Promise.all([
    imageModel.updateMany({ user: _id }, { deleted: true }).session(session),
    formModel.updateMany({ user: _id }, { deleted: true }).session(session),
  ]).then(() => model.findByIdAndUpdate(_id, { deleted: true }, { session }));
}

async function restoreById(_id, session) {
  return Promise.all([
    imageModel.updateMany({ user: _id }, { deleted: false }).session(session),
    formModel.updateMany({ user: _id }, { deleted: false }).session(session),
  ]).then(() => model.findByIdAndUpdate(_id, { deleted: false }, { session }));
}

async function forceDelete(_id, session) {
  return Promise.all([
    imageModel.deleteMany({ user: _id }).session(session),
    formModel.deleteMany({ user: _id }).session(session),
  ]).then(() => model.findByIdAndDelete(_id, { session }));
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

async function sendEmailOTP(email, otp) {
  return await model.findByIdAndUpdate(
    (await model.findOne({ email }))?._id,
    { verificationCode: { code: otp, createdAt: new Date() } },
    { new: true, runValidators: true, deleted: false },
  );
}

async function resetPassword(verificationCode, password) {
  return await model.findByIdAndUpdate(
    (await model.findOne({ "verificationCode.code": verificationCode }))?._id,
    { password: password, verificationCode: null },
    { new: true, runValidators: true, deleted: false },
  );
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
