import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import serviceInputType from "../inputTypes/service.js";
import serviceForm from "../forms/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";
import { extractToken, verifyToken } from "../../../middlewares/index.js";

const getAllContents = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Contents found"
      : "All Contents retrieved successfully",
  );
});

const getSingleContent = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Content found" : "Content retrieved successfully",
  );
});

const createNewContent = asyncHandler(async (req, res) => {
  const inputTypes = await serviceInputType.find();
  const validInputTypes = inputTypes.map((inputType) => inputType.type);

  const validateFields = (fields) => {
    for (const field of fields) {
      const inputType = field.inputType;

      if (!validInputTypes.includes(inputType))
        throw createError(
          STATUSCODE.BAD_REQUEST,
          `Invalid input type: ${inputType}`,
        );

      if (inputType === "column" && field.columns)
        validateFields(field.columns);
    }
  };

  if (req.body.fields) validateFields(req.body.fields);

  const contentData = await service.add(
    {
      ...req.body,
    },
    req.session,
  );

  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const formData = await serviceForm.addContent(
    verifiedToken.id,
    contentData[0]._id,
    req.session,
  );

  responseHandler(
    res,
    [{ content: contentData, form: formData }],
    "Content created successfully",
  );
});

const updateContent = asyncHandler(async (req, res) => {
  const inputTypes = await serviceInputType.find();
  const validInputTypes = new Set(
    inputTypes.map((inputType) => inputType.type),
  );

  const errors = [];

  req.body.fields.forEach((field) => {
    !validInputTypes.has(field.inputType) &&
      errors.push(`Invalid input type: ${field.inputType}`);

    field.isRequiredField &&
      (!field.fieldName || !field.requiredFieldText) &&
      errors.push(
        field.requiredFieldText ||
          `Field ${field.fieldName || field.inputType.charAt(0).toUpperCase() + field.inputType.slice(1)} is required but no specific error message is provided`,
      );

    if (!field.isRequiredField) field.requiredFieldText = undefined;

    if (field.inputType === "column")
      field.columns?.forEach((column) => {
        !validInputTypes.has(column.inputType) &&
          errors.push(`Invalid input type: ${column.inputType}`);

        column.isRequiredField &&
          (!column.fieldName || !column.requiredFieldText) &&
          errors.push(
            column.requiredFieldText ||
              `Field ${column.fieldName || column.inputType.charAt(0).toUpperCase() + column.inputType.slice(1)} is required but no specific error message is provided`,
          );

        if (!column.isRequiredField) column.requiredFieldText = undefined;
      });
  });

  if (errors.length)
    throw createError(STATUSCODE.BAD_REQUEST, errors.join(", "));

  const data = await service.update(req.params.id, req.body, req.session);
  responseHandler(res, [data], "Content updated successfully");
});

const updateAllFields = asyncHandler(async (req, res) => {
  const content = await service.getById(req.params.id);

  const inputTypes = await serviceInputType.find();
  const validInputTypes = new Set(inputTypes.map((type) => type.type));
  const errors = [];

  const processField = (field) => {
    field.placeholderText = req.body.placeholderText;
    field.isRequiredField = req.body.isRequiredField;
    field.requiredFieldColor = req.body.requiredFieldColor;
    field.requiredFieldText = req.body.requiredFieldText;
    field.style = { ...field.style, ...req.body.style };

    !validInputTypes.has(field.inputType) &&
      errors.push(`Invalid input type: ${field.inputType}`);

    field.isRequiredField &&
      !field.requiredFieldText &&
      errors.push(
        `Field ${field.fieldName || field.inputType.charAt(0).toUpperCase() + field.inputType.slice(1)} is required but no specific error message is provided`,
      );

    !field.isRequiredField && (field.requiredFieldText = undefined);
  };

  const processColumn = (column) => {
    column.placeholderText = req.body.placeholderText;
    column.isRequiredField = req.body.isRequiredField;
    column.requiredFieldColor = req.body.requiredFieldColor;
    column.requiredFieldText = req.body.requiredFieldText;
    column.style = { ...column.style, ...req.body.style };

    !validInputTypes.has(column.inputType) &&
      errors.push(`Invalid input type: ${column.inputType}`);

    column.isRequiredField &&
      !column.requiredFieldText &&
      errors.push(
        `Field ${column.fieldName || column.inputType.charAt(0).toUpperCase() + column.inputType.slice(1)} is required but no specific error message is provided`,
      );

    !column.isRequiredField && (column.requiredFieldText = undefined);
  };

  content.fields.forEach((field) =>
    field.inputType === "column" && field.columns
      ? field.columns.forEach((column) => processColumn(column))
      : processField(field),
  );

  if (errors.length)
    throw createError(STATUSCODE.BAD_REQUEST, errors.join(", "));

  const data = await content.save();
  responseHandler(res, [data], "All fields updated successfully");
});

const deleteContent = asyncHandler(async (req, res) => {
  const contentData = await service.deleteById(req.params.id);

  const message = !contentData
    ? "No Content found"
    : "Content deleted successfully";

  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const formData = await serviceForm.removeContent(
    verifiedToken.id,
    req.params.id,
    req.session,
  );

  responseHandler(res, [{ content: contentData, form: formData }], message);
});

export {
  getAllContents,
  getSingleContent,
  createNewContent,
  updateContent,
  updateAllFields,
  deleteContent,
};
