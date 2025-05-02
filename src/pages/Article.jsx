import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import Loading from '../components/Loading';
import "../styles/Article.css"

function Article() {
  const [, params] = useRoute('/article/:id');
  const articleUrl = params?.id ? decodeURIComponent(params.id) : null;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (!articleUrl) {
      setError('Article not found');
      setLoading(false);
      return;
    }

    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    const savedArticle = savedArticles.find(item => item.url === articleUrl);
    
    if (savedArticle) {
      setArticle(savedArticle);
      setIsSaved(true);
      setLoading(false);
    } else {
      window.location.href = articleUrl;
    }
  }, [articleUrl]);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const toggleSave = () => {
    if (!article) return;
    
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
    
    window.dispatchEvent(new Event('savedArticlesChanged'));
  };

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <a href="/" className="browse-button">Go Home</a>
      </div>
    );
  }

  return article ? (
    <article className="article-container">
      <a href="/" className="back-button">
        &larr; Back to News
      </a>
      <header className="article-header">
        <h1 className="article-title">{article.title}</h1>
        
        <div className="article-meta">
          <div className="article-source">
            <span>By {article.author || article.source?.name || 'Unknown'}</span>
            {article.source?.name && (
              <span> • {article.source.name}</span>
            )}
          </div>
          
          <div className="article-date">
            {formatDate(article.publishedAt)}
          </div>
        </div>
        
        <button 
          onClick={toggleSave}
          className={`article-save-button ${isSaved ? 'saved' : ''}`}
        >
          {isSaved ? 'Saved' : 'Save'} 
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill={isSaved ? 'currentColor' : 'none'} 
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="bookmark-icon"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </header>
      
      {article.urlToImage && (
        <div className="article-image">
          <img 
            src={article.urlToImage} 
            alt={article.title}
          />
        </div>
      )}
      
      <div className="article-content">
        {article.description && (
          <p className="article-description">
            {article.description}
          </p>
        )}
        
        {article.content ? (
          <div className="article-body">
            {article.content}
          </div>
        ) : (
          <div className="article-body">
            <p>This article preview is no longer available. Click the button below to read the full article.</p>
          </div>
        )}
        
        <div className="article-actions">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="read-more-button"
          >
            Read Full Article
          </a>
        </div>
      </div>
    </article>
  ) : null;
}
export default Article;