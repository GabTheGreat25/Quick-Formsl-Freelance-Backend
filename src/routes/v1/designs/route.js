import { Router } from "express";
import * as designController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const router = Router();

const designRoutes = [
  {
    method: METHOD.GET,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.getAllDesigns,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.getSingleDesign,
  },
  {
    method: METHOD.GET,
    path: PATH.FIND_DEFAULT,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.addExistingDesignToForm,
  },
  {
    method: METHOD.POST,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.createNewDesign,
  },
  {
    method: METHOD.POST,
    path: PATH.DEFAULT_DESIGN,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.createNewDefaultDesign,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.updateDesign,
  },
  {
    method: METHOD.PATCH,
    path: PATH.CHANGE_DEFAULT,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.changeFormDesign,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.deleteDesign,
  },
  {
    method: METHOD.PATCH,
    path: PATH.REMOVE_DEFAULT,
    // roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    // middleware: [verifyJWT],
    handler: designController.removeDefaultDesign,
  },
];

designRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
