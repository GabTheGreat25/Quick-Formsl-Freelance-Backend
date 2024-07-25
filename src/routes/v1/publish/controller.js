import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import linkService from "../links/service.js";
import { responseHandler } from "../../../utils/index.js";
import { STATUSCODE } from "../../../constants/index.js";
import { ENV } from "../../../config/environment.js";

const redirectToDecryptedUrl = asyncHandler(async (req, res) => {
  const link = await linkService.findByUrl(
    `${ENV.BACKEND_URL}/?url=${req.query.url}`,
  );

  if (!link) throw createError(STATUSCODE.NOT_FOUND, "Link not found");

  const decryptedUrl = await service.decrypt(link.encryptedUrl);

  responseHandler(
    res,
    { decryptedUrl },
    "Decrypted URL retrieved successfully",
  );
});

export { redirectToDecryptedUrl };
