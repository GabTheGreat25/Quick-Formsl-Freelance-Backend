import { Router } from "express";
import * as imageController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const router = Router();

const imageRoutes = [
  {
    method: METHOD.GET,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.getAllImages,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.getAllImagesDeleted,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.getSingleImage,
  },
  {
    method: METHOD.POST,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.createNewImage,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.updateImage,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.deleteImage,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.restoreImage,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: imageController.forceDeleteImage,
  },
];

imageRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
