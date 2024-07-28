import { Router } from "express";
import * as submissionController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";

const router = Router();

const submissionRoutes = [
  {
    method: METHOD.GET,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: submissionController.getAllSubmissions,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: submissionController.getSingleSubmission,
  },
  {
    method: METHOD.POST,
    path: PATH.ID,
    handler: submissionController.createNewSubmission,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [verifyJWT],
    handler: submissionController.deleteSubmission,
  },
];

submissionRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
