import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import serviceForm from "../forms/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import {
  upload,
  responseHandler,
  multipleImages,
} from "../../../utils/index.js";
import { extractToken, verifyToken } from "../../../middlewares/index.js";

const getAllDesigns = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Designs found"
      : "All Designs retrieved successfully",
  );
});

const getSingleDesign = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Design found" : "Design retrieved successfully",
  );
});

const createNewDesign = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const uploadedImages = await multipleImages(req.files, []);

    const token = extractToken(req.headers.authorization);
    const verifiedToken = verifyToken(token);

    const designData = await service.add(
      {
        user: verifiedToken.id,
        image: uploadedImages,
      },
      req.session,
    );

    const formData = await serviceForm.addDesign(
      verifiedToken.id,
      designData[0]._id,
      req.session,
    );

    responseHandler(
      res,
      [{ design: designData, form: formData }],
      "Design created successfully",
    );
  }),
];

const addExistingDesignToForm = asyncHandler(async (req, res) => {
  const designData = await service.getDefaultById(req.params.id);

  if (!designData)
    throw createError(STATUSCODE.BAD_REQUEST, "This image is not default");

  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const formData = await serviceForm.addDesign(
    verifiedToken.id,
    designData._id,
    req.session,
  );

  responseHandler(
    res,
    [{ design: designData, form: formData }],
    "Existing design ID added to form successfully",
  );
});

const createNewDefaultDesign = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const uploadedImages = await multipleImages(req.files, []);

    const data = await service.add(
      {
        image: uploadedImages,
      },
      req.session,
    );

    responseHandler(res, [data], "Design created successfully");
  }),
];

const updateDesign = [
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

    responseHandler(res, [data], "Design updated successfully");
  }),
];

const changeFormDesign = asyncHandler(async (req, res) => {
  const data = await serviceForm.updateDesign(
    req.params.id,
    req.body.designId,
    req.session,
  );

  responseHandler(res, [data], "Design updated successfully");
});

const deleteDesign = asyncHandler(async (req, res) => {
  const designData = await service.deleteById(req.params.id, req.session);

  const message = !designData
    ? "No Design found"
    : "Design force deleted successfully";

  await multipleImages(
    [],
    designData?.image ? designData.image.map((image) => image.public_id) : [],
  );

  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const formData = designData
    ? await serviceForm.removeDesign(
        verifiedToken.id,
        req.params.id,
        req.session,
      )
    : null;

  responseHandler(res, [{ design: designData, form: formData }], message);
});

const removeDefaultDesign = asyncHandler(async (req, res) => {
  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const data = await serviceForm.removeDesign(
    verifiedToken.id,
    req.params.id,
    req.session,
  );

  responseHandler(res, [data], "Default design removed from form successfully");
});

export {
  getAllDesigns,
  getSingleDesign,
  createNewDesign,
  createNewDefaultDesign,
  addExistingDesignToForm,
  updateDesign,
  changeFormDesign,
  deleteDesign,
  removeDefaultDesign,
};
