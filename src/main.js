/**
 * main.js
 * Entry point for the news automation system.
 *
 * Pipeline:
 *   1. Load environment variables from .env
 *   2. Fetch latest India current-affairs news (News API)
 *   3. Save raw news articles to data/news.json
 *   4. Generate Hinglish social media posts (OpenAI)
 *   5. Save generated posts to output/posts.txt
 */

require("dotenv").config();

const { fetchNews, saveNews } = require("./newsService");
const { generatePosts, savePosts } = require("./postGenerator");

async function main() {
  console.log("🚀 Starting News Automation System...");
  console.log("=".repeat(50));

  // Step 1: Fetch latest news from News API
  const articles = await fetchNews();

  if (articles.length === 0) {
    console.warn("⚠️  No articles to process. Exiting.");
    process.exit(0);
  }

  // Step 2: Save raw news to data/news.json
  saveNews(articles);

  console.log("-".repeat(50));

  // Step 3: Generate Hinglish posts using OpenAI
  const posts = await generatePosts(articles);

  if (posts.length === 0) {
    console.warn("⚠️  No posts were generated. Exiting.");
    process.exit(1);
  }

  // Step 4: Save posts to output/posts.txt
  savePosts(posts);

  console.log("=".repeat(50));
  console.log("🎉 Done! All posts have been generated and saved.");
}

main().catch((error) => {
  console.error("❌ Fatal error:", error.message);
  process.exit(1);
});
