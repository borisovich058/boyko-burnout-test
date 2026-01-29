import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StatsPage } from '@/pages/TestPage/StatsPage/StatsPage';
import { TestPage } from '@/pages/TestPage/TestPage';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🧠 Опросник Бойко
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                Пройти тест
              </Link>
              <Link to="/stats" className="nav-link">
                Статистика
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Опросник эмоционального выгорания В.В. Бойко</p>
          <p>Для научного исследования. Все данные анонимны.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;