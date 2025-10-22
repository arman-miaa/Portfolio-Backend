import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { blgoRoute } from "../modules/blog/blogs.routes";
import { projectroute } from "../modules/projects/projects.routes";
import { skillRoute } from "../modules/skill/skill.routes";
import { contactRoute } from "../modules/contact/contact.routes";
import { contactMessageRoute } from "../modules/contactMessage/contactMessage.route";
import { experienceRoutes } from "../modules/experiences/experience.route";


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
  {
    path: "/contact",
    route: contactRoute,
  },
  {
    path: "/contact-messages",
    route: contactMessageRoute,
  },
  {
    path: "/experience",
    route: experienceRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


