import { useState, useEffect } from 'react';
import "../styles/NewsCard.css"
function NewsCard({ article }) {
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    setIsSaved(savedArticles.some(item => item.url === article.url));
  }, [article.url]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    
    if (isSaved) {
      const filtered = savedArticles.filter(item => item.url !== article.url);
      localStorage.setItem('savedArticles', JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      const newSaved = [...savedArticles, article];
      localStorage.setItem('savedArticles', JSON.stringify(newSaved));
      setIsSaved(true);
    }
  };
  
  const truncate = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  return (
    <a 
      href={`/article/${encodeURIComponent(article.url)}`}
      className="news-card"
    >
      <div className="news-card-image">
        {article.urlToImage ? (
          <img 
            src={article.urlToImage} 
            alt={article.title || 'News image'} 
          />
        ) : (
          <div className="no-image">
            <span>No image</span>
          </div>
        )}
        
        <button
          onClick={toggleSave}
          className={`save-button ${isSaved ? 'saved' : ''}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isSaved ? 'currentColor' : 'none'} 
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        {article.category && (
          <span className={`category-badge category-${article.category}`}>
            {article.category}
          </span>
        )}
      </div>
      
      <div className="news-card-content">
        <h3 className="news-card-title">{article.title}</h3>
        
        <p className="news-card-description">
          {truncate(article.description, 120)}
        </p>
        
        <div className="news-card-footer">
          <span>{article.source?.name || 'Unknown source'}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}
export default NewsCard;