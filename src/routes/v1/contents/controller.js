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
    field.requiredFieldText = field.isRequiredField
      ? field.requiredFieldText || "This field is required"
      : undefined;

    !validInputTypes.has(field.inputType) &&
      errors.push(`Invalid input type: ${field.inputType}`);

    if (field.value && Array.isArray(field.value))
      field.value.forEach((_, index) => {
        field.valueIndex = index;
      });

    if (field.inputType === "column" && Array.isArray(field.columns)) {
      field.columns = field.columns.map((column) =>
        Object.keys(column).length > 0 ? column : null,
      );

      field.columns.forEach((column) => {
        column &&
          column.inputType &&
          !validInputTypes.has(column.inputType) &&
          errors.push(`Invalid input type: ${column.inputType}`);

        if (column.value && Array.isArray(column.value))
          column.value.forEach((_, index) => {
            column.valueIndex = index;
          });

        const isDropdownOrRadio = ["dropdown", "radio"].includes(
          column.inputType,
        );
        column &&
        isDropdownOrRadio &&
        (!column.value || !Array.isArray(column.value))
          ? errors.push(
              `${column.fieldName} must have a value for ${column.inputType} type.`,
            )
          : isDropdownOrRadio &&
            column.defaultValue &&
            !column.value.includes(column.defaultValue) &&
            errors.push(
              `Default value for ${column.fieldName} must be one of the existing values.`,
            );

        column &&
        column.inputType === "checkbox" &&
        !["true", "false"].includes(column.defaultValue)
          ? errors.push(
              `Default value for ${column.fieldName} must be "true" or "false".`,
            )
          : null;
      });
    }

    const isFieldDropdownOrRadio = ["dropdown", "radio"].includes(
      field.inputType,
    );
    isFieldDropdownOrRadio && (!field.value || !Array.isArray(field.value))
      ? errors.push(
          `Field ${field.fieldName} must have a value for ${field.inputType} type.`,
        )
      : isFieldDropdownOrRadio &&
        field.defaultValue &&
        !field.value.includes(field.defaultValue) &&
        errors.push(
          `Default value for ${field.fieldName} must be one of the existing values.`,
        );

    field &&
    field.inputType === "checkbox" &&
    !["true", "false"].includes(field.defaultValue)
      ? errors.push(
          `Default value for ${field.fieldName} must be "true" or "false".`,
        )
      : null;
  });

  if (errors.length)
    throw createError(STATUSCODE.BAD_REQUEST, errors.join(", "));

  const data = await service.update(req.params.id, req.body, req.session);

  responseHandler(res, [data], "Content updated successfully");
});

const updateAllFields = asyncHandler(async (req, res) => {
  const data = await service.update(
    req.params.id,
    {
      ...req.body,
    },
    req.session,
  );

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
