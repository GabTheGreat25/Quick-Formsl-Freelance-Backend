import model from "./model.js";
import randomUrl from "random-url";

async function getAll() {
  return await model.find({ deleted: false });
}

async function getById(_id, session) {
  return await model.findById({ _id, deleted: false });
}

async function add(body, session) {
  const randomPath = randomUrl("");
  const url = `https://govirtual.ph/${randomPath}`;
  body.url = url;

  return await model.create([body], { session });
}

async function update(_id, session) {
  return await model.findByIdAndUpdate(_id, { deleted: true }, { session });
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { deleted: true }, { session });
}


export default {
  getAll,
  getById,
  add,
  update,
  deleteById,
};