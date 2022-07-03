import { NextFunction, Request, Response } from "express";
import { DB } from "../Database";
import { OTP, RequestWithPayload, User } from "../Types";
import VerifyToken from "../Utils/VerifyToken.Utils";
import { v4 as uuidv4 } from "uuid";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import bcrypt from "bcryptjs";

export async function login(
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) {
  const { account, password } = req.body?.payload;
  if (account && password) {
    const __instance = DB.getInstance();
    const rows = await __instance._execute<User>(
      "Select *, _password as password, _userName as userName, _userId as userId From User where _account = ?",
      [account]
    );
    if (rows.length === 1) {
      const responseCompare = await bcrypt.compare(password, rows[0].password);
      if (responseCompare) {
        req.payload = [
          {
            role: rows[0].role,
            userName: rows[0].userName,
            id: rows[0].userID,
          },
        ];
        return next();
      }
    }
    throw new ResponseError("The user name or password is incorrect!", 401);
  } else {
    throw new ResponseError("Payload empty!", 400);
  }
}

interface UserRegister extends User {
  otp?: string;
}

export async function register(req: RequestWithPayload, res: Response) {
  const payload: UserRegister = req.body?.payload;
  const __instance = DB.getInstance();
  if (payload) {
    const rows = await __instance._execute<OTP>(
      "Select * From otp where _account = ? and token = ? ",
      [payload.account, payload.otp]
    );
    if (
      rows.length >= 1 &&
      new Date(rows[0]._expire).getTime() > new Date().getTime()
    ) {
      // console.log(process.env.HASH || 10);
      const hashPassword = await bcrypt.hash(payload.password, 10);
      await __instance._execute("Insert into user values(?,?,?,?,?,?)", [
        uuidv4(),
        payload.account,
        payload.userName,
        hashPassword,
        payload.phoneNumber,
        0,
      ]);
      res.status(200).send({ status: 200, message: "OK" });
    }
  } else {
    throw new ResponseError("payload empty!", 400);
  }
}

export async function refreshToken(
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) {
  const refreshToken =
    (req.cookies?.refreshToken && req.cookies?.refreshToken.split(" ")[1]) ||
    "a";
  const verifiedToken = await VerifyToken(refreshToken);
  req.payload = [
    {
      id: verifiedToken.decoded?.id,
      role: verifiedToken.decoded?.role,
    },
  ];
  next();
}
