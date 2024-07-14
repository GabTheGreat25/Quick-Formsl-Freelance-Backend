import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

const getAllInputTypes = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No InputTypes found"
      : "All InputTypes retrieved successfully",
  );
});

const getSingleInputType = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No InputType found" : "InputType retrieved successfully",
  );
});

const createNewInputType = asyncHandler(async (req, res) => {
  const data = await service.add(
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "InputType created successfully");
});

const updateInputType = asyncHandler(async (req, res) => {
  const data = await service.update(
    req.params.id,
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "InputType updated successfully");
});

const deleteInputType = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  const message = !data
    ? "No InputType found"
    : "InputType deleted successfully";

  responseHandler(res, data, message);
});

export {
  getAllInputTypes,
  getSingleInputType,
  createNewInputType,
  updateInputType,
  deleteInputType,
};
