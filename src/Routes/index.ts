import { Application } from "express";
import Authentication from "./Authentication.route";
import User from "./User.route";
import Mail from "./Mail.route";
import Posts from "./Posts.route";
import Comments from "./Comments.route";

export function route(app: Application) {
  app.use(Authentication);
  app.use(User);
  app.use(Comments);
  app.use(Mail);
  app.use(Posts);
}
