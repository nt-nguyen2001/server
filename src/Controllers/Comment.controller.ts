import { Request, Response } from "express";
import { DB } from "../Database";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

interface Comments {
  _userId: string;
  _commentId: string;
  _createAt: string | Date;
  _content: string;
  _responseQuantity: number | string;
}
interface ParentComments extends Comments {
  _postsId: string;
  _childComments: { [index: string]: ChildComments };
}
interface ChildComments extends Comments {
  _parentCommentId: string;
}

export async function createComments(req: Request, res: Response) {
  const _instance = DB.getInstance();
  const { _commentId, _content, _createAt, _postsId, _userId } =
    (req.body as ParentComments) || {
      _commentId: "",
      _content: "",
      _createAt: "",
      _postsId: "",
      _userId: "",
    };
  await _instance._execute("Insert into comments values(?,?,?,?,?)", [
    _commentId,
    _postsId,
    _createAt,
    _content,
    _userId,
  ]);
  res.send({ status: 200, message: "OK" });
}
export async function replyToComments(req: Request, res: Response) {
  const _instance = DB.getInstance();
  const { _commentId, _content, _createAt, _parentCommentId, _userId } =
    (req.body as ChildComments) || {
      _commentId: "",
      _content: "",
      _createAt: "",
      _parentCommentId: "",
      _userId: "",
    };
  await _instance._execute("Insert into childComments values(?,?,?,?,?)", [
    _parentCommentId,
    _commentId,
    _createAt,
    _content,
    _userId,
  ]);
  res.send({ status: 200, message: "OK" });
}
export async function getComments(req: Request, res: Response) {
  const _instance = DB.getInstance();
  const id = req.params.id || "";
  const depth = req.params.depth || "";
  if (!id) {
    throw new ResponseError("Id is empty!");
  }
  if (!depth) {
    throw new ResponseError("Depth is empty!");
  }
  let query = "";
  let queryQuantity = "";
  const params = [id];
  switch (depth) {
    case "0":
      query =
        "select * from comments where _postsId = ? order by _createAt ASC";
      queryQuantity =
        "select COUNT(cc._parentCommentId) as quantity, _parentCommentId as id from comments as c left join childComments as cc on c._commentId = cc._parentCommentId where c._postsId = ? group by cc._parentCommentId";
      break;
    case "1":
      query =
        "select * from childComments where _parentCommentId = ? order by _createAt ASC";
      queryQuantity =
        "select COUNT(c1._parentCommentId) as quantity, c1._commentId as id from childComments as c1 inner join childComments as c2 on c1._commentId = c2._parentCommentId where c1._parentCommentId = ? group by c1._parentCommentId";
      break;
    case "2":
      query =
        "select * from childComments where _parentCommentId = ? order by _createAt ASC";
      break;
  }
  const comments = await _instance._execute<ParentComments>(query, [...params]);
  let payload: { [index: string]: ParentComments } = comments.reduce(
    (pre, curr) => {
      return {
        ...pre,
        [curr._commentId]: {
          ...curr,
          _responseQuantity: 0,
          _childComments: {},
        },
      };
    },
    {}
  );
  if (queryQuantity) {
    const quantity = await _instance._execute<{
      quantity: number | string;
      id: string;
    }>(queryQuantity, [...params]);
    quantity.map((row) => {
      if (payload[row.id]) {
        payload[row.id]._responseQuantity = row.quantity;
      }
    });
  }
  res.send({ status: 200, message: "OK", payload });
}
