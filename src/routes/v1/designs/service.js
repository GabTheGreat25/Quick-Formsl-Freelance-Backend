import model from "./model.js";
import { RESOURCE } from "../../../constants/index.js";

async function getAll() {
  return await model
    .find()
    .populate({
      path: "content.imageId",
    })
    .populate({
      path: "content.contentId",
      populate: {
        path: RESOURCE.SUBMISSION,
      },
    });
}

async function getById(_id) {
  return await model
    .findById({ _id })
    .populate({
      path: "content.imageId",
    })
    .populate({
      path: "content.contentId",
      populate: {
        path: RESOURCE.SUBMISSION,
      },
    });
}

async function getDefaultById(_id) {
  return await model
    .findOne({ _id, user: null })
    .populate({
      path: "content.imageId",
    })
    .populate({
      path: "content.contentId",
      populate: {
        path: RESOURCE.SUBMISSION,
      },
    });
}

async function add(body, session) {
  return (await model
    .findOne({ "content.contentId": body.content.contentId })
    .session(session))
    ? [
        await model.findOneAndUpdate(
          { "content.contentId": body.content.contentId },
          {
            $set: {
              "content.$.imageId": body.content.imageId,
              "content.$.position": body.content.position,
            },
          },
          { new: true, session },
        ),
      ]
    : await model.create(
        [
          {
            content: {
              contentId: body.content.contentId,
              imageId: body.content.imageId,
              position: body.content.position,
            },
          },
        ],
        { session },
      );
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
}

async function removeImage(imageId) {
  return await model.updateMany(
    { "content.imageId": imageId },
    { $set: { "content.$[elem].imageId": null } },
    {
      arrayFilters: [{ "elem.imageId": imageId }],
      new: true,
    },
  );
}

async function removeDefaultImage(contentId, imageId) {
  return await model.updateOne(
    { "content.contentId": contentId, "content.imageId": imageId },
    { $set: { "content.$[elem].imageId": null } },
    {
      arrayFilters: [{ "elem.contentId": contentId, "elem.imageId": imageId }],
      new: true,
    },
  );
}

export default {
  getAll,
  getById,
  getDefaultById,
  add,
  deleteById,
  removeImage,
  removeDefaultImage,
};
