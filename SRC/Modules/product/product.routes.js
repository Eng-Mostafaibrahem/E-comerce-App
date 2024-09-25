import { Router } from "express";

//comntroller
import * as controller from "./productController.js";

//middleware
import * as middleware from "../../Middlewares/index.js";
//utils
import * as Utils from "../../Utils/index.js";
//DB
import { Brands } from "../../../DB/Models/index.js";


const productRouter = Router();
const { multerCloudinary, getModelByName, errorHandler, checkIdsFound } =
  middleware;

productRouter.post(
  "/create",
  multerCloudinary({ allowedExtensions: Utils.extensions.Images }).array(
    "image",
    5
  ),
  checkIdsFound(Brands),
  errorHandler(controller.createProduct)
);

productRouter.put("/update/:productId",controller.updateProduct)

productRouter.get("/list",controller.getAllProduct)

export { productRouter };
