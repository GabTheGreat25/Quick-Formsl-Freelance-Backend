import { Router } from "express";
import * as publishController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const router = Router();

const linkRoutes = [
  {
    method: METHOD.GET,
    handler: publishController.getAllLinks,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: publishController.getSingleLink,
  },
  {
    method: METHOD.POST,
    handler: publishController.createPublishLink,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: publishController.updatePublishLink,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    handler: publishController.deletedLink,
  },
];

linkRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
