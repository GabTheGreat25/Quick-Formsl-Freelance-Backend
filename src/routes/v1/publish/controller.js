import asyncHandler from "express-async-handler";
import createError from "http-errors";
import service from "./service.js";
import linkService from "../links/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { ENV } from "../../../config/environment.js";

const redirectToDecryptedUrl = asyncHandler(async (req, res) => {
  const link = await linkService.findByUrl(
    `${ENV.BACKEND_URL}/${req.params.link}`,
  );

  if (!link) throw createError(STATUSCODE.NOT_FOUND, "Link not found");

  const decryptedUrl = await service.decrypt(link.encryptedUrl);

  res.redirect(decryptedUrl);
});

export { redirectToDecryptedUrl };
