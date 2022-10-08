import { DB } from ".";
import { TUser } from "../Types";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

const __instance = DB.getInstance();

const User = {
  getByAccount: (account: string) => {
    if (account) {
      return __instance._execute(
        "Select role, avatar, background_img, _account , _phoneNumber, _userId , _userName  From User Where _account = ?",
        [account]
      );
    }
    throw new ResponseError("Internal Server Error", 500);
  },
  getById: (id: string): Promise<Omit<TUser[], "otp">> => {
    if (id) {
      return __instance._execute<TUser>(
        "Select *  From User Where _userId = ?",
        [id]
      );
    }
    throw new ResponseError("userId is empty", 400);
  },
  getAll: (id?: string) => {
    return __instance._execute(
      "Select role, avatar, background_img, _account , _phoneNumber, _userId , _userName  From User"
    );
  },
  update: (field: string[], params: string[], id: string) => {
    let sql = `Update user set ${field.join(" = ?, ")} = ? where _userId = ?`;
    return __instance._execute(sql, [...params, id]);
  },
};
export default User;
