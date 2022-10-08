import { Router } from "express";
import {
  createComments,
  getComments,
  // getRespondedComments,
  replyToComments,
} from "../Controllers/Comment.controller";
import TCWrapper from "../Utils/TCWrapper.Utils";
const router = Router();

router
  .post("/api/comments/", TCWrapper(createComments))
  .post("/api/comments/response", TCWrapper(replyToComments))
  // .get("/api/comments/response/:id", TCWrapper(getRespondedComments))
  .get("/api/comments/:id/:depth", TCWrapper(getComments));
export default router;
