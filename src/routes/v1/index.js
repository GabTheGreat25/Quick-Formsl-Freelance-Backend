import userRoutes from "./users/route.js";
import { RESOURCE } from "../../constants/index.js";

const routes = [
  {
    url: RESOURCE.USERS,
    route: userRoutes,
  },
];

export const V1 = routes.map((route) => ({
  url: `${RESOURCE.V1}${route.url}`,
  route: route.route,
}));
