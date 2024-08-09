import { nanoid } from "nanoid";
import slugify from "slugify";

import { Brands } from "../../../DB/Models/brand.model.js";
import { ErrorHandleClass } from "../../Utils/error-Class.utils.js";
import { cloudinaryConfig, uploadFile } from "../../Utils/cloudinary.utils.js";

/**
 * Api {POST} brand/add   add subcategory
 */

export const createBrand = async (req, res, next) => {
  //get data from user
  const { name, categoryId, subCategoryId } = req.body;

  const brand = await Brands.findById(categoryId)
    .populate("categoryId")
    .populate("subCategoryId");

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
      new ErrorHandleClass("please upload image", 400, "please upload image")
    );
  }
  const { secure_url, public_id } = await uploadFile({
    file: req.file.path,
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${customId}`,
  });

  const document = new Brands({
    name,
    slug,
    categoryId,
    subCategoryId,
    Logo: {
      secure_url,
      public_id,
    },
    customId,
  });

  const newBrand = await Brands.create(document);

  res.status(200).json({
    message: "sub category created successfully",
    newBrand,
  });
};

/**
 * API {Get} /brand/specific  Get Specific brand
 */

export const getSpecificBrand = async (req, res, next) => {
  const { name, _id, slug } = req.params;

  const filterQuery = {};

  if (_id) filterQuery.id = _id;
  if (name) filterQuery.name = name;
  if (slug) filterQuery.slug = slug;

  const brand = await Brands.findOne(filterQuery);
  if (!brand)
    return next(
      new ErrorHandleClass("brand not found", 404, "brand not found")
    );

  res.status(200).json({
    message: "brand",
    subcategories,
  });
};

/**
 * Api {GET} brand/all  get all brands
 */
export const getAllBrand = async (req, res, next) => {
  const brands = await Brands.find({});
  res.status(200).json({ messages: "brands are...", brands });
};

/**
 * Api {Put} /brand/update/_id upate data and image on host
 */
export const updateBrand = async (req, res, next) => {
  const { name, categoryId, subCategoryId } = req.body;
  const { _id } = req.params;

  //find brand in db
  const brand = await Brands.findById(_id);

  // check if category in db or not
  if (!brand)
    return next(
      new ErrorHandleClass("brand not found", 404, "brand not found")
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
    const { secure_url } = await uploadFile({
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
  const brand = await Brands.findByIdAndDelete(_id);
  if (!brand) return next(new ErrorHandleClass("not found", 404, "not found"));
  //delet image from host
  const brandPath = `${process.env.UPLOADS_FOLDER}
  /Categories
  /${brand.categoryId.customId}
  /SubCategories
  /${brand.subCategoryId.customId}
  /Brands
  /${customId}`;
  
  await cloudinaryConfig().api.delete_resources_by_prefix(brandPath);
  await cloudinaryConfig().api.delete_folder(brandPath);
  res.status(200).json({ message: "brand deleted successfully" });
};
