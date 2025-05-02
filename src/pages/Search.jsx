import { useState } from 'react';
import { MagnifyingGlass } from 'phosphor-react';
import NewsCard from "../components/NewsCard";
import ScrollFadeIn from '../components/ScrollFadeIn';
import "../styles/Search.css";

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(false);

    try {
      const response = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=XJ1ObDfZDZcIYGYqTOnbCAaZA0KZ32Gs&q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      console.log(data)
      const articles = data.response.docs || [];

      const formatted = await Promise.all(
        articles.map(async (article) => {
          console.log(article.multimedia.thumbnail.url)
          return {
            title: article.headline?.main || '',
            description: article.abstract || '',
            url: article.web_url,
            urlToImage: article.multimedia.default.url,
            source: { name: article.source?.name || 'NYTimes' },
            publishedAt: article.pub_date,
            category: article.section_name?.toLowerCase().replace(/\s/g, '') || 'general'
          };
        })
      );

      setResults(formatted);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="search-page">
      <ScrollFadeIn>
      <h1>Search News</h1>
      <form onSubmit={handleSearch} className="search-form">
        <MagnifyingGlass size={20} color="#888" />
        <input
          type="text"
          placeholder="Search for news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      </ScrollFadeIn>
      {loading && <div className="loading"><p>Loading...</p></div>}

      {error && <div className="error-container"><p>{error}</p></div>}
      {results.length > 0 && (
        <div className="search-results-header">
          <p>Found {results.length} articles for “{searchQuery}”</p>
        </div>
      )}
      <ScrollFadeIn>
      {results.length > 0 ? (
        <div className="news-grid">
          {results.map((article, index) => (
            <ScrollFadeIn>
            <NewsCard key={index} article={article} />
            </ScrollFadeIn>
          ))}
        </div>
      ) : (
        searched && !loading && <div className="empty-state"><p>No results found.</p></div>
      )}
      </ScrollFadeIn>
    </div>
  );
}
export default Search;