import { Configuration, OpenAIApi } from "openai";
import { config } from "../config";

export class TopicExtractor {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: config.openai.apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  private chunkText(text: string, maxLength = 1000): string[] {
    const sentences = text.split(/[.!?]+/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence + ".";
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence + ".";
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  }

  private async getEmbeddings(text: string): Promise<number[]> {
    const response = await this.openai.createEmbedding({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data.data[0].embedding;
  }

  private findMainTopics(chunks: string[], embeddings: number[][]): string[] {
    // Simple clustering: Find the most distinct chunks based on embedding distances
    const topics = new Set<string>();
    const usedChunks = new Set<number>();

    for (let i = 0; i < embeddings.length; i++) {
      if (usedChunks.has(i)) continue;

      // Extract key phrases from the chunk as a topic
      const keywords = chunks[i]
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .slice(0, 3)
        .join(" ");

      topics.add(keywords);
      usedChunks.add(i);

      if (topics.size >= 5) break; // Limit to 5 main topics
    }

    return Array.from(topics);
  }

  async extractTopics(content: string): Promise<string[]> {
    try {
      const chunks = this.chunkText(content);
      const embeddings = await Promise.all(
        chunks.map((chunk) => this.getEmbeddings(chunk))
      );

      return this.findMainTopics(chunks, embeddings);
    } catch (error) {
      console.error("Error extracting topics:", error);
      return [];
    }
  }
}
