import { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import NewsCard from '../components/NewsCard';
import Loading from '../components/Loading';
import { fetchNews } from '../utils/api';
import { NewspaperClipping, Briefcase, Monitor, FilmSlate, Heartbeat, Flask, SoccerBall, Globe } from 'phosphor-react';
import {motion} from "framer-motion"
import "../styles/Categories.css"

function Categories() {
  const [, params] = useRoute('/category/:category');
  const activeCategory = params?.category || null;
  const [categoryNews, setCategoryNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allCategories = [
    { id: 'general', name: 'General', description: 'Top headlines from around the world', icon: <NewspaperClipping size={32} /> },
    { id: 'business', name: 'Business', description: 'Business, economics, and financial news', icon: <Briefcase size={32} /> },
    { id: 'technology', name: 'Technology', description: 'Latest tech innovations and news', icon: <Monitor size={32} /> },
    { id: 'entertainment', name: 'Entertainment', description: 'Movies, music, and celebrity news', icon: <FilmSlate size={32} /> },
    { id: 'health', name: 'Health', description: 'Health, medicine, and wellness updates', icon: <Heartbeat size={32} /> },
    { id: 'science', name: 'Science', description: 'Science discoveries and research', icon: <Flask size={32} /> },
    { id: 'sports', name: 'Sports', description: 'Sports events and athlete news', icon: <SoccerBall size={32} /> },
    { id: 'world', name: 'World', description: 'International news and global events', icon: <Globe size={32} /> },
  ];

  useEffect(() => {
    if (activeCategory) {
      loadCategoryNews(activeCategory);
    }
  }, [activeCategory]);

  const loadCategoryNews = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews({ category, page: 1, pageSize: 12 });
      setCategoryNews(data.articles);
    } catch (err) {
      console.error(`Failed to fetch ${category} news:`, err);
      setError(`Failed to load ${category} news. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categories-page">
      {!activeCategory ? (
        <>
          <h1>News Categories</h1>
          <p className="page-description">Browse news by category to find the topics that interest you most.</p>
          
          <div className="categories-full-grid">
            {allCategories.map(category => (
              <Link key={category.id} href={`/category/${category.id}`} className="category-full-card">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <div className="category-full-icon">{category.icon}</div>
                  <h3 className="category-full-name">{category.name}</h3>
                  <p className="category-full-description">{category.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="category-header">
            <Link href="/categories" className="back-to-categories">
              ← All Categories
            </Link>
            <h1>
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News
            </h1>
          </div>
          {loading && (
            <div className="loading">
              <Loading />
            </div>
          )}
          {error && !loading && (
            <div className="error-container">
              <p>{error}</p>
              <button 
                onClick={() => loadCategoryNews(activeCategory)}
                className="retry-button"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && categoryNews.length > 0 && (
            <div className="news-grid">
              {categoryNews.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          )}
          
          {!loading && !error && categoryNews.length === 0 && (
            <div className="empty-state">
              <p className="empty-message">No articles found in this category.</p>
              <Link href="/categories" className="browse-button">
                Browse Other Categories
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default Categories;