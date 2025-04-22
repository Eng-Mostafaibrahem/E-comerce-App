import { Router } from "express";
import { errorHandler, auth } from "../../Middlewares/index.js";
import * as controller from "./addresses.controller.js";
const addressRouter = Router();

addressRouter.post("/add", auth(), errorHandler(controller.addAddress));
addressRouter.put("/edit/:addressId", auth(), errorHandler(controller.updateAddress));
addressRouter.put("/softdelete/:addressId", auth(), errorHandler(controller.deleteAddress));
addressRouter.get("/list", auth(), errorHandler(controller.allAddress));


export { addressRouter };
