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

    field.inputType === "column" &&
      field.columns?.forEach((column) => {
        !validInputTypes.has(column.inputType) &&
          errors.push(`Invalid input type in column: ${column.inputType}`);

        column.isRequiredField &&
          (!column.fieldName || !column.requiredFieldText) &&
          errors.push(
            column.requiredFieldText ||
              `Column field ${column.fieldName || column.inputType.charAt(0).toUpperCase() + column.inputType.slice(1)} is required but no specific error message is provided`,
          );
      });
  });

  if (errors.length)
    throw createError(STATUSCODE.BAD_REQUEST, errors.join(", "));

  const data = await service.update(req.params.id, req.body, req.session);
  responseHandler(res, [data], "Content updated successfully");
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
  deleteContent,
};
