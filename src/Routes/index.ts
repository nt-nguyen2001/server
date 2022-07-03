import { Application } from "express";
import Authentication from "./Authentication.route";
import User from "./User.route";
import Mail from "./Mail.route";

export function route(app: Application) {
  app.use(Authentication);
  app.use(User);
  app.use(Mail);
}
