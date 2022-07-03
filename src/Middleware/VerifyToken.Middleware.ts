import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import VerifyToken from "../Utils/VerifyToken.Utils";

export const verifyToken =
  (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    const token =
      (req.cookies.accessToken && req.cookies.accessToken.split(" ")[1]) ||
      null;
    if (token !== null) {
      const payload = await VerifyToken(token);
      if (payload.decoded?.role === role) {
        return next();
      }
    }
    throw new ResponseError("Bad Request!", 400);
  };
