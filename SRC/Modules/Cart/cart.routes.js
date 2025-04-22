import { Router } from "express";

import * as controller from "./cart.controller.js";
import { auth, errorHandler } from "../../Middlewares/index.js";

const cartRouter = Router();

cartRouter.post("/add/:productId", auth(), errorHandler(controller.addToCart));

cartRouter.delete(
  "/delete/:productId",
  auth(),
  errorHandler(controller.deletFromCart)
);

export { cartRouter };
