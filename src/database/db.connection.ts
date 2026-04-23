import mongoose from "mongoose";
import { env } from "@services";

export const connectDB = async () =>
  await mongoose
    .connect(env.mongoUri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      process.exit(1);
    });
