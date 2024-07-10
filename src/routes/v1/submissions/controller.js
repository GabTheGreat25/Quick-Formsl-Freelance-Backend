import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

const getAllSubmissions = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Submissions found"
      : "All Submissions retrieved successfully",
  );
});

const getAllSubmissionsDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Submissions found"
      : "All Deleted Submissions retrieved successfully",
  );
});

const getSingleSubmission = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Submission found" : "Submission retrieved successfully",
  );
});

const createNewSubmission = asyncHandler(async (req, res) => {
  const data = await service.add(
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "Submission created successfully");
});

const updateSubmission = asyncHandler(async (req, res) => {
  const data = await service.update(
    req.params.id,
    {
      ...req.body,
      image: uploadNewImages,
    },
    req.session,
  );

  responseHandler(res, [data], "Submission updated successfully");
});

const deleteSubmission = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted
      ? "Submission is already deleted"
      : "Submission deleted successfully",
  );
});

const restoreSubmission = asyncHandler(async (req, res) => {
  const data = await service.restoreById(req.params.id, req.session);

  responseHandler(
    res,
    !data?.deleted ? [] : [data],
    !data?.deleted
      ? "Submission is not deleted"
      : "Submission restored successfully",
  );
});

const forceDeleteSubmission = asyncHandler(async (req, res) => {
  const data = await service.forceDelete(req.params.id, req.session);

  const message = !data
    ? "No Submission found"
    : "Submission force deleted successfully";

  responseHandler(res, [data], message);
});

export {
  getAllSubmissions,
  getAllSubmissionsDeleted,
  getSingleSubmission,
  createNewSubmission,
  updateSubmission,
  deleteSubmission,
  restoreSubmission,
  forceDeleteSubmission,
};
