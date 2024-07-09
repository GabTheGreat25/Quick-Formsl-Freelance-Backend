import { V1 } from "./v1/index.js";
import { V2 } from "./v2/index.js";
import { RESOURCE } from "../constants/index.js";

export const routes = [...V1, ...V2];

export const addRoutes = (app) => {
  routes.forEach((route) => {
    app.use(`${RESOURCE.API}${route.url}`, route.route);
  });
};
