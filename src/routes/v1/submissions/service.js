import model from "./model.js";

async function getAll() {
  return await model.find();
}

async function getById(_id) {
  return await model.findById({ _id });
}

async function add(body, session) {
  return await model.create([body], { session });
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
}

export default {
  getAll,
  getById,
  add,
  deleteById,
};
