import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { blgoRoute } from "../modules/blog/blogs.routes";


export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/blog",
    route: blgoRoute,
  },
 
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


