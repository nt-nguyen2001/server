import { NextFunction, Request, Response } from "express";
import Authentication from "../Database/authentication.database";
import User from "../Database/user.database";
import { RequestWithPayload, TUser } from "../Types";
import { NewError, ResponseError } from "../Utils/CustomThrowError.Utils";
import VerifyToken from "../Utils/VerifyToken.Utils";

export async function login(
  req: RequestWithPayload<Partial<TUser>>,
  res: Response,
  next: NextFunction
) {
  const { _account, _password }: TUser = req.body?.payload || {
    _account: "",
    _password: "",
  };
  if (_account && _password) {
    const payload = await Authentication.Login(_account, _password);
    req.payload = [payload];
    return next();
  } else throw new ResponseError("Payload empty!", 400);
}

export async function logOut(req: Request, res: Response) {
  const refreshToken =
    (req.cookies?.refreshToken && req.cookies?.refreshToken.split(" ")[1]) ||
    "a";
  await Authentication.Logout(refreshToken);
  res
    .cookie("accessToken", "", {
      expires: new Date(),
    })
    .cookie("refreshToken", " ", {
      expires: new Date(),
    })
    .send({ status: 200, message: "OK" });
}

export async function register(req: RequestWithPayload<TUser>, res: Response) {
  const payload: TUser = req.body?.payload;
  if (Object.values(payload).every((item) => item)) {
    await Authentication.Register(payload)
      .then(() => res.status(200).send({ status: 200, message: "OK" }))
      .catch((err) => {
        const { error, message } = err as NewError;
        console.log(err);
        if (error) {
          res.status(error).send({ status: error, message: message });
        } else {
          res
            .status(500)
            .send({ status: 500, message: "Internal Sever Error!" });
        }
      });
  } else {
    throw new ResponseError("payload empty!", 400);
  }
}

export async function refreshToken(
  req: RequestWithPayload<Partial<TUser>>,
  res: Response,
  next: NextFunction
) {
  const refreshToken =
    (req.cookies?.refreshToken && req.cookies?.refreshToken.split(" ")[1]) ||
    null;
  if (refreshToken) {
    const token = await Authentication.RefreshToken(refreshToken);
    if (token.length >= 1) {
      const { decoded } = await VerifyToken(refreshToken);
      req.payload = [
        {
          _userId: decoded?._userId || "",
          role: decoded?.role || "",
        },
      ];
      next();
    }
    return;
  } else {
    throw new ResponseError("invalid token", 400);
  }
}

export async function CheckUserExists(req: Request, res: Response) {
  const slug = req.params?.slug;
  if (slug) {
    const payload = await Authentication.CheckUserExists(slug);
    if (payload.length === 0) {
      return res.status(200).json({ status: 200, message: "OK" });
    }
    throw new ResponseError("User exists already!", 400);
  }
  throw new ResponseError("Account is empty!", 400);
}
export async function VerifyLogin(req: Request, res: Response) {
  const token =
    (req.cookies.accessToken && req.cookies.accessToken.split(" ")[1]) || null;

  const { decoded } = await VerifyToken(token);
  const { _userId, role } = decoded || { _userId: "", role: "" };
  const user = await User.getById(decoded?._userId || "");
  const { avatar, background_img, _name } = user?.[0] || {
    _userName: "",
    background_img: "",
    avatar: "",
  };
  res.status(200).send({
    payload: [{ _userId, role, avatar, background_img, _name }],
    message: "OK",
    status: 200,
  });
}
