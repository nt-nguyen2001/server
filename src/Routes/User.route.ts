import { Router } from "express";
import { getUser } from "../Controllers/Users.Controller";
import { verifyToken } from "../Middleware/VerifyToken.Middleware";
import TCWrapper from "../Utils/TCWrapper.Utils";

const router = Router();

router
  .get("/api/users/:account", TCWrapper(getUser))
  .post("/api/users", TCWrapper(verifyToken("0")), TCWrapper(getUser));

export default router;
