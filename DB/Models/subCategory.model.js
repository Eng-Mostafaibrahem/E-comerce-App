import mongoose from "mongoose";
import { type } from "os";

const { Schema, model } = mongoose;

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //to do (in progress)
      required: false, //until create user model
    },
    Images: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
        unique: true,
      },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },

  { timestamps: true }
);


subCategorySchema.virtual('Brand', {
  ref: 'Brands', //model to use
  localField: '_id', //filed in base model
  foreignField: 'subCategoryId',// field related in another model
  
 
});

subCategorySchema.set("toJSON",{virtuals: true});
subCategorySchema.set("toObject",{virtuals: true});



export const subCategory =
  mongoose.models.subCategory || model("subCategory", subCategorySchema);
