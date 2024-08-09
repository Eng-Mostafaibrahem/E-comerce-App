import { ErrorHandleClass } from "../Utils/error-Class.utils.js";

export const errorHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      console.error(err);
      console.log("error in error handle", err.message);
      next(new ErrorHandleClass());
    });
  };
};

export const globalResponse = (err, req, res, next) => {
  res.status(err["statusCode"] || 500).json({
    message: err.message || "Something went wrong",
    error: req.app.get("env") === "development" ? err : {},
  });
};
