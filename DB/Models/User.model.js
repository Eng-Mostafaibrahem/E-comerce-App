import mongoose from "mongoose";
import { systemRole}  from "../../SRC/Utils/system.role.utils.js";
const {model,Schema} = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(systemRole),
        default: systemRole.CUSTOMER
    },
    profileImage: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
})


export const User =
  mongoose.models.USER || model("USER", userSchema);
