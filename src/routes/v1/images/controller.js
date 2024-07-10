import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import {
  upload,
  responseHandler,
  multipleImages,
} from "../../../utils/index.js";

const getAllImages = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Images found"
      : "All Images retrieved successfully",
  );
});

const getAllImagesDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Images found"
      : "All Deleted Images retrieved successfully",
  );
});

const getSingleImage = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Image found" : "Image retrieved successfully",
  );
});

const createNewImage = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const uploadedImages = await multipleImages(req.files, []);

    const data = await service.add(
      {
        ...req.body,
        image: uploadedImages,
      },
      req.session,
    );

    responseHandler(res, [data], "Image created successfully");
  }),
];

const updateImage = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const oldData = await service.getById(req.params.id);

    const uploadNewImages = await multipleImages(
      req.files,
      oldData?.image.map((image) => image.public_id),
    );

    const data = await service.update(
      req.params.id,
      {
        ...req.body,
        image: uploadNewImages,
      },
      req.session,
    );

    responseHandler(res, [data], "Image updated successfully");
  }),
];

const deleteImage = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted ? "Image is already deleted" : "Image deleted successfully",
  );
});

const restoreImage = asyncHandler(async (req, res) => {
  const data = await service.restoreById(req.params.id, req.session);

  responseHandler(
    res,
    !data?.deleted ? [] : [data],
    !data?.deleted ? "Image is not deleted" : "Image restored successfully",
  );
});

const forceDeleteImage = asyncHandler(async (req, res) => {
  const data = await service.forceDelete(req.params.id, req.session);

  const message = !data ? "No Image found" : "Image force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(res, [data], message);
});

export {
  getAllImages,
  getAllImagesDeleted,
  getSingleImage,
  createNewImage,
  updateImage,
  deleteImage,
  restoreImage,
  forceDeleteImage,
};
