import { NextFunction, Request, Response } from "express";
import { RequestWithPayload } from "../Types";
import generateToken from "../Utils/GenerateToken.Utils";

async function assignToken(req: RequestWithPayload, res: Response) {
  const payload = req?.payload?.[0] || { null: "null" };
  const accessToken = await generateToken(payload, { expiresIn: "3h" });
  const refreshToken = await generateToken(payload, {
    expiresIn: "1d",
  });
  res
    .cookie("accessToken", "Bearer " + accessToken, {
      expires: new Date(Date.now() + 3 * 3600000),
      httpOnly: true,
    })
    .cookie("refreshToken", "Bearer " + refreshToken, {
      expires: new Date(Date.now() + 24 * 3600000),
      httpOnly: true,
    })
    .sendStatus(200);
  // .send({ status: 200, message: "OK", payload: req.payload });
}

export default assignToken;
