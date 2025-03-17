import mongoose from "mongoose";

 export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sandu:222@cluster0.amfzn.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}