import { ErrorHandleClass } from "../Utils/error-Class.utils.js";

export const getModelByName = (Model) => {
  return async (req, res, next) => {
    const { name } = req.body;

    const document = await Model.findOne({ name });
    if (document) {
      next(
        new ErrorHandleClass(
          `this name is already exists`,
          400,
          `this name is already exists`
        )
      );
    }
    next();
  };
};
