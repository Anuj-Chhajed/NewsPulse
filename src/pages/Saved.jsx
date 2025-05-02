import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import "../styles/Saved.css"
import ScrollFadeIn from '../components/ScrollFadeIn';

function Saved() {
  const [savedArticles, setSavedArticles] = useState([]);
  
  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
      setSavedArticles(saved);
    };
    loadSaved();
    window.addEventListener('storage', loadSaved);
    const handleSaveChanges = () => loadSaved();
    window.addEventListener('savedArticlesChanged', handleSaveChanges);
    return () => {
      window.removeEventListener('storage', loadSaved);
      window.removeEventListener('savedArticlesChanged', handleSaveChanges);
    };
  }, []);
  
  const clearSaved = () => {
    if (window.confirm('Are you sure you want to remove all saved articles?')) {
      localStorage.setItem('savedArticles', '[]');
      setSavedArticles([]);
      window.dispatchEvent(new Event('savedArticlesChanged'));
    }
  };

  return (
    <div>
      <ScrollFadeIn>
      <div className="page-header">
        <h1>Saved Articles</h1>
        
        {savedArticles.length > 0 && (
          <button 
            onClick={clearSaved}
            className="clear-button"
          >
            Clear All
          </button>
        )}
      </div>
      </ScrollFadeIn>
      <ScrollFadeIn>
      {savedArticles.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">
            You haven't saved any articles yet. Browse news and click the bookmark 
            icon to save articles for later.
          </p>
          <a 
            href="/" 
            className="browse-button"
          >
            Browse News
          </a>
        </div>
      ) : (
        <div className="news-grid">
          {savedArticles.map((article, index) => (
            <ScrollFadeIn>
            <NewsCard key={index} article={article} />
            </ScrollFadeIn>
          ))}
        </div>
      )}
      </ScrollFadeIn>
    </div>
  );
}
export default Saved;