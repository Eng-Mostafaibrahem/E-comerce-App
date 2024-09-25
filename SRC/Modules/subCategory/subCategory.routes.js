import { Router } from "express";

import * as controller from "./subCategory.controller.js";
import { errorHandler } from "./../../Middlewares/error-handl.middleware.js";
import { getModelByName } from "../../Middlewares/finders.middleware.js";
import { subCategory } from "../../../DB/Models/subCategory.model.js";
import { multerCloudinary } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/file-extinsion.js";

const subCategoryRouter = Router({ mergeParams: true });
subCategoryRouter.post(
  "/add",
  multerCloudinary({ allowedExtensions: extensions.Images }).single("image"),
  getModelByName(subCategory),
  errorHandler(controller.createSubCategory)
);

subCategoryRouter.get(
  "/specific",
  errorHandler(controller.getSpecificSubCategories)
);

subCategoryRouter.get(
  "/all",
  errorHandler(controller.getAllSubCategories)
);

subCategoryRouter.put(
  "/update/:_id",
  multerCloudinary({ allowedExtensions: extensions.Images }).single("image"),
  getModelByName(subCategory),
  errorHandler(controller.updateSubCategory)
);

subCategoryRouter.delete("/delete/:_id",errorHandler(controller.deleteSubCategory))
export { subCategoryRouter };
