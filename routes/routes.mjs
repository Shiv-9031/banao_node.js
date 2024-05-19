import express from "express";

import {
  forgotPassword,
  login,
  registration,
  resetPassword,
} from "../controllers/users.mjs";

const routes = express.Router();

//users routes
routes.route("/user/registration").post(registration); //for registration
routes.route("/user/login").post(login); //for login

routes.route("/user/forgot-password").post(forgotPassword); //forgot password
routes.route("/user/:id/:token").post(resetPassword); //reset password

export default routes;
