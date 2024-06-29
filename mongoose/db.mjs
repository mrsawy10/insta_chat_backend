import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_DATABASE_URL);
      console.log("MongoDB connected successfully".bgGreen.black);
    } catch (error) {
      console.error("MongoDB connection failed:".bgRed.black, error.message);
      console.log("Retrying connection in 5 seconds...".yellow);
      setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
    }
  };

  connectWithRetry();
};

connectDB();
export default connectDB;
