import asyncHandler from "express-async-handler";
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

const deleteDesign = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  const message = !data
    ? "No Design found"
    : "Design force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(res, [data], message);
});

export {
  getAllDesigns,
  getSingleDesign,
  createNewDesign,
  updateDesign,
  deleteDesign,
};
