const NYT_BASE_URL = 'https://api.nytimes.com/svc';
const API_KEY = 'XJ1ObDfZDZcIYGYqTOnbCAaZA0KZ32Gs';

/**
 * Fetch news articles from New York Times
 * @param {Object} options - Fetch options
 * @param {string} options.category - Section (world, business, technology, etc.)
 * @param {string} options.searchQuery - Search query
 * @param {number} options.page - Page number
 * @param {number} options.pageSize - Not directly supported by NYT, approximated
 * @param {boolean} options.isSearch - Whether this is a search request
 * @returns {Promise<Object>}
 */

export async function fetchNews({
  category = 'general',
  searchQuery = '',
  source = '',
  page = 1,
  pageSize = 20,
  from = '',
  isSearch = false
} = {}) {
  try {
    console.log('Fetching with params:', { category, searchQuery, source, page, from, isSearch });
    const sectionMap = {
      general: 'home',
      business: 'business',
      technology: 'technology',
      entertainment: 'arts',
      health: 'health',
      science: 'science',
      sports: 'sports',
      world: 'world'
    };
    
    const section = sectionMap[category] || 'home';
    
    let url;
    const params = new URLSearchParams();
    params.append('api-key', API_KEY);
    
    if (isSearch || searchQuery) {
      url = `${NYT_BASE_URL}/search/v2/articlesearch.json`;
      params.append('q', searchQuery);
      params.append('page', (page - 1).toString());
      
      if (section !== 'home' && !isSearch) {
        params.append('fq', `section_name:${section}`);
      }
      
      if (source) {
        params.append('fq', `source:(${source})`);
      }
      
      if (from) {
        const fromDate = from.replace(/-/g, '');
        params.append('begin_date', fromDate);
      }
      
      params.append('sort', 'newest');
    } else {
      url = `${NYT_BASE_URL}/topstories/v2/${section}.json`;
    }
    
    url = `${url}?${params.toString()}`;
    
    console.log('Fetching news from NYT...', url);
    
    const response = await fetch(url);
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('NYT API error response:', errorData);
      throw new Error(errorData.fault?.faultstring || 'Failed to fetch news');
    }
    
    const data = await response.json();
    console.log('NYT API response:', data);
    
    let articles = [];
    let totalResults = 0;
    
    if (isSearch || searchQuery) {
      if (!data.response || !data.response.docs) {
        console.error('Unexpected API response format:', data);
        throw new Error('Unexpected API response format');
      }
      
      articles = data.response.docs.map(doc => ({
        source: {
          id: 'new-york-times',
          name: 'The New York Times'
        },
        author: doc.byline?.original?.replace('By ', '') || 'New York Times',
        title: doc.headline?.main || doc.headline?.print_headline || '',
        description: doc.abstract || doc.snippet || '',
        url: doc.web_url,
        urlToImage: doc.multimedia && doc.multimedia.length > 0
          ? `https://www.nytimes.com/${doc.multimedia[0].url}` 
          : 'https://static01.nyt.com/images/2023/01/22/multimedia/22-nyt-logo/22-nyt-logo-jumbo.png',
        publishedAt: doc.pub_date,
        content: doc.lead_paragraph || '',
        category: category
      }));
      
      totalResults = data.response.meta.hits;
    } else {
      if (!data.results) {
        console.error('Unexpected API response format:', data);
        throw new Error('Unexpected API response format');
      }
      
      articles = data.results.map(result => ({
        source: {
          id: 'new-york-times',
          name: 'The New York Times'
        },
        author: result.byline?.replace('By ', '') || 'New York Times',
        title: result.title || '',
        description: result.abstract || '',
        url: result.url,
        urlToImage: result.multimedia && result.multimedia.length > 0
          ? result.multimedia[0].url 
          : 'https://static01.nyt.com/images/2023/01/22/multimedia/22-nyt-logo/22-nyt-logo-jumbo.png',
        publishedAt: result.published_date,
        content: result.abstract || '',
        category: category
      }));
      
      totalResults = articles.length;
      
      if (pageSize > 0 && pageSize < articles.length) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        articles = articles.slice(start, end);
      }
    }
    
    const normalizedData = {
      status: 'ok',
      totalResults: totalResults,
      articles: articles
    };
    
    console.log('Normalized data:', {
      status: normalizedData.status,
      totalResults: normalizedData.totalResults,
      articleCount: normalizedData.articles.length
    });
    
    return normalizedData;
  } catch (error) {
    console.error('API error details:', error);
    throw error;
  }
}