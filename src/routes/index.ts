import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { blgoRoute } from "../modules/blog/blogs.routes";
import { projectroute } from "../modules/projects/projects.routes";
import { skillRoute } from "../modules/skill/skill.routes";


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
  {
    path: "/project",
    route: projectroute,
  },
  {
    path: "/skill",
    route: skillRoute,
  },
 
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


