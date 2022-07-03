import { Router } from "express";
import {
  login,
  refreshToken,
  register,
} from "../Controllers/Authentication.controller";
import assignToken from "../Middleware/AssignToken.Middleware";
import TCWrapper from "../Utils/TCWrapper.Utils";

const router = Router();

router
  .get(
    "/api/auth/refreshToken",
    TCWrapper(refreshToken),
    TCWrapper(assignToken)
  )
  .post("/api/auth/login", TCWrapper(login), TCWrapper(assignToken))
  .post("/api/auth/register", TCWrapper(register));
export default router;
