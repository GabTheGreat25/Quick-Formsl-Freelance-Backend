import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser"; // Import cookie-parser
import { corsOptions } from "../config/index.js";
import { RESOURCE } from "../constants/index.js";
import { transaction } from "./transaction.js";

export const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cors(corsOptions),
  logger(RESOURCE.DEV),
  compression(),
  cookieParser(),
  transaction,
];

export const addMiddlewares = (app) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};
