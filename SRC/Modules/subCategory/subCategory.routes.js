import { Router } from "express";
const subCategoryRouter =Router()
 
import * as controller from "./subCategory.controller.js";
import * as middleware from "../../Middlewares/index.js"
import * as Utils from "../../Utils/index.js";
import * as DB from "../../../DB/Models/index.js";


// import { errorHandler } from "./../../Middlewares/error-handl.middleware.js";
// import { getModelByName } from "../../Middlewares/finders.middleware.js";
// import { subCategory } from "../../../DB/Models/subCategory.model.js";
// import { multerCloudinary } from "../../Middlewares/multer.middleware.js";
// import { extensions } from "../../Utils/file-extinsion.js";
// import * as Utils from "../../Utils/index.js"
// import * as DB from "../../../DB/Models/index.js";
subCategoryRouter.post(
  "/add",
  middleware.multerCloudinary({ allowedExtensions: Utils.extensions.Images }).single("image"),
  middleware.getModelByName(DB.subCategory),
  middleware.errorHandler(controller.createSubCategory)
);

subCategoryRouter.get(
  "/specific",
  middleware.errorHandler(controller.getSpecificSubCategories)
);

subCategoryRouter.get(
  "/all",
  middleware.errorHandler(controller.getAllSubCategories)
);

subCategoryRouter.put(
  "/update/:_id",
  middleware.multerCloudinary({ allowedExtensions: Utils.extensions.Images }).single("image"),
  middleware.getModelByName(DB.subCategory),
  middleware.errorHandler(controller.updateSubCategory)
);

subCategoryRouter.delete("/delete/:_id",middleware.errorHandler(controller.deleteSubCategory))

export { subCategoryRouter };
