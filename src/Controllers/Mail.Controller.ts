import { Request, Response } from "express";
import { DB } from "../Database";
import { generateOTP } from "../Utils/GenerateOTP.Utils";
import sendMail from "../Utils/SendMail.Utils";

export function mailRegister(req: Request, res: Response) {
  const token = generateOTP(req.body.account);
  const __instance = DB.getInstance();
  __instance._execute("Insert into OTP values(?,?,?)", [
    token,
    req.body.account,
    new Date(new Date().getTime() + 120000),
  ]);
  sendMail(req.body.account, `OTP: ${token}`);
  res.sendStatus(200);
}
