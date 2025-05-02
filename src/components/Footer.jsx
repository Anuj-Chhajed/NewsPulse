import "../styles/Footer.css"
function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-left">
            <h3 className="footer-logo">NewsPulse</h3>
            <p className="footer-tagline">Stay informed with the latest news</p>
          </div>
          
          <div className="footer-center">
            <h4 className="footer-heading">Quick Links</h4>
            <nav className="footer-nav">
              <a href="/" className="footer-link">Home</a>
              <a href="/categories" className="footer-link">Categories</a>
              <a href="/search" className="footer-link">Search</a>
              <a href="/saved" className="footer-link">Saved Articles</a>
            </nav>
          </div>
          
          <div className="footer-right">
            <h4 className="footer-heading">About</h4>
            <p className="footer-about">
              NewsPulse is a modern news aggregator bringing you the latest headlines from around the world.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="container">
            <p className="copyright">© {currentYear} NewsPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  export default Footer;