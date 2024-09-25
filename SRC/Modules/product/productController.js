import slugify from "slugify";
import { Product, Brands } from "../../../DB/Models/index.js";
import { ErrorHandleClass, uploadFile } from "../../Utils/index.js";
import { nanoid } from "nanoid";
import { calcProductPrice } from "../../Utils/calc-productPrice.utils.js";
/**
 * Api {post} brand/create  create brand
 */

export const createProduct = async (req, res, next) => {
  const {
    title,
    price,
    stock,
    discountAmount,
    discountType,
    padges,
    specs,
    overview,
  } = req.body;

  if (!req.files.length)
    return next(
      new ErrorHandleClass("please upload image", 404, "please upload image")
    );

  const brand = req.product;

  //   Image section
  const brandCustomId = brand.customId;
  const categoryCustomId = brand.categoryId.customId;
  const subCategoryCustomId = brand.subCategoryId.customId;
  const customId = nanoid(4);
  const folder = `${process.env.UPLOADS_FOLDER}/Categories/${categoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Product/${customId}}`;
  const URLs = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadFile({
      file: file.path,
      folder,
    });
    URLs.push({ secure_url, public_id });
  }

  const product = {
    title,
    price,
    appliedDiscount: {
      amount: discountAmount,
      type: discountType,
    },
    stock,
    images: {
      URLs,
      customId,
    },
    //single source of truth
    subCategoryId: brand.subCategoryId,
    categoryId: brand.categoryId,
    brandId: brand._id,
    specs: JSON.parse(specs),
    padges,
    overview,
  };

  // create in db
  const newProduct = await Product.create(product);
  //response
  res
    .status(200)
    .json({ message: "Product Created Successfully", data: newProduct });
};

//Api {Put} /product/update
export const updateProduct = async (req, res, next) => {
  //get product id from params
  const { productId } = req.params;

  //destruct datad from user
  const {
    title,
    price,
    stock,
    discountAmount,
    discountType,
    padges,
    specs,
    overview,
  } = req.body;

  //check if product in db or not

  const product = await Product.findById(productId);
  if (!product) {
    return next(
      new ErrorHandleClass("product not found", 404, "product not found")
    );
  }

  if (title) {
    product.title = title;
    product.slug = slugify(title, { lower: true, replacement: "_" });
  }

  if (stock) product.stock = stock;
  if (padges) product.padges = padges;
  if (specs) product.specs = specs;
  if (overview) product.overview = overview;

  if (price || discountType || discountAmount) {
    const newprice = price || product.price;
    const discount = {};
    discount.type = discountType || product.discountType;
    discount.amount = discountAmount || product.discountAmount;
    product.appliedPrice = calcProductPrice(newprice, discount);
    product.appliedDiscount = discount;
    product.price = newprice;
  }

  await Product.save(product)
  res.status(200).json({ message: "product is ...", data: product });
};

//API {GET} /product/list  get all product

export const getAllProduct = async (req, res) => {
  const { page = 1, limit = 2 } = req.query;
  const skip = (page - 1) * limit;

  const products = await Product.paginate(
    {},
    {
      page,
      limit,
      skip,
      select: "-subCategoryId -categoryId -brandId",
    }
  );
 
  res
    .status(200)
    .json({ status: "success", message: "products", data: products });
};
