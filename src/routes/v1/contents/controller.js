import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

const getAllContents = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Contents found"
      : "All Contents retrieved successfully",
  );
});

const getAllContentsDeleted = asyncHandler(async (req, res) => {
  const data = await service.getAllDeleted();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Contents found"
      : "All Deleted Contents retrieved successfully",
  );
});

const getSingleContent = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Content found" : "Content retrieved successfully",
  );
});

const createNewContent = asyncHandler(async (req, res) => {
  const data = await service.add(
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "Content created successfully");
});

const updateContent = asyncHandler(async (req, res) => {
  const data = await service.update(
    req.params.id,
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "Content updated successfully");
});

const deleteContent = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  responseHandler(
    res,
    data?.deleted ? [] : [data],
    data?.deleted
      ? "Content is already deleted"
      : "Content deleted successfully",
  );
});

const restoreContent = asyncHandler(async (req, res) => {
  const data = await service.restoreById(req.params.id, req.session);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted ? "Content is not deleted" : "Content restored successfully",
  );
});

const forceDeleteContent = asyncHandler(async (req, res) => {
  const data = await service.forceDelete(req.params.id, req.session);

  const message = !data
    ? "No Content found"
    : "Content force deleted successfully";

  responseHandler(res, data, message);
});

export {
  getAllContents,
  getAllContentsDeleted,
  getSingleContent,
  createNewContent,
  updateContent,
  deleteContent,
  restoreContent,
  forceDeleteContent,
};
