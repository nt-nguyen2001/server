import jwt, { TokenExpiredError } from "jsonwebtoken";

interface payLoad {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export default async function VerifyToken(token: string) {
  let payload: {
    error: number;
    message: string;
    decoded?: payLoad;
  };
  try {
    // type can't determined in callback of verify
    const decoded = (await jwt.verify(
      token,
      process.env.SECRET_KEY || "ASD"
    )) as payLoad;
    payload = {
      error: 200,
      message: "OK",
      decoded,
    };
  } catch (err) {
    const tokenError = err as TokenExpiredError;
    payload = {
      error: 400,
      message: tokenError.message,
    };
    throw payload;
  }
  return payload;
}
