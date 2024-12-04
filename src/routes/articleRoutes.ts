import { Router } from "express";
import { ArticlesController } from "../controllers/ArticlesController";
import { DataSource } from "typeorm";

export const createArticleRoutes = (dataSource: DataSource) => {
  const router = Router();
  const articlesController = new ArticlesController(dataSource);

  router.get("/", articlesController.getAll);

  return router;
};
