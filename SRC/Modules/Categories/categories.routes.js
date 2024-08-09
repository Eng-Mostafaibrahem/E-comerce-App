import { Router } from "express";

import { multerCloudinary } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/file-extinsion.js";
import { errorHandler } from "./../../Middlewares/error-handl.middleware.js";
import * as controller from "./categories.controller.js";
import { getModelByName } from "../../Middlewares/finders.middleware.js";
import { Category } from "../../../DB/Models/Category.model.js";
const categoryRouter = Router();

categoryRouter.post(
  "/create",
  multerCloudinary({ allowedExtensions: extensions.Images }).single("image"),
  getModelByName(Category),
  errorHandler(controller.createCategory)
);

categoryRouter.get("/specificcategory",errorHandler(controller.getSpecificCategory))

categoryRouter.get("/allcategory",errorHandler(controller.getAllCategories))


categoryRouter.put("/update/:_id",
  
  multerCloudinary({allowedExtensions:extensions.Images}).single("image"),
  getModelByName(Category),
  errorHandler(controller.updateCategory)
);

categoryRouter.delete("/delete/:_id",controller.deleteCategory)

  export { categoryRouter };
