import User from "../routes/v1/users/model.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/handlerError.js";

export const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
};
