import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

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
  const data = await service.add(
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "Design created successfully");
});

const updateDesign = asyncHandler(async (req, res) => {
  const data = await service.update(
    req.params.id,
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "Design updated successfully");
});

const deleteDesign = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  const message = !data ? "No Design found" : "Design deleted successfully";

  responseHandler(res, data, message);
});

export {
  getAllDesigns,
  getSingleDesign,
  createNewDesign,
  updateDesign,
  deleteDesign,
};
