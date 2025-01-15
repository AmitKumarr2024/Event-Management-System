import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";
import logger from "../utils/logger.js";

const MongoDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("DataBase connected successfully");
  } catch (error) {
    logger.error("Mongodb connection Error:", error);
  }
};


export default MongoDb;
