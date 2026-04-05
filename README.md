# news-automation

Automated system to fetch daily India current-affairs news, convert them into short engaging **Hinglish social media posts** using OpenAI, and save them — runs daily via **GitHub Actions**.

---

## 🗂️ Project Structure

```
news-automation/
├── src/
│   ├── main.js            # Entry point — orchestrates the full pipeline
│   ├── newsService.js     # Fetches news from News API & saves to data/news.json
│   └── postGenerator.js   # Generates Hinglish posts via OpenAI & saves to output/posts.txt
├── data/
│   └── news.json          # Auto-updated: raw news articles
├── output/
│   └── posts.txt          # Auto-updated: generated Hinglish social media posts
├── .github/
│   └── workflows/
│       └── daily-news.yml # GitHub Actions workflow (runs daily at 6 AM UTC)
├── .env.example           # Template for required environment variables
└── package.json
```

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/mayank-3576/news-automation.git
cd news-automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Then edit .env and add your real API keys
```

| Variable         | Description                                        | Where to get it                              |
|------------------|----------------------------------------------------|----------------------------------------------|
| `NEWS_API_KEY`   | API key for News API (free tier available)         | https://newsapi.org/register                 |
| `OPENAI_API_KEY` | API key for OpenAI                                 | https://platform.openai.com/api-keys         |

### 4. Run locally

```bash
npm start
```

Generated posts will be saved to `output/posts.txt`. Fetched news will be saved to `data/news.json`.

---

## 🤖 GitHub Actions (Daily Automation)

The workflow in `.github/workflows/daily-news.yml` runs automatically every day at **6:00 AM UTC (11:30 AM IST)**.

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

- `NEWS_API_KEY` — your News API key
- `OPENAI_API_KEY` — your OpenAI API key

You can also trigger the workflow manually from the **Actions** tab using the **workflow_dispatch** event.

---

## 📦 Dependencies

| Package      | Purpose                               |
|--------------|---------------------------------------|
| `node-fetch` | HTTP client for News API calls        |
| `openai`     | OpenAI SDK for generating AI posts    |
| `dotenv`     | Loads environment variables from .env |
