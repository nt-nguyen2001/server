import { Request, Response } from "express";
import { DB } from "../Database";
import { RequestWithPayload, TUser } from "../Types";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import { DeleteImage } from "../Utils/DeleteImage.Utils";
import User from "../Database/user.database";

export async function getUserByAccount(req: Request, res: Response) {
  const account = req.query?.account as string;
  const payload = await User.getByAccount(account);
  res.status(200).json({ status: 200, payload });
}
export async function getUserById(req: Request, res: Response) {
  const id = req.query?.id as string;
  const payload = await User.getById(id);
  res.status(200).json({ status: 200, payload });
}
export async function getUsers(req: Request, res: Response) {
  const payload = await User.getAll();
  return res.status(200).json({ status: 200, payload });
}
export async function updateUser(req: Request, res: Response) {
  const payload = req.body.payload;
  if (payload) {
    const data: string[] = Object.values(payload);
    const field = Object.keys(payload);
    const id = req.params.id;

    const fieldImage = field.reduce<string[]>((prev, curr) => {
      if (curr === "avatar" || curr === "background_img") {
        return [...prev, curr];
      }
      return prev;
    }, []);

    if (fieldImage.length) {
      const res = await User.getById(id);
      fieldImage?.map((key) => {
        console.log(res[0][key as keyof TUser]);
        if (res[0][key as keyof TUser]) {
          DeleteImage(res[0][key as keyof TUser]);
        }
      });
    }
    await User.update(field, data, id);
    res.send({ status: 200, message: "OK" });
  } else {
    throw new ResponseError("Payload Empty !", 400);
  }
}

export async function deleteImage(req: Request, res: Response) {
  if (req.params.id) {
    DeleteImage(req.params.id);
    res.send({ status: 200, message: "OK" });
  } else {
    res.send({ status: 400, message: "Bad Request" });
  }
}
