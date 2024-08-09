import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    //strings section
    title: {
      type: String,
      required: true,
      trime: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    overview: String,
    specs: object, // can be Map of key/value pairs but is dificult in validate with third party modules
    badges: {
      type: String,
      enum: ["New", "Sale", "Best Seller"],
    },

    //number section

    price: {
      type: Number,
      required: true,
      min: 50,
    },

    discount: {
      type: Number,
      min: 0,
      default: 0,
    },

    appliedDiscount: {
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
      type: {
        type: String,
        enum: ["Percentage", "Fixed"],
        default: "Percentage",
      },
    },
    appliedPrice: {
      type: Number, //price - appliedDiscount
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 3,
    },
    ratring: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    //   /Images
    images: [{
      URLs: {},
      customId: {
        type: String,
        required: true,
        unique: true,
      },
    }],

    //  id sections
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

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
  },

  { timestamps: true }
);

export const Product =
  mongoose.models.Product || model("Product", productSchema);
