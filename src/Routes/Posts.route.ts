import { Router } from "express";
import {
  createPosts,
  deletePosts,
  getPost,
  getPosts,
  updatePost,
} from "../Controllers/Posts.controller";
import TCWrapper from "../Utils/TCWrapper.Utils";
const router = Router();

router
  .patch("/api/posts", TCWrapper(getPosts))
  .get("/api/posts/:slug", TCWrapper(getPosts)) // fix lai
  .get("/api/:idUser/posts/:idPost", TCWrapper(getPost))
  .patch("/api/:idUser/posts/:idPost", TCWrapper(updatePost))
  .delete("/api/posts/:id", TCWrapper(deletePosts))
  .post("/api/posts", TCWrapper(createPosts));
export default router;
