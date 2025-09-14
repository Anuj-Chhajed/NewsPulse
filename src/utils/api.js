const NYT_BASE_URL = 'https://api.nytimes.com/svc';
const API_KEY = 'XJ1ObDfZDZcIYGYqTOnbCAaZA0KZ32Gs';

export async function fetchNews({ category = 'general', page = 1, pageSize = 20 } = {}) {
  try {
    let url;
      const section = category === 'general' ? 'home' : category;
      url = `${NYT_BASE_URL}/topstories/v2/${section}.json?api-key=${API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      
      const articles = data.results.map(result => ({
        source: { id: 'nyt', name: 'New York Times' },
        author: result.byline?.replace('By ', '') || 'New York Times',
        title: result.title || '',
        description: result.abstract || '',
        url: result.url,
        urlToImage: result.multimedia?.[0]?.url,
        publishedAt: result.published_date,
        category: category
      }));
      
      return {
        status: 'ok',
        articles: articles.slice(0, pageSize)
      };

    
  } catch (error) {
    console.error('Error in fetchNews:', error);
    return {
      status: 'error',
      articles: []
    };
  }
}
