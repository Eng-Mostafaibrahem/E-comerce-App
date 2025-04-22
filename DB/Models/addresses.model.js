import mongoose from "mongoose";
const { Schema, model } = mongoose;

const addressSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    buildingNumber: {
      type: Number,
      required: true,
    },
    floorNumber: {
      type: Number,
      required: true,
    },
    addressLabel: String,
    isDefault: {
      type: Boolean,
      default: true,
    },
    isMarkedAsDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Adresses = mongoose.models.Adresses || model("Adresses", addressSchema);
