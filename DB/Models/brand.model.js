import mongoose from "mongoose";
import { type } from "os";

const { Schema, model } = mongoose;

const brandSchema = new Schema(
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
    Logo: {
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
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
  },
  { timestamps: true }
);

// brandSchema.virtual('product', {
//   ref: 'product', //model to use
//   localField: '_id', //filed in base model
//   foreignField: 'productId',// field related in another model
// });

// brandSchema.set("toJSON",{virtuals: true});
// brandSchema.set("toObject",{virtuals: true});



export const Brands = mongoose.models.Brands || model("Brands", brandSchema);
