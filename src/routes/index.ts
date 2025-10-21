import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";


export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
 
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


