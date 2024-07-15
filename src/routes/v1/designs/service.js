import model from "./model.js";

async function getAll() {
  return await model.find();
}

async function getById(_id) {
  return await model.findOne({ _id });
}

async function getDefaultById(_id) {
  return await model.findOne({ _id, user: null });
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

export default {
  getAll,
  getById,
  getDefaultById,
  add,
  update,
  deleteById,
};
