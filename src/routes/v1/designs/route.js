import { Router } from "express";
import * as designController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const router = Router();

const designRoutes = [
  {
    method: METHOD.GET,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: designController.getAllDesigns,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: designController.getSingleDesign,
  },
  {
    method: METHOD.POST,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: designController.createNewDesign,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: designController.deleteDesign,
  },
];

designRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
