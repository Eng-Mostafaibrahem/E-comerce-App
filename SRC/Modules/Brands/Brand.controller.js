import { nanoid } from "nanoid";
import slugify from "slugify";

// import { Brands } from "../../../DB/Models/brand.model.js";
// import { ErrorHandleClass } from "../../Utils/error-Class.utils.js";
// import { cloudinaryConfig, uploadFile } from "../../Utils/cloudinary.utils.js";
// import { subCategory } from "../../../DB/Models/subCategory.model.js";
import * as Utils from "../../Utils/index.js"
import * as DB from "../../../DB/Models/index.js";

/**
 * Api {POST} brand/add   add subcategory
 */

export const createBrand = async (req, res, next) => {
  //get data from user
  const { category, subCategoryId } = req.query;
  const { name } = req.body;

  const issubcategory = await DB.subCategory
    .findById({
      _id: subCategoryId,
      categoryId: category,
    })
    .populate("categoryId");

  if (!issubcategory)
    next(new Utils.ErrorHandleClass("category not found", 404, "category not found"));

  //generate slug
  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });

  // generate customId
  const customId = nanoid(4);
  //upload image
  if (!req.file) {
    next(
      new Utils.ErrorHandleClass("please upload image", 400, "please upload image")
    );
  }

  const { secure_url, public_id } = await Utils.uploadFile({
    file: req.file.path,
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${issubcategory.categoryId.customId}/SubCategories/${issubcategory.customId}/Brands/${customId}`,
  });

  const document = new DB.Brands({
    name,
    slug,
    categoryId: issubcategory.categoryId,
    subCategoryId,
    Logo: {
      secure_url,
      public_id,
    },
    customId,
  });

  const newBrand = await DB.Brands.create(document);

  res.status(200).json({
    message: "sub category created successfully",
    newBrand,
  });
};

/**
 * Api {GET} brand/filter  get specific brands
 */
export const Brandfilter = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const filterQuery = {};
  if (id) filterQuery._id = id;
  if (name) filterQuery.name = name;
  if (slug) filterQuery.slug = slug;

  const brand = await DB.Brands.findOne(filterQuery)
    .populate("categoryId")
    .populate("subCategoryId");

  if (!brand) {
    return next(new Utils.ErrorHandleClass("No categories found", 404, "Not found"));
  }
  res.status(200).json({ messages: "categories is...", brand });
};

/**
 * Api {GET} /brand/list get all brands with pagination
 *
 */

export const getAllBrand = async (req, res, next) => {
  const { page, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const brands = await DB.Brands.find()
    .populate("subCategoryId")
    .limit(limit)
    .skip(skip);

  res.status(200).json({ message: "Brands", data: brands });
};

/**
 * Api {Put} /brand/update/_id upate data and image on host
 */
export const updateBrand = async (req, res, next) => {
  const { name, categoryId, subCategoryId } = req.body;
  const { _id } = req.params;

  //find brand in db
  const brand = await DB.Brands.findById(_id);

  // check if category in db or not
  if (!brand)
    return next(
      new Utils.ErrorHandleClass("brand not found", 404, "brand not found")
    );

  //update name and slug
  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    brand.name = name;
    brand.slug = slug;
  }

  //update category id
  if (categoryId) {
    brand.categoryId = categoryId;
  }

  if (subCategoryId) {
    brand.subCategoryId = subCategoryId;
  }

  //update image
  if (req.file) {
    const splitedPublicId = brand.Logo.public_id.split(`${brand.customId}/`)[1];
    const { secure_url } = await Utils.uploadFile({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${customId}`,
      publicId: splitedPublicId,
    });

    brand.Logo.secure_url = secure_url;
  }

  await brand.save();
  res.status(200).json({
    message: "brand updated successfully",
    data: brand,
  });
};



/**
 * Api {DELETE} DELETE  subcategory
 */

export const deleteBrand = async (req, res, next) => {
  const { _id } = req.params;
  const brand = await DB.Brands.findByIdAndDelete(_id);
  if (!brand) return next(new Utils.ErrorHandleClass("not found", 404, "not found"));
  //delet image from host
  const brandPath = `${process.env.UPLOADS_FOLDER}
  /Categories
  /${brand.categoryId.customId}
  /SubCategories
  /${brand.subCategoryId.customId}
  /Brands
  /${customId}`;

  await Utils.cloudinaryConfig().api.delete_resources_by_prefix(brandPath);
  await Utils.cloudinaryConfig().api.delete_folder(brandPath);
  res.status(200).json({ message: "brand deleted successfully" });
};
