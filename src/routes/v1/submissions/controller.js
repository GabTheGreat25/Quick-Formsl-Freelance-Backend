import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import serviceForm from "../forms/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

const getAllSubmissions = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Submissions found"
      : "All Submissions retrieved successfully",
  );
});

const getSingleSubmission = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Submission found" : "Submission retrieved successfully",
  );
});

const createNewSubmission = asyncHandler(async (req, res) => {
  const form = await serviceForm.getById(req.params.id);

  const validFieldNames = form.content.fields.map((field) => field.fieldName);
  const values = {};

  for (const fieldName of validFieldNames) {
    if (!req.body.hasOwnProperty(fieldName))
      throw createError(
        STATUSCODE.BAD_REQUEST,
        `Field '${fieldName}' is required`,
      );

    const value = req.body[fieldName];

    values[fieldName] = Array.isArray(value)
      ? value.filter((item) => typeof item === "string")
      : value;
  }

  const data = await service.add(
    {
      content: req.params.id,
      values,
    },
    req.session,
  );

  responseHandler(res, [data], "Submission created successfully");
});

const updateSubmission = asyncHandler(async (req, res) => {
  const data = await service.update(
    req.params.id,
    {
      ...req.body,
      image: uploadNewImages,
    },
    req.session,
  );

  responseHandler(res, [data], "Submission updated successfully");
});

const deleteSubmission = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  const message = !data
    ? "No Submission found"
    : "Submission deleted successfully";

  responseHandler(res, [data], message);
});

export {
  getAllSubmissions,
  getSingleSubmission,
  createNewSubmission,
  updateSubmission,
  deleteSubmission,
};
