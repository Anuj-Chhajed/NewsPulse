# 📰 NewsPulse - Live News Aggregator

NewsPulse is a modern, responsive, and dynamic news aggregator application built with React and Vite. It leverages the New York Times API to deliver real-time top stories, breaking news, and categorized articles right to your screen.

## 🚀 Live Demo
**Experience the live project here:** https://news-pulse-nine.vercel.app/

---

## 🎓 Project Overview

This project was developed to demonstrate proficiency in modern frontend web development, API integration, and state management. The application provides users with a seamless news-reading experience, complete with search functionality, category filtering, and local bookmarking.

## ✨ Features

* **Real-Time Headlines:** A dynamic homepage featuring a breaking news ticker and an animated slideshow of top stories.
* **Category Browsing:** Read news tailored to your interests, including Business, Technology, Health, Sports, Science, Politics, and more.
* **Article Search:** A robust search page that allows users to find specific news articles using the NYT Article Search API.
* **Save for Later (Bookmarking):** Users can save their favorite articles. Bookmarks are persisted locally using the browser's `localStorage`.
* **Dark/Light Mode:** Full theme support with a toggle to switch between light and dark viewing modes seamlessly.
* **Smooth Animations:** Integrated page transitions and scroll animations powered by Framer Motion.
* **Responsive Design:** Fully mobile-friendly UI featuring a responsive navigation bar and adaptable CSS grid layouts.

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite
* **Styling:** Custom Vanilla CSS with CSS Variables for theming
* **Animations:** Framer Motion
* **Icons:** Phosphor React / React Icons
* **Data Fetching:** Fetch API with NYT `topstories/v2` and `articlesearch.json`
* **Deployment:** Vercel (Configured with `vercel.json` for SPA routing)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/newspulse.git](https://github.com/yourusername/newspulse.git)
   cd newspulse

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **API Key Setup (Optional but Recommended)**
   
      The project currently includes a hardcoded API key in `src/utils/api.js` and `src/pages/Search.jsx`. For best practices, you should replace this with your own New York Times API Key and move it to a `.env` file.

4. **Run the Development Server**
   
    ```bash
    npm run dev
    ```

5. **View the App:**
   
      Open your browser and navigate to http://localhost:5173.

## 📂 Project Structure

```text
📦 newspulse
├── 📁 public             # Static assets
├── 📁 src
│   ├── 📁 assets         # Local images and icons
│   ├── 📁 components     # Reusable UI (Header, Footer, NewsCard, Loading, etc.)
│   ├── 📁 pages          # Route components (Home, Categories, Search, Saved, Article)
│   ├── 📁 styles         # Component-specific CSS modules
│   ├── 📁 utils          # Utility functions (api.js for NYT API fetching)
│   ├── App.jsx           # Main App component & Route definitions
│   ├── main.jsx          # React DOM entry point
│   └── styles.css        # Global CSS and Theme variables
├── vercel.json           # Deployment configurations
├── vite.config.js        # Vite bundler configuration
└── package.json          # Project dependencies
```

## 🔌 API Integration
This project uses the New York Times API to fetch data:
- **Top Stories API** (`/topstories/v2/{section}.json`) used on the Home and Categories pages to fetch the latest trending articles.
- **Article Search API** (`/search/v2/articlesearch.json`) used on the Search page to allow users to query specific news topics.

# 🌐 Deployment Details

This project is deployed using **Vercel**.

Because this is a **Single Page Application (SPA)**, a `vercel.json` file is included in the root directory. This file contains rewrite rules:

```json
{
  "source": "/(.*)",
  "destination": "/"
}
```

to ensure that users do not encounter **404 Not Found** errors when refreshing the page on dynamic routes.
