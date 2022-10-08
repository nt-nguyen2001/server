import { Request, Response } from "express";
import { DB } from "../Database";
import { DeleteImage } from "../Utils/DeleteImage.Utils";

interface Posts {
  _postsId: string;
  _userId: string;
  _createAt: string | Date;
  _content: string;
  _like: string | number;
  _images: string[] | string;
}

export async function createPosts(req: Request, res: Response) {
  const _instance = DB.getInstance();
  const post: Posts = req.body.params;
  post._createAt = new Date(post._createAt);
  if (post._images.length) {
    const images =
      Array.isArray(post._images) &&
      post._images.map((image) => [post._postsId, image]);
    await _instance._query("Insert into posts_image values ?", [images]);
  }

  await _instance._query("Insert into posts values(?,?,?,?,?);", [
    post._postsId,
    post._userId,
    post._createAt,
    post._content,
    post._like,
  ]);
  res.send({ status: 200, message: "OK" });
}
export async function getPosts(req: Request, res: Response) {
  const _instance = DB.getInstance();
  const rows = await _instance._execute<Posts>(
    "Select u.avatar, u._userId, u._userName, u.avatar, p._postsId, p._createAt, p._content, p._like, p_i._images From  (select * from user where _userId = ?) as u, Posts as p left join Posts_Image as p_i on p._postsId = p_i._postsId where p._userId = ? order by p._createAt DESC",
    [req.params.slug || "", req.params.slug || ""]
  );
  const newRows = rows.reduce<Posts[]>((previousRow, currentRow) => {
    const previous = previousRow[previousRow.length - 1];
    if (previous?._postsId === currentRow?._postsId) {
      previous._images = [...previous._images, currentRow._images as string];
      return [...previousRow] as Posts[];
    }
    currentRow._images = currentRow._images
      ? [currentRow._images as string]
      : [];
    return [...previousRow, currentRow];
  }, []);
  res.status(200).json({ payload: newRows });
}
export async function getPost(req: Request, res: Response) {
  const _instance = DB.getInstance();
  const rows = await _instance._execute<Posts>(
    "Select u.avatar, u._userId, u._userName, u.avatar, p._postsId, p._createAt, p._content, p._like, p_i._images From  (select * from user where _userId = ?) as u, Posts as p, posts_Image as p_i where p._userId = ? and p_i._postsId = ?  and p._postsId = p_i._postsId",
    [req.params.idUser || "", req.params.idUser || "", req.params.idPost || ""]
  );

  const newRows = rows.reduce<Posts[]>((previousRow, currentRow) => {
    const previous = previousRow[previousRow.length - 1];
    if (previous?._postsId === currentRow?._postsId) {
      previous._images = [...previous._images, currentRow._images as string];
      return [...previousRow] as Posts[];
    }
    currentRow._images = [currentRow._images as string];
    return [...previousRow, currentRow];
  }, []);
  res.status(200).json({ status: 200, message: "OK", payload: newRows });
}
export async function updatePost(req: Request, res: Response) {
  const {
    _content = "",
    _images = "",
    _postsId = "",
  }: Posts = req.body.payload;
  const _instance = DB.getInstance();

  let deletedImages;
  let sqlSelect = `Select _images from Posts_Image where _postsId = ? and _images NOT IN (?)`;
  let sqlDelete =
    "Delete from Posts_Image where _postsId = ? and _images NOT IN (?)";
  let sqlUpdate =
    "Update Posts set _content = ? where _postsId = ?; Insert Ignore into Posts_image values ?";
  let params: any[] = [_postsId, _images];
  const images =
    Array.isArray(_images) && _images.map((image, index) => [_postsId, image]);
  let paramsUpdate: any[] = [_content, _postsId, images];

  if (_images.length === 0) {
    sqlSelect = "Select _images from Posts_Image where _postsId = ? ";
    params = [_postsId];
    sqlDelete = `Delete from Posts_Image where _postsId = ?`;
    sqlUpdate = "Update Posts set _content = ? where _postsId = ?;";
  }
  deletedImages = await _instance._query<{
    _images: string;
  }>(`${sqlSelect}`, [...params]);
  deletedImages.map(({ _images }) => {
    if (_images) {
      DeleteImage(_images);
    }
  });
  await _instance._query(`${sqlDelete}`, [...params]);
  await _instance._query(`${sqlUpdate}`, [...paramsUpdate]);
  res.status(200).json({ status: 200, message: "OK" });
}
export async function deletePosts(req: Request, res: Response) {
  const _instance = DB.getInstance();
  const task1 = _instance._query("Delete from Posts where _postsId = ?", [
    req.params.id || "",
  ]);
  const images = _instance._query<{ image: string }>(
    "Select _images as image from Posts_Image where _postsId = ? ",
    [req.params.id || ""]
  );
  (await images).map(({ image }) => {
    DeleteImage(image);
  });
  const task2 = _instance._query("Delete from Posts_Image where _postsId = ?", [
    req.params.id || "",
  ]);

  await Promise.all([task1, task2]);

  res.status(200).send({ status: 200, message: "OK" });
}
