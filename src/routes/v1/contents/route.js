import { Router } from "express";
import * as contentController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const router = Router();

const contentRoutes = [
  {
    method: METHOD.GET,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: contentController.getAllContents,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: contentController.getSingleContent,
  },
  {
    method: METHOD.POST,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: contentController.createNewContent,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: contentController.updateContent,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: contentController.deleteContent,
  },
];

contentRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
