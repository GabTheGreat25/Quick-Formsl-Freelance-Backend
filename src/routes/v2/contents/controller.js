import asyncHandler from "express-async-handler";
import service from "./service.js";
import imagesService from "../images/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import {
  upload,
  responseHandler,
  multipleImages,
} from "../../../utils/index.js";

const getAllContents = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Contents found"
      : "All Contents retrieved successfully",
  );
});

const getAllContentsDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Contents found"
      : "All Deleted Contents retrieved successfully",
  );
});

const getSingleContent = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Content found" : "Content retrieved successfully",
  );
});

const createNewContent = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const uploadedImages = await multipleImages(req.files, []);

    const contentsData =
      Object.keys(req.body).length > 0
        ? await service.add({ ...req.body }, req.session)
        : null;

    const imagesData =
      uploadedImages.length > 0
        ? await imagesService.add(
            {
              content: contentsData[0]._id,
              image: uploadedImages,
            },
            req.session,
          )
        : null;

    responseHandler(
      res,
      { contents: contentsData, images: imagesData },
      "Content and Image created successfully",
    );
  }),
];

//not working
const updateContent = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const session = req.session;
    const oldData = await service.getImageById(req.params.id);

    const uploadNewImages = await multipleImages(
      req.files,
      oldData?.image.map((image) => image.public_id) || [],
    );

    const data = await service.update(
      req.params.id,
      Object.keys(req.body).length > 0
        ? service.update(req.params.id, { ...req.body }, session)
        : Promise.resolve(null),
      req.session,
    );

    responseHandler(res, [data], "Content updated successfully");
  }),
];

const deleteContent = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted
      ? "Content is already deleted"
      : "Content deleted successfully",
  );
});

const restoreContent = asyncHandler(async (req, res) => {
  const data = await service.restoreById(req.params.id, req.session);

  responseHandler(
    res,
    !data?.deleted ? [] : [data],
    !data?.deleted ? "Content is not deleted" : "Content restored successfully",
  );
});

const forceDeleteContent = asyncHandler(async (req, res) => {
  const contentsData = await service.forceDelete(req.params.id, req.session);
  const imagesData = contentsData
    ? await imagesService.find({ content: contentsData._id })
    : null;

  if (imagesData && imagesData.length > 0 && imagesData[0].image) {
    await Promise.all([
      imagesService.forceDelete(imagesData._id, req.session),
      multipleImages(
        [],
        imagesData[0].image.map((image) => image.public_id),
      ),
    ]);
  }
  const message =
    !contentsData && !imagesData
      ? "No Content and Image found"
      : "Content and Image force deleted successfully";

  responseHandler(res, { contents: contentsData, images: imagesData }, message);
});

export {
  getAllContents,
  getAllContentsDeleted,
  getSingleContent,
  createNewContent,
  updateContent,
  deleteContent,
  restoreContent,
  forceDeleteContent,
};
