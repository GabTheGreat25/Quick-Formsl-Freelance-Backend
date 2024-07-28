import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import contentService from "../contents/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";
import { ENV } from "../../../config/environment.js";

const getAllLinks = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO ? "No links found" : "All links found",
  );
});

const createLink = asyncHandler(async (req, res) => {
  const content = await contentService.getById(req.body.content);

  if (!content) throw createError(STATUSCODE.BAD_REQUEST, "Content not found");

  const existingPublish = await service.find({ content: req.body.content });

  if (existingPublish)
    throw createError(
      STATUSCODE.CONFLICT,
      "Link already exists for this content",
    );

  const urlLink = `${ENV.BACKEND_URL}/?url=${await service.generateLink()}`;

  const encryptedUrl = await service.encrypt(
    `${ENV.BACKEND_URL}/submissions/${req.body.content}`,
  );

  const data = await service.add(
    { urlLink, encryptedUrl, content: req.body.content },
    req.session,
  );

  responseHandler(res, [data], "Link created successfully");
});

const deleteLink = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  const message = !data ? "No Link found" : "Link deleted successfully";

  responseHandler(res, data, message);
});

export { getAllLinks, createLink, deleteLink };
