import { FeedFetcher } from "./services/FeedFetcher";
import { TopicExtractor } from "./services/TopicExtractor";
import { config } from "./config";
import { initializeDatabase } from "./database/dataSource";
import { Article } from "./models/Article";

async function main() {
  const dataSource = await initializeDatabase();
  const articleRepository = dataSource.getRepository(Article);
  const feedFetcher = new FeedFetcher();
  const topicExtractor = new TopicExtractor();

  async function updateArticles() {
    const articles = await feedFetcher.fetchFeeds(config.feedUrls);

    for (const article of articles) {
      try {
        const exists = await articleRepository.findOneBy({
          sourceUrl: article.sourceUrl,
        });
        if (exists) continue;

        if (article.content) {
          article.topics = await topicExtractor.extractTopics(article.content);
          console.log(article.topics);
        }

        await articleRepository.save(article);
      } catch (error) {
        console.error("Error processing article:", error);
      }
    }
  }

  await updateArticles();
  console.log("Completed Article Update");

  // Schedule periodic updates
  setInterval(updateArticles, config.updateInterval * 60 * 1000);
}

main().catch(console.error);
