import mongoose from "mongoose";
import slugify from "slugify";
import { Badges, discountType } from "../../SRC/Utils/index.js";
import { calcProductPrice } from "../../SRC/Utils/calc-productPrice.utils.js";
import mongoosePaginate from "mongoose-paginate-v2"

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
      default: function () {
        return slugify(this.title, { lower: true, replacment: "_" });
      },
    },

    overview: String,
    // specs: object, // can be Map of key/value pairs but is dificult in validate with third party modules
    badges: {
      type: String,
      enum: Object.values(Badges),
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
        enum: Object.values(discountType),
        default: discountType.PERCENTAGE,
      },
    },
    appliedPrice: {
      type: Number, //price - appliedDiscount
      required: true,
      default: function () {
        return calcProductPrice(this.price, this.appliedDiscount);
      },
    },

    stock: {
      type: Number,
      required: true,
      min: 3,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    //   /Images
    images: [
      {
        URLs: {},
        customId: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ],

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

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
  },

  { timestamps: true }
);

productSchema.plugin(mongoosePaginate)
export const Product =
  mongoose.models.Product || model("Product", productSchema);
