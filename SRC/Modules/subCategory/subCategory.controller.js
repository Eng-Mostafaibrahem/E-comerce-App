import { nanoid } from "nanoid";
import slugify from "slugify";

// import { subCategory } from "../../../DB/Models/subCategory.model.js";
// import { ErrorHandleClass } from "../../Utils/error-Class.utils.js";
// import { cloudinaryConfig, uploadFile } from "../../Utils/cloudinary.utils.js";
// import { errorHandler } from "../../Middlewares/error-handl.middleware.js";
// import { Category } from "../../../DB/Models/Category.model.js";

import * as Utils from "../../Utils/index.js"
import * as DB from "../../../DB/Models/index.js";


/**
 * Api {POST} subcategories/add   add subcategory
 */

export const createSubCategory = async (req, res, next) => {
  //get data from user
  const { name, categoryId } = req.body;
  const category = await DB.Category.findById(categoryId);
  if(!category) next(new Utils.ErrorHandleClass("category not found",404,"category not found"))

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
  const { secure_url, public_id } = await uploadFile({
    file: req.file.path,
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`

  });

  const document = new DB.subCategory({
    name,
    slug,
    categoryId,
    Images: {
      secure_url,
      public_id,
    },
    customId,
  });

  const newSubCategory = await DB.subCategory.create(document);

  res.status(200).json({
    message: "sub category created successfully",
    newSubCategory,
  });
};

/**
 * API {Get} /subcategory/specific  Get specific sub categories
 */

export const getSpecificSubCategories = async (req, res, next) => {
  const { name, _id, slug } = req.params;

  const filterQuery = {};

  if (_id) filterQuery.id = _id;
  if (name) filterQuery.name = name;
  if (slug) filterQuery.slug = slug;

  const subcategories = await DB.subCategory.findOne(filterQuery);
  if (!subcategories)
    return next(
      new Utils.ErrorHandleClass(
        "subCategory not found",
        404,
        "subCategory not found"
      )
    );

  res.status(200).json({
    message: "subcategory",
    subcategories,
  });
};


/**
 * Api {GET} ALL subcategories with paginated and brands
 */

export const getAllSubCategories = async (req, res, next) => {
  const { page , limit =5 } = req.query;
  const skip = (page - 1) * limit
  const subcategories = await DB.subCategory.find()
   .populate("Brand")
   .limit(limit)
   .skip(skip);
   if(subcategories.length===0){
    return next(new Utils.ErrorHandleClass("don't have data any more",400,"don't have data any more"))
   }

   res.status(200).json({message:"subcategories", data:subcategories})
}

/**
 * Api {Put} /subCategory/update/_id upate data and image on host
 */
export const updateSubCategory = async (req, res, next) => {
  const { name, categoryId } = req.body;
  const { _id } = req.params;

  //find subcategory in db
  const subcategory = await DB.subCategory.findById(_id);

  // check if category in db or not
  if (!subcategory)
    return next(
      new Utils.ErrorHandleClass(
        "subcategory not found",
        404,
        "subcategory not found"
      )
    );

  //update name and slug
  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    subcategory.name = name;
    subcategory.slug = slug;
  }

  //update category id
  if (categoryId) {
    subcategory.categoryId = categoryId;
  }

  //update image
  if (req.file) {
    const splitedPublicId = subcategory.Images.public_id.split(
      `${subcategory.customId}/`
    )[1];
    const { secure_url } = await Utils.uploadFile({
      file: req.file.path,
      //SINGLE OF TRUTHE
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${subcategory.categoryId.customId}/SubCategories/${customId}`,
      
      publicId: splitedPublicId,
    });

    subcategory.Images.secure_url = secure_url;
  }

  await subcategory.save();
  res.status(200).json({
    message: "subcategory updated successfully",
    data: subcategory,
  });
};

/**
 * Api {DELETE} DELETE  subcategory
 */

export const deleteSubCategory = async (req, res, next) => {
  const { _id } = req.params;
  const subcategory = await DB.subCategory.findByIdAndDelete(_id);
  if (!subcategory)
    return next(new Utils.ErrorHandleClass("not found", 404, "not found"));
  //delet image from host
  const subcategoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${subcategory.categoryId.customId}/SubCategories/${customId}`;
  await Utils.cloudinaryConfig().api.delete_resources_by_prefix(subcategoryPath);
  await Utils.cloudinaryConfig().api.delete_folder(subcategoryPath);
  res.status(200).json({ message: "subcategory deleted successfully" });
};
