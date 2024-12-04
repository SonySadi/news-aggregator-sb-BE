import Parser from "rss-parser";
import { Article } from "../models/Article";

export class FeedFetcher {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async fetchFeeds(urls: string[]): Promise<Partial<Article>[]> {
    const articles: Partial<Article>[] = [];

    for (const url of urls) {
      try {
        const feed = await this.parser.parseURL(url);

        feed.items.forEach((item) => {
          articles.push({
            title: item.title,
            description: item.contentSnippet || "",
            content: item.content || "",
            publishDate: new Date(item.pubDate || ""),
            sourceUrl: item.link || "",
            topics: [],
            entities: {
              people: [],
              locations: [],
              organizations: [],
            },
          });
        });
      } catch (error) {
        console.error(`Error fetching feed from ${url}:`, error);
      }
    }

    return articles;
  }
}
