import userRoutes from "./users/route.js";
import contentRoutes from "./contents/route.js";
import { RESOURCE } from "../../constants/index.js";

const routes = [
  {
    url: RESOURCE.USERS,
    route: userRoutes,
  },
  {
    url: RESOURCE.CONTENTS,
    route: contentRoutes,
  },
];

export const V1 = routes.map((route) => ({
  url: `${RESOURCE.V1}${route.url}`,
  route: route.route,
}));
