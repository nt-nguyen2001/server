import { Router } from "express";
import {
  deleteImage,
  getUserByAccount,
  getUserById,
  getUsers,
  updateUser,
} from "../Controllers/Users.Controller";
import verifyToken from "../Middleware/VerifyToken.Middleware";
import TCWrapper from "../Utils/TCWrapper.Utils";

const router = Router();

router
  .get(
    "/api/users/account",
    TCWrapper(verifyToken("0")),
    TCWrapper(getUserByAccount)
  )
  .get("/api/users/id", TCWrapper(verifyToken("0")), TCWrapper(getUserById))
  .get("/api/users", TCWrapper(verifyToken("0")), TCWrapper(getUsers))
  .delete("/api/users/image/:id", deleteImage)
  .patch("/api/users/:id/", TCWrapper(updateUser));

export default router;
