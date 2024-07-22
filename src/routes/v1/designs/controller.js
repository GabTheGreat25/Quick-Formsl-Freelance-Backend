import asyncHandler from "express-async-handler";
import service from "./service.js";
import serviceForm from "../forms/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";
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

const createNewDesign = asyncHandler(async (req, res) => {
  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const designData = await service.add(
    {
      content: {
        contentId: req.body.contentId,
        imageId: req.body.imageId,
        position: req.body.position,
      },
    },
    req.session,
  );

  const formData = await serviceForm.addDesign(
    verifiedToken.id,
    req.body.contentId,
    designData[0]._id,
    req.session,
  );

  responseHandler(
    res,
    [{ design: designData, form: formData }],
    "Design created successfully",
  );
});

const deleteDesign = asyncHandler(async (req, res) => {
  const designData = await service.deleteById(req.params.id, req.session);

  const message = !designData
    ? "No Design found"
    : "Design force deleted successfully";

  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const formData = await serviceForm.removeDesign(
    verifiedToken.id,
    req.params.id,
    req.session,
  );

  responseHandler(res, [{ design: designData, form: formData }], message);
});

export { getAllDesigns, getSingleDesign, createNewDesign, deleteDesign };
