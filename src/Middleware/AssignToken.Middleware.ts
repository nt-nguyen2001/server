import { Response } from "express";
import { RequestWithPayload } from "../Types";
import generateToken from "../Utils/GenerateToken.Utils";

async function assignToken(req: RequestWithPayload<Object>, res: Response) {
  const payload = req?.payload?.[0] || { null: "null" };
  const accessToken = await generateToken(payload, { expiresIn: "3h" });
  res
    .cookie("accessToken", "Bearer " + accessToken, {
      expires: new Date(Date.now() + 3 * 3600000),
      httpOnly: true,
    })
    .send({ status: 200, message: "OK", payload: req.payload });
}

export default assignToken;
