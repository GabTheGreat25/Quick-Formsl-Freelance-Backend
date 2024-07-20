import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import serviceContent from "../contents/service.js";
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
  const content = await serviceContent.getById(req.params.id);

  if (!content) throw createError(STATUSCODE.NOT_FOUND, "Create a form first");

  const fieldIdMap = content.fields.reduce((map, field) => {
    map[field._id.toString()] = field.fieldName;
    return map;
  }, {});

  const values = {};
  const errors = [];

  for (const [fieldIdStr, value] of Object.entries(req.body)) {
    const fieldName = fieldIdMap[fieldIdStr];

    values[fieldIdStr] = Array.isArray(value)
      ? value.filter((item) => typeof item === "string" && item.trim() !== "")
      : value.trim();

    if (
      (Array.isArray(value) && values[fieldIdStr].length === 0) ||
      (!Array.isArray(value) && values[fieldIdStr] === "")
    )
      errors.push(`Field '${fieldName}' must not be empty`);
  }

  for (const [fieldIdStr, fieldName] of Object.entries(fieldIdMap))
    if (!(fieldIdStr in req.body))
      errors.push(`Field '${fieldName}' is required`);

  if (errors.length > 0)
    throw createError(STATUSCODE.BAD_REQUEST, errors.join(", "));

  const submissionData = await service.add({ values }, req.session);

  const contentData = await serviceContent.addSubmissionById(
    content._id,
    submissionData[0]._id,
    req.session,
  );

  responseHandler(
    res,
    [{ submission: submissionData, content: contentData }],
    "Submission created successfully",
  );
});

const deleteSubmission = asyncHandler(async (req, res) => {
  const submissionData = await service.deleteById(req.params.id, req.session);

  const message = !submissionData
    ? "No Submission found"
    : "Submission deleted successfully";

  const content = await serviceContent.findSubmissionById(req.params.id);

  const contentData = await serviceContent.deleteSubmissionById(
    content._id,
    submissionData._id,
    req.session,
  );

  responseHandler(
    res,
    [{ submission: submissionData, content: contentData }],
    message,
  );
});

export {
  getAllSubmissions,
  getSingleSubmission,
  createNewSubmission,
  deleteSubmission,
};
