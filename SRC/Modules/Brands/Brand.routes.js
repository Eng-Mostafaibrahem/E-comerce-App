import { Router } from "express";

// import { Brands } from "../../../DB/Models/brand.model.js";

import * as middleware from "../../Middlewares/index.js"
import * as controller from "./Brand.controller.js";
import * as Utils from "../../Utils/index.js";
import * as DB from "../../../DB/Models/index.js";


// import { errorHandler } from "../../Middlewares/error-handl.middleware.js";
// import { getModelByName } from "../../Middlewares/finders.middleware.js";
// import { multerCloudinary } from "../../Middlewares/multer.middleware.js";
// import { extensions } from "../../Utils/file-extinsion.js";

const brandRouter = Router();

brandRouter.post(
  "/add",
 middleware.multerCloudinary({ allowedExtensions: Utils.extensions.Images }).single("image"),
  middleware.getModelByName(DB.Brands),
  middleware.errorHandler(controller.createBrand)
);

brandRouter.get("/all",middleware.errorHandler(controller.getAllBrand));
brandRouter.get("/filter", middleware.errorHandler(controller.Brandfilter));
brandRouter.put(
  "/update/:_id",
  middleware.multerCloudinary({ allowedExtensions: Utils.extensions.Images }).single("image"),
  middleware.getModelByName(DB.Brands),
  middleware.errorHandler(controller.updateBrand)
);

brandRouter.delete("/delete/:_id", middleware.errorHandler(controller.deleteBrand));

export { brandRouter };
