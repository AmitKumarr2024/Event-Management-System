import express from "express";
import {
  allUser,
  login,
  Logout,
  singleUser,
  updateUserDetails,
  userRegister,
} from "../controllers/User.Controller.js";
import jwtAuth from "../middlewares/JwtAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const routes = new express.Router();

routes.post("/createUser", userRegister);
routes.post("/loginUser", login);
routes.get("/singleUser/:id", jwtAuth, isAdmin, singleUser);
routes.patch("/updateUser/:id", jwtAuth,isAdmin, updateUserDetails);
routes.get("/allUser", jwtAuth,isAdmin, allUser);
routes.post("/logout", jwtAuth, Logout);

export default routes;
