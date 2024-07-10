import { Router } from "express";
import * as testController from "./controller.js";
import { METHOD, PATH } from "../../../constants/index.js";

const router = Router();

const submissionRoutes = [
  {
    method: METHOD.GET,
    handler: testController.getAllSubmissions,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED,
    handler: testController.getAllSubmissionsDeleted,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    handler: testController.getSingleSubmission,
  },
  {
    method: METHOD.POST,
    handler: testController.createNewSubmission,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    handler: testController.updateSubmission,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    handler: testController.deleteSubmission,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE,
    handler: testController.restoreSubmission,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE,
    handler: testController.forceDeleteSubmission,
  },
];

submissionRoutes.forEach((route) => {
  const { method, path = "", handler } = route;
  router[method](path, handler);
});

export default router;
