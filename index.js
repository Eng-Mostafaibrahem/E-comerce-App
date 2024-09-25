import express from "express";

import { db_connection } from "./DB/db-Connection.js";
import { globalResponse } from "./SRC/Middlewares/error-handl.middleware.js";

import * as router from "./SRC/Modules/index.js";

import { config } from "dotenv";
import path from "path";

if (process.env.NODE_ENV == "dev") {
  config({ path: path.resolve(".dev.env") });
}
if (process.env.NODE_ENV == "prod") {
  config({ path: path.resolve(".prod.env") });
}
config();

const app = express();
let port = process.env.PORT;
app.use(express.json());

app.use("/user", router.userRouter);
app.use("/categories", router.categoryRouter);
app.use("/subcategory", router.subCategoryRouter);
app.use("/brand", router.brandRouter);
app.use("/product", router.productRouter);

app.use(globalResponse);

db_connection();

app.listen(port, () => console.log("server is running on port " + port));
