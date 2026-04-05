/**
 * newsService.js
 * Responsible for fetching the latest India current-affairs news
 * from the News API and saving them to data/news.json.
 */

const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// Path where fetched news will be stored
const NEWS_FILE = path.join(__dirname, "../data/news.json");

/**
 * Fetches the latest top headlines about India from News API.
 *
 * @returns {Promise<Array>} Array of news article objects
 */
async function fetchNews() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEWS_API_KEY is not set. Please add it to your .env file."
    );
  }

  const url =
    `https://newsapi.org/v2/top-headlines?` +
    `country=in&language=en&pageSize=10&apiKey=${apiKey}`;

  console.log("📰 Fetching latest India news from News API...");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `News API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error(`News API returned an error: ${data.message}`);
  }

  // Filter out articles without a title or description
  const articles = (data.articles || []).filter(
    (article) => article.title?.trim() && article.description?.trim()
  );

  if (articles.length === 0) {
    console.warn("⚠️  No articles found after filtering. Check API response.");
  } else {
    console.log(`✅ Fetched ${articles.length} articles.`);
  }

  return articles;
}

/**
 * Saves news articles to data/news.json.
 *
 * @param {Array} articles - Array of news article objects
 */
function saveNews(articles) {
  // Make sure the data directory exists
  const dir = path.dirname(NEWS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(NEWS_FILE, JSON.stringify(articles, null, 2), "utf8");
  console.log(`💾 News saved to ${NEWS_FILE}`);
}

module.exports = { fetchNews, saveNews };
