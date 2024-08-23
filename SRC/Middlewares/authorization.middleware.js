import { ErrorHandleClass } from "../Utils/error-Class.utils.js"
export const authorization = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.authuser;
    if (!allowedRoles.includes(user.role)) {
      return next(new ErrorHandleClass("not authontcated", 401, "authoriztion"));
    }
    next();
  };
};
