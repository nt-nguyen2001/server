import { Request } from "express";

export interface User {
  userID: string;
  account: string;
  userName: string;
  password: string;
  phoneNumber: string;
  role: string;
}
export interface RequestWithPayload extends Request {
  payload?: Object[];
}
export interface OTP {
  token: string;
  _account: string;
  _expire: Date;
}
