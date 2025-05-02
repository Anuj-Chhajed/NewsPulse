import { Route, Switch } from 'wouter';
import { ThemeProvider } from './components/ThemeProvider';
import './styles.css';

import Home from './pages/Home';
import Search from './pages/Search';
import Saved from './pages/Saved';
import Article from './pages/Article';
import Categories from './pages/Categories';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="app min-h-screen flex flex-col">
        <Header />
        <main className="container flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/categories" component={Categories} />
            <Route path="/category/:category" component={Categories} />
            <Route path="/search" component={Search} />
            <Route path="/saved" component={Saved} />
            <Route path="/article/:id" component={Article} />
            <Route>
              <div className="empty-state">
                <h2>Page Not Found</h2>
                <p className="empty-message">The page you're looking for doesn't exist.</p>
                <a href="/" className="browse-button">
                  Go Home
                </a>
              </div>
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
export default App;