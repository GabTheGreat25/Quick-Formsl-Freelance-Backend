import { Router } from "express";
import * as publishController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";

const router = Router();

const publishRoutes = [
  {
    method: METHOD.GET,
    path: PATH.LINK,
    handler: publishController.redirectToDecryptedUrl,
  },
];

publishRoutes.forEach((route) => {
  const { method, path = "", handler } = route;
  router[method](path, handler);
});

export default router;
