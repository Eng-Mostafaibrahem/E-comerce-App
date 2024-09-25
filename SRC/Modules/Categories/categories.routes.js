import { Router } from "express";

import * as middleware from "../../Middlewares/index.js"
import * as controller from "./categories.controller.js";
import * as Utils from "../../Utils/index.js";
import * as DB from "../../../DB/Models/index.js";



// import { multerCloudinary } from "../../Middlewares/multer.middleware.js";
// import { extensions } from "../../Utils/file-extinsion.js";
// import { errorHandler } from "./../../Middlewares/error-handl.middleware.js";
// import { getModelByName } from "../../Middlewares/finders.middleware.js";
// import { Category } from "../../../DB/Models/Category.model.js";
const categoryRouter = Router();


categoryRouter.post(
  "/create",
  middleware.multerCloudinary({ allowedExtensions: Utils.extensions.Images }).single("image"),
  middleware.getModelByName(DB.Category),
  middleware.errorHandler(controller.createCategory)
);

categoryRouter.get("/specificcategory",middleware.errorHandler(controller.getSpecificCategory))

categoryRouter.get("/allcategory",middleware.errorHandler(controller.getAllCategories))


categoryRouter.put("/update/:_id",
  
  middleware.multerCloudinary({allowedExtensions:Utils.extensions.Images}).single("image"),
  middleware.getModelByName(DB.Category),
  middleware.errorHandler(controller.updateCategory)
);

categoryRouter.delete("/delete/:_id",middleware.errorHandler(controller.deleteCategory))

  export { categoryRouter };
