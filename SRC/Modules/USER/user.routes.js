import { Router } from "express";
const userRouter= Router()
import * as controller from "./user.controller.js";
import {errorHandler,}  from "../../Middlewares/index.js"
import * as Utils from "../../Utils/index.js";
import * as DB from "../../../DB/Models/index.js";


userRouter.post('/register',errorHandler(controller.Register))
userRouter.post('/login',errorHandler(controller.login))





export {userRouter}