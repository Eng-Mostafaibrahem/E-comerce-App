import express from "express";

import { db_connection } from "./DB/db-Connection.js";
import { globalResponse } from "./SRC/Middlewares/error-handl.middleware.js";

// routers
// import { categoryRouter } from "./SRC/Modules/Categories/categories.routes.js";
// import { subCategoryRouter } from "./SRC/Modules/subCategory/subCategory.routes.js";
// import { brandRouter } from "./SRC/Modules/Brands/Brand.routes.js";

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
// app.use("/categories", categoryRouter);
app.use("/categories",router.categoryRouter);

// app.use("/subcategory",subCategoryRouter);
app.use("/subcategory",router.subCategoryRouter);

// app.use("/brand",brandRouter);
app.use("/brand",router.brandRouter);



app.use(globalResponse);

db_connection();

app.listen(port, () => console.log("server is running on port " + port));
