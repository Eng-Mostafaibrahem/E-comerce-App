import slugify from "slugify";
import { nanoid } from "nanoid";

import { Category } from "../../../DB/Models/Category.model.js";
import { ErrorHandleClass } from "../../Utils/error-Class.utils.js";
import { cloudinaryConfig, uploadFile } from "../../Utils/cloudinary.utils.js";
import { subCategory } from "../../../DB/Models/subCategory.model.js";
// import { subCategory } from './../../../DB/Models/subCategory.model';

/**
 * @api {POST}/category/create /add category
 */

export const createCategory = async (req, res, next) => {
  //get data from user
  const { name } = req.body;

  //generate slug
  const slug = slugify(name, {
    replacement: "_",
    lower: true,
    trim: true,
  });

  // image

  if (!req.file) {
    return next(
      new ErrorHandleClass("please upload image", 400, "please upload image")
    );
  }

  //upload image

  // to create specific folder on host in folder category to structure specific herarcy
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,

    {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`,
    }
  );

  //create a new category
  const category = new Category({
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
  });
  const newCategory = await Category.create(category);
  res.status(201).json({
    message: "category created successfully",
    category: newCategory,
  });
};

/**
 * @api {GetCategory}  get all categories
 * get category by name or id or slug
 */

export const getSpecificCategory = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const filterQuery = {};
  if (id) filterQuery._id = id;
  if (name) filterQuery.name = name;
  if (slug) filterQuery.slug = slug;

  const categories = await Category.findOne(filterQuery);

  if (!categories) {
    return next(new ErrorHandleClass("No categories found", 404, "Not found"));
  }
  res.status(200).json({ messages: "categories is...", categories });
};



/**
 * Api {put}  /categories/update/: update category
 */

export const updateCategory = async (req, res, next) => {
  // get the category id
  const { _id } = req.params;
  // find the category by id
  const category = await Category.findById(_id);
  if (!category) {
    return next(
      new ErrorHandleClass("Category not found", 404, "Category not found")
    );
  }
  // name of the category
  const { name } = req.body;

  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    category.name = name;
    category.slug = slug;
  }

  //Image
  if (req.file) {
    const splitedPublicId = category.Images.public_id.split(
      `${category.customId}/`
    )[1];

    const { secure_url } = await uploadFile({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`,
      publicId: splitedPublicId,
    });
    category.Images.secure_url = secure_url;
  }

  // save the category with the new changes
  await category.save();

  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
};

/**
 * @API {Delete} /categories/delete/:_id  delete category
 */
export const deleteCategory = async (req, res, next) => {
  // get the category id
  const { _id } = req.params;
  // find the category by id
  const category = await Category.findByIdAndDelete(_id);
  if (!category) {
    return next(
      new ErrorHandleClass("Category not found", 404, "Category not found")
    );
  }

  //delete image from host
  const categoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath);
  await cloudinaryConfig().api.delete_folder(categoryPath);

  res.status(200).json({ message: "Category deleted successfully" });
};
