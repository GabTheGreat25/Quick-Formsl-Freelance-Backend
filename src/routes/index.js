import { V1 } from "./v1/index.js";

export const routes = [...V1];

export const addRoutes = (app) => {
  routes.forEach((route) => {
    app.use(route.url, route.route);
  });
};
