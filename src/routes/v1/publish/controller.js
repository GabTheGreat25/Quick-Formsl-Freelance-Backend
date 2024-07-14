import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

const getAllLinks = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Publish links found"
      : "All publish links found",
  );
});

const getSingleLink = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "publish link not found" : "Publish link retrieved successfully",
  );
});

const createPublishLink = [
  asyncHandler(async (req, res) => {
    const session = req.session;

    const data = await service.add(
      {
        ...req.body,
      },
      session,
    );
    responseHandler(res, [data], "Publish link created successfully");
  }),
];

const updatePublishLink = [
  asyncHandler(async (req, res) => {
    const session = req.session;

    const data = await service.update(
      req.params.id,
      {
        ...req.body,
      },
      session,
    );
    responseHandler(res, [data], "Publish link successfully updated");
  }),
];

const deletedLink = asyncHandler(async (req, res) => {
  const session = req.session;
  const data = await service.deleteById(req.params.id, session);

  responseHandler(
    res,
    !data?.deleted ? [] : data,
    !data?.deleted
      ? "Link is already deleted"
      : "Publish link successfully deleted",
  );
});

export {
  getAllLinks,
  getSingleLink,
  createPublishLink,
  updatePublishLink,
  deletedLink,
};
