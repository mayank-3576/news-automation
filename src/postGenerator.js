/**
 * postGenerator.js
 * Responsible for converting news articles into short, engaging
 * Hinglish social media posts using the OpenAI API.
 */

const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

// Path where generated posts will be saved
const OUTPUT_FILE = path.join(__dirname, "../output/posts.txt");

/**
 * Generates a Hinglish social media post for a single news article.
 *
 * @param {Object} openai  - Initialized OpenAI client instance
 * @param {Object} article - A news article object (title + description)
 * @returns {Promise<string>} Generated post text
 */
async function generatePost(openai, article) {
  const prompt =
    `You are a social media content writer who writes in Hinglish ` +
    `(a fun mix of Hindi and English, written in English script). ` +
    `Convert the following news into a short, engaging social media post (2–4 lines). ` +
    `Use emojis to make it lively. Keep it simple so beginners can understand.\n\n` +
    `News Title: ${article.title}\n` +
    `News Summary: ${article.description}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.8,
  });

  return completion.choices[0].message.content.trim();
}

/**
 * Generates Hinglish social media posts for all provided articles
 * and saves them to output/posts.txt.
 *
 * @param {Array} articles - Array of news article objects
 * @returns {Promise<Array<string>>} Array of generated post strings
 */
async function generatePosts(articles) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Please add it to your .env file."
    );
  }

  const openai = new OpenAI({ apiKey });

  console.log(`🤖 Generating Hinglish posts for ${articles.length} articles...`);

  const posts = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`  ✍️  Generating post ${i + 1}/${articles.length}: "${article.title}"`);

    try {
      const post = await generatePost(openai, article);
      posts.push(post);
    } catch (error) {
      console.error(`  ❌ Failed to generate post for article ${i + 1}: ${error.message}`);
      // Skip failed articles and continue with the rest
    }
  }

  console.log(`✅ Generated ${posts.length} posts.`);
  return posts;
}

/**
 * Saves generated posts to output/posts.txt.
 *
 * @param {Array<string>} posts - Array of generated post strings
 */
function savePosts(posts) {
  // Make sure the output directory exists
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const separator = "─".repeat(50);

  const content =
    `📅 Generated on: ${timestamp}\n` +
    `${separator}\n\n` +
    posts
      .map((post, index) => `Post ${index + 1}:\n${post}`)
      .join(`\n\n${separator}\n\n`) +
    `\n\n${separator}\n`;

  fs.writeFileSync(OUTPUT_FILE, content, "utf8");
  console.log(`💾 Posts saved to ${OUTPUT_FILE}`);
}

module.exports = { generatePosts, savePosts };
