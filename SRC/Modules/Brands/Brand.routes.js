import { Router } from "express";

import { Brands } from "../../../DB/Models/brand.model.js";

import * as controller from "./Brand.controller.js";

import { errorHandler } from "../../Middlewares/error-handl.middleware.js";
import { getModelByName } from "../../Middlewares/finders.middleware.js";
import { multerCloudinary } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/file-extinsion.js";

const brandRouter = Router();

brandRouter.post(
  "/add",
  multerCloudinary({ allowedExtensions: extensions.Images }).single("image"),
  getModelByName(Brands),
  errorHandler(controller.createBrand)
);

brandRouter.get("/all", errorHandler(controller.getAllBrand));
brandRouter.get("/specific", errorHandler(controller.getAllBrand));


brandRouter.put(
  "/update/:_id",

  multerCloudinary({ allowedExtensions: extensions.Images }).single("image"),
  getModelByName(Brands),
  errorHandler(controller.updateBrand)
);

brandRouter.delete("/delete/:_id", errorHandler(controller.deleteBrand));

export { brandRouter };
