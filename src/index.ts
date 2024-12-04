import express from "express";
import cors from "cors";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { createArticleRoutes } from "./routes/articleRoutes";
import { initializeDatabase } from "./database/dataSource";

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
initializeDatabase()
  .then((dataSource) => {
    // Routes
    app.use("/api/articles", createArticleRoutes(dataSource));

    // Error handling
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
