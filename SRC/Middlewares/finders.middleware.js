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

export const checkIdsFound = (model) => {
  return async (req, res, next) => {
    const { categoryId, subCategoryId, _id } = req.query;
    const finders = {};
    if (categoryId) finders.categoryId = categoryId;
    if (subCategoryId) finders.subCategoryId = subCategoryId;
    if (_id) finders._id = _id;
    if (finders.length == 0) {
      return next(new ErrorHandleClass(`ids not send`, 400`ids not send`));
    }
    const document = await model.findOne(finders).populate([
      { path: "categoryId", select: "customId" },
      { path: "subCategoryId", select: "customId" },
    ]);
    if (!document)
      return next(
        new ErrorHandleClass(
          `${model.modelName} is not found`,
          404,
          `${model.modelName} is not found`
        )
      );
    req.document = document;
    next();
  };
};
