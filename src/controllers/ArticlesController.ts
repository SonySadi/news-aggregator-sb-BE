import { Request, Response, NextFunction } from "express";
import { DataSource, Between } from "typeorm";
import { Article } from "../models/Article";

interface ArticleQueryParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class ArticlesController {
  constructor(private dataSource: DataSource) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        search,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query as ArticleQueryParams;

      const queryBuilder = this.dataSource
        .getRepository(Article)
        .createQueryBuilder("article");

      if (search) {
        queryBuilder.where(
          "(article.title LIKE :search OR article.description LIKE :search OR article.content LIKE :search)",
          { search: `%${search}%` }
        );
      }

      if (startDate || endDate) {
        queryBuilder.andWhere({
          publishDate: Between(
            startDate ? new Date(startDate) : new Date("1970-01-01"),
            endDate ? new Date(endDate) : new Date()
          ),
        });
      }

      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);
      queryBuilder.orderBy("article.publishDate", "DESC");

      const [articles, total] = await queryBuilder.getManyAndCount();

      res.json({
        data: articles,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          last_page: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
