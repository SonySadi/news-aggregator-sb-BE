import dotenv from "dotenv";
dotenv.config();

export interface Config {
  feedUrls: string[];
  updateInterval: number; // in minutes
  database: {
    path: string;
  };
  openai: {
    apiKey: string;
  };
  PORT: string;
}

export const config: Config = {
  feedUrls: process.env.RSS_FEEDS?.split(",") || [
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
  ],
  updateInterval: parseInt(process.env.UPDATE_INTERVAL || "30"),
  database: {
    path: process.env.SQLITE_PATH || "news.db",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
  },
  PORT: process.env.PORT || "3000",
};
