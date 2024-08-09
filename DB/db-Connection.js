import mongoose from "mongoose";

export const db_connection =async()=>{
    try {
        await mongoose.connect(process.env.CONNECCTION_DB_URI)
        console.log("database connected successfully");
    } catch (error) {
        console.log("database connection failed",error);
    }
}