import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import NewsCard from '../components/NewsCard';
import Loading from '../components/Loading';
import { FiActivity } from 'react-icons/fi'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Monitor, Heartbeat, SoccerBall, GlobeHemisphereWest } from 'phosphor-react';
import { fetchNews } from '../utils/api';
import "../styles/Home.css";
import ScrollFadeIn from '../components/ScrollFadeIn';

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const slideshowInterval = useRef(null);

  const featuredCategories = [
    { id: 'business', name: 'Business', description: 'Business, economics, and financial news', icon: <Briefcase size={32} /> },
    { id: 'technology', name: 'Technology', description: 'Latest tech innovations and news', icon: <Monitor size={32} /> },
    { id: 'health', name: 'Health', description: 'Health, medicine, and wellness updates', icon: <Heartbeat size={32} /> },
    { id: 'sports', name: 'Sports', description: 'Sports events and athlete news', icon: <SoccerBall size={32} /> },
  ];

  const startSlideshow = () => {
    clearInterval(slideshowInterval.current);
    slideshowInterval.current = setInterval(() => {
      setCurrentSlide(prev => {
        const featuredCount = Math.min(5, news.length);
        return featuredCount > 0 ? (prev + 1) % featuredCount : 0;
      });
    }, 5000);
  };

  const loadTopNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews({ category: 'general', page: 1, pageSize: 30 });
      setNews(data.articles || []);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const introTimer = setTimeout(() => setAnimationComplete(true), 2000);
    loadTopNews();
    return () => {
      clearTimeout(introTimer);
      clearInterval(slideshowInterval.current);
    };
  }, []);

  useEffect(() => {
    if (!loading && news.length > 0) startSlideshow();
    return () => clearInterval(slideshowInterval.current);
  }, [loading, news]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startSlideshow();
  };

  const featuredArticles = news.slice(0, 5);
  const breakingNews     = news.slice(5,14);
  const latestNews       = news.slice(11);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (!animationComplete) {
    return (
      <div className="intro-animation">
        <motion.div
          className="intro-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FiActivity className="logo-icon" size={80}/>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
             NewsPulse
          </motion.h1>
        </motion.div>
        <motion.div
          className="loading-bar"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5 }}
        />
      </div>
    );
  }

  return (
    <div className="home-page">
      {!loading && !error && breakingNews.length > 0 && (
        <>
        <ScrollFadeIn>
          <div className="breaking-news-wrapper" style={{ marginBottom: '2rem' }}>
            <div className="breaking-news-ticker">
              <div className="ticker-label">Breaking News</div>
              <div className="ticker-marquee">
                <div className="ticker-content">
                  {Array(2).fill(breakingNews).flat().map((article, idx) => (
                    <Link key={idx} href={`/article/${encodeURIComponent(article.url)}`} className="ticker-link">
                      <span className="ticker-item">{article.title}</span>
                      <span className="ticker-separator">•</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </ScrollFadeIn>
        </>
      )}

      <h1>Today's Headlines</h1>
      {loading && (
        <div className="loading">
          <Loading />
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadTopNews} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <>
          <ScrollFadeIn delay={0.1}>
          <div className="slideshow-container">
            {featuredArticles.map((article, idx) => (
              <div
                key={idx}
                className={`slideshow-slide ${idx === currentSlide ? 'active' : ''}`}
                style={{ display: idx === currentSlide ? 'block' : 'none' }}
              >
                <div className="slide-content">
                  <img
                    src={article.urlToImage || 'https://via.placeholder.com/1200x600?text=No+Image'}
                    alt={article.title}
                    className="slide-image"
                  />
                  <div className="slide-overlay">
                    <span className="slide-category">TOP STORY</span>
                    <h2 className="slide-title">{article.title}</h2>
                    <p className="slide-meta">
                      {article.source?.name} • {formatDate(article.publishedAt)}
                    </p>
                    <Link href={`/article/${encodeURIComponent(article.url)}`} className="slide-button">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="slideshow-indicators">
              {featuredArticles.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(idx)}
                />
              ))}
            </div>
            <button
              className="slideshow-control prev"
              onClick={() => goToSlide(currentSlide === 0 ? featuredArticles.length - 1 : currentSlide - 1)}
            >
              ❮
            </button>
            <button
              className="slideshow-control next"
              onClick={() => goToSlide((currentSlide + 1) % featuredArticles.length)}
            >
              ❯
            </button>
          </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={0.2}>
            <div className="categories-quickaccess">
              <h2 className="section-title">Popular Categories</h2>
              <div className="categories-grid">
                {featuredCategories.map(c => (
                  <Link key={c.id} href={`/category/${c.id}`} className="category-card">
                    <div className="category-icon">{c.icon}</div>
                    <span className="category-name">{c.name}</span>
                  </Link>
                ))}
                <Link href="/categories" className="category-card view-all">
                  <div className="category-icon">🔍</div>
                  <span className="category-name">View All</span>
                </Link>
              </div>
            </div>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.3}>
            <div className="latest-news">
              <h2 className="section-title">Latest News</h2>
              <div className="news-grid">
                {latestNews.map((article, idx) => (
                  <NewsCard key={idx} article={article} />
                ))}
              </div>
              <div className="view-more-container">
                <Link href="/categories" className="view-more-button">
                  Browse More News
                </Link>
              </div>
            </div>
            </ScrollFadeIn>
        </>
      )}
    </div>
  );
}
export default Home;