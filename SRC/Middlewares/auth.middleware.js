import jwt from "jsonwebtoken";
import User from "../../DB/Models/User.model.js";
import { ErrorHandleClass } from "../Utils/error-Class.utils.js";

/*destruct token 
 check token found
*/

export const auth = () => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return next(
        new ErrorHandleClass(
          "Please Sign In First ",
          401,
          "authentcation error"
        )
      );
    }

    const decodData = jwt.verify(token, process.env.LOGIN_SECRET);
    if (!decodData?.userId)
      return next(
        new ErrorHandleClass("Invalid Payload", 401, "authentcation error")
      );

    // get user id

    const user = await User.findById(decodData.userId).select("-password");
    if (!user)
      return next(
        new ErrorHandleClass(
          "Invalid Payload",
          401,
          "please signup and try to login again"
        )
      );

    //send data in req to other middleware don't send critical data
    req.authUser = user;
    next();
  };
};
