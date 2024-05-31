import express from "express";

import {
  forgotPassword,
  login,
  registration,
  resetPassword,
} from "../controllers/users.mjs";
import { postComment, postlike, userPost } from "../controllers/post.mjs";
import { upload } from "../config/postPict.mjs";
import auth from "../config/auth.mjs";

const routes = express.Router();

//users routes
routes.route("/user/registration").post(registration); //for registration
routes.route("/user/login").post(login); //for login

routes.route("/user/forgot-password").post(forgotPassword); //forgot password
routes.route("/user/:id/:token").post(resetPassword); //reset password

//routes for post

routes.route("/user/post").post(auth, upload.single("avatar"), userPost);
routes.route("/user/post-comment").post(auth, postComment);
routes.route("/user/post-like").post(auth, postlike);

export default routes;
