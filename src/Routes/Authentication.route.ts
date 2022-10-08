import VerifyToken from "../Middleware/VerifyToken.Middleware";
import { Router } from "express";
import {
  CheckUserExists,
  login,
  logOut,
  refreshToken,
  register,
  VerifyLogin,
} from "../Controllers/Authentication.controller";
import assignToken from "../Middleware/AssignToken.Middleware";
import TCWrapper from "../Utils/TCWrapper.Utils";
import assignRefreshToken from "../Middleware/AssignRefreshToken.Middleware";

const router = Router();

router
  .get(
    "/api/auth/refreshToken",
    TCWrapper(refreshToken),
    TCWrapper(assignToken)
  )
  .get("/api/auth/verifyLogin", TCWrapper(VerifyLogin))
  .get("/api/auth/userExists/:slug", TCWrapper(CheckUserExists))
  .get("/api/auth/logOut", logOut)
  .post(
    "/api/auth/login",
    TCWrapper(login),
    TCWrapper(assignRefreshToken),
    TCWrapper(assignToken)
  )
  .post("/api/auth/register", TCWrapper(register));
export default router;
