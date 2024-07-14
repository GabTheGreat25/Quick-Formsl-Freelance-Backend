import asyncHandler from "express-async-handler";
import service from "./service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";

const getAllSettings = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  responseHandler(
    res,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Settings found"
      : "All Settings retrieved successfully",
  );
});

const getSingleSetting = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    res,
    data,
    !data ? "No Setting found" : "Setting retrieved successfully",
  );
});

const createNewSetting = asyncHandler(async (req, res) => {
  const data = await service.add(
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "Setting created successfully");
});

const updateSetting = asyncHandler(async (req, res) => {
  const data = await service.update(
    req.params.id,
    {
      ...req.body,
    },
    req.session,
  );

  responseHandler(res, [data], "Setting updated successfully");
});

const deleteSetting = asyncHandler(async (req, res) => {
  const data = await service.deleteById(req.params.id, req.session);

  const message = !data ? "No Setting found" : "Setting deleted successfully";

  responseHandler(res, data, message);
});

export {
  getAllSettings,
  getSingleSetting,
  createNewSetting,
  updateSetting,
  deleteSetting,
};
