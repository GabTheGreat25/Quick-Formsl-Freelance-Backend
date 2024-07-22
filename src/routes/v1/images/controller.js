import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import serviceDesign from "../designs/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import {
  upload,
  responseHandler,
  multipleImages,
} from "../../../utils/index.js";
import { extractToken, verifyToken } from "../../../middlewares/index.js";

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
    const token = extractToken(req.headers.authorization);
    const verifiedToken = verifyToken(token);

    const uploadedImages = await multipleImages(req.files, []);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

    const data = await service.add(
      {
        user: verifiedToken.id,
        image: uploadedImages,
      },
      req.session,
    );

    responseHandler(res, [data], "Image created successfully");
  }),
];

const createNewDefaultDesign = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const uploadedImages = await multipleImages(req.files, []);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

    const data = await service.add(
      {
        image: uploadedImages,
      },
      req.session,
    );

    responseHandler(res, [data], "Default Image created successfully");
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

  const message = !data ? "No Image found" : "Image deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  await serviceDesign.removeImage(data._id);

  responseHandler(res, [data], message);
});

const removeDefaultImage = asyncHandler(async (req, res) => {
  if (!req.body.contentId)
    throw createError(
      STATUSCODE.BAD_REQUEST,
      "Image not related to any content",
    );

  await serviceDesign.removeDefaultImage(req.body.contentId, req.params.id);

  responseHandler(
    res,
    [{ content: req.body.contentId, image: req.params.id }],
    "Default Image removed successfully",
  );
});

export {
  getAllImages,
  getSingleImage,
  createNewImage,
  createNewDefaultDesign,
  updateImage,
  deleteImage,
  removeDefaultImage,
};
