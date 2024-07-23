import { Router } from "express";
import * as linkController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const router = Router();

const linkRoutes = [
  {
    method: METHOD.GET,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: linkController.getAllLinks,
  },
  {
    method: METHOD.POST,
    handler: linkController.createLink,
  },
  {
    method: METHOD.GET,
    path: PATH.URL,
    handler: linkController.redirectToDecryptedUrl,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: linkController.deleteLink,
  },
];

linkRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
