import userRoutes from "./users/route.js";
import contentRoutes from "./contents/route.js";
import imagesRoutes from "./images/route.js";
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
  {
    url: RESOURCE.IMAGES,
    route: imagesRoutes,
  },
];

export const V2 = routes.map((route) => ({
  url: `${RESOURCE.V2}${route.url}`,
  route: route.route,
}));
