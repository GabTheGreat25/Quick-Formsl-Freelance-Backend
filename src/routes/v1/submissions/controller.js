import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import serviceContent from "../contents/service.js";
import serviceSetting from "../settings/service.js";
import formService from "../forms/service.js";
import userService from "../users/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";
import { sendAdminEmail, sendCustomerEmail } from "../../../utils/index.js";

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

  const flattenFields = (fields) => {
    const flatMap = {};
    const processField = (field) => {
      field.inputType === "column"
        ? field.columns.forEach(processField)
        : (flatMap[field._id.toString()] = field.fieldName);
    };
    fields.forEach(processField);
    return flatMap;
  };

  const fieldIdMap = flattenFields(content.fields);
  const values = {};
  const errors = [];

  Object.entries(req.body).forEach(([fieldIdStr, value]) => {
    const fieldName = fieldIdMap[fieldIdStr];
    values[fieldIdStr] = Array.isArray(value)
      ? value.filter((item) => typeof item === "string" && item.trim() !== "")
      : value.trim();
    if (values[fieldIdStr].length === 0 || values[fieldIdStr] === "")
      errors.push(`Field '${fieldName}' must not be empty`);
  });

  Object.entries(fieldIdMap).forEach(([fieldIdStr, fieldName]) => {
    if (!(fieldIdStr in req.body))
      errors.push(`Field '${fieldName}' is required`);
  });

  if (errors.length > 0)
    throw createError(STATUSCODE.BAD_REQUEST, errors.join(", "));

  const submissionData = await service.add({ values }, req.session);
  const contentData = await serviceContent.addSubmissionById(
    content._id,
    submissionData[0]._id,
    req.session,
  );

  const form = await formService.findByContentId(content._id);
  const formData = await formService.incrementSubmissionCount(
    form._id,
    content._id,
    req.session,
  );

  const specificForm = formData.form.find(
    (f) => f.content.toString() === content._id.toString(),
  );
  const submissionCount = specificForm ? specificForm.submissionCount : 0;

  const getDynamicFieldValue = (keyword) => {
    for (const [fieldIdStr, value] of Object.entries(values)) {
      const fieldName = fieldIdMap[fieldIdStr].toLowerCase();
      if (fieldName.includes(keyword)) return value;
    }
    return null;
  };

  const getAllDynamicFieldValues = () => {
    const dynamicFieldValues = {};

    for (const [fieldIdStr, value] of Object.entries(values)) {
      const fieldName = fieldIdMap[fieldIdStr].toLowerCase();
      if (fieldName) dynamicFieldValues[fieldName] = value;
    }

    return dynamicFieldValues;
  };

  const nameFields = Object.values(fieldIdMap).filter((fieldName) =>
    fieldName.toLowerCase().includes("name"),
  );

  const nameValues = nameFields
    .map((keyword) => getDynamicFieldValue(keyword.toLowerCase()))
    .filter(Boolean);

  const customerName =
    nameValues.length > 1 ? nameValues.join(" ") : nameValues[0] || "Customer";

  const email = getDynamicFieldValue("email");
  const setting = await serviceSetting.getByContentId(content._id);
  const result = getAllDynamicFieldValues();

  if (setting.isEmailParticipant && email)
    await sendCustomerEmail(email, customerName);

  if (setting.isEmailAdmin) {
    const { email, name } = await userService.getById(form.user);
    await sendAdminEmail(email, name, result, submissionCount);
  }

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
