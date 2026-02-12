import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
    
  } catch (e) {
    console.log("error in connect in database", e.message);
    process.exit(1);
  }
};
export default connectDB;
