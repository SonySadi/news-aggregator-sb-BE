import { DataSource } from "typeorm";
import { Article } from "../models/Article";
import { config } from "../config";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: config.database.path,
  entities: [Article],
  synchronize: true,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");
    return AppDataSource;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
