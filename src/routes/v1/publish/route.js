import { Router } from "express";
import * as publishController from "./controller.js";
import { METHOD } from "../../../constants/index.js";

const router = Router();

const publishRoutes = [
  {
    method: METHOD.GET,
    handler: publishController.redirectToDecryptedUrl,
  },
];

publishRoutes.forEach((route) => {
  const { method, path = "", handler } = route;
  router[method](path, handler);
});

export default router;
