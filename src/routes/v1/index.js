import userRoutes from "./users/route.js";
import formRoutes from "./forms/route.js";
import contentRoutes from "./contents/route.js";
import inputTypeRoutes from "./inputTypes/route.js";
import imagesRoutes from "./images/route.js";
import submissionRoutes from "./submissions/route.js";
import publishRoutes from "./publish/route.js";	
import { RESOURCE } from "../../constants/index.js";

const routes = [
  {
    url: RESOURCE.USERS,
    route: userRoutes,
  },
  {
    url: RESOURCE.FORMS,
    route: formRoutes,
  },
  {
    url: RESOURCE.CONTENTS,
    route: contentRoutes,
  },
  {
    url: RESOURCE.INPUT_TYPES,
    route: inputTypeRoutes,
  },
  {
    url: RESOURCE.IMAGES,
    route: imagesRoutes,
  },
  {
    url: RESOURCE.SUBMISSIONS,
    route: submissionRoutes,
  },
  {
    url: RESOURCE.LINKS,
    route: publishRoutes,
  }
];

export const V1 = routes.map((route) => ({
  url: `${RESOURCE.V1}${route.url}`,
  route: route.route,
}));
