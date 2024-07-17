import asyncHandler from "express-async-handler";
import service from "./service.js";
import serviceForm from "../forms/service.js";
import { STATUSCODE } from "../../../constants/index.js";
import { responseHandler } from "../../../utils/index.js";
import { extractToken, verifyToken } from "../../../middlewares/index.js";

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
  const settingData = await service.add(
    {
      ...req.body,
    },
    req.session,
  );

  const token = extractToken(req.headers.authorization);
  const verifiedToken = verifyToken(token);

  const formData = await serviceForm.addSetting(
    verifiedToken.id,
    req.body.contentId,
    settingData[0]._id,
    req.session,
  );

  responseHandler(
    res,
    [{ setting: settingData, form: formData }],
    "Setting created successfully",
  );
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

export { getAllSettings, getSingleSetting, createNewSetting, updateSetting };
