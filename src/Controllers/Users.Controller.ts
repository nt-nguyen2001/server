import { Request, Response } from "express";
import { DB } from "../Database";
import TCWrapper from "../Utils/TCWrapper.Utils";

export async function getUser(req: Request, res: Response) {
  const __instance = DB.getInstance();

  let payload;
  if (req.params.account) {
    payload = await __instance._execute(
      "Select * From User Where _account = ?",
      [req.params.account]
    );
  } else {
    payload = await __instance._execute("Select * From User");
  }
  res.status(200).json({ status: 200, payload });
}
