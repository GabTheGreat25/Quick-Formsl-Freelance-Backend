import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

const getAllForms = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Forms found"
      : "All Forms retrieved successfully",
  );
});

const getSingleForm = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Form found" : "Form retrieved successfully",
  );
});

const deleteForm = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  const message = !data ? "No Form found" : "Form deleted successfully";

  responseHandler(res, data, message);
});

export { getAllForms, getSingleForm, deleteForm };
