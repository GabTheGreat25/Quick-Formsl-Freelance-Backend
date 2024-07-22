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
  const validInputTypes = inputTypes.map((inputType) => inputType.type);

  for (const field of req.body.fields) {
    if (!validInputTypes.includes(field.inputType))
      throw createError(
        STATUSCODE.BAD_REQUEST,
        `Invalid input type: ${field.inputType}`,
      );
  }

  const data = await service.update(
    req.params.id,
    {
      ...req.body,
    },
    req.session,
  );

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
