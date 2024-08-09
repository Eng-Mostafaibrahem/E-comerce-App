import mongoose from "mongoose";
import { type } from "os";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
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
    Images: 
      {
        secure_url: {
          type: String,
          required: true,
        },
        public_id:{
            type: String,
            required: true,
            unique: true,
        }
      },
      customId:{
        type:String,
        required:true,
        unique:true
      }
  },

  { timestamps: true }
);

//virtual populat 
//find subcategory where localField(category._id) is equal to foriegnField (categoryId)  

categorySchema.virtual('subcategory', {
  ref: 'subCategory', //model to use
  localField: '_id', //filed in base model
  foreignField: 'categoryId',// field related in another model
  // justOne: true
 
});

categorySchema.set("toJSON",{virtuals: true});
categorySchema.set("toObject",{virtuals: true});


export const Category= mongoose.models.Category|| model("Category",categorySchema);  