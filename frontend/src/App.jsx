// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

import Home from './pages/Home';
import Albums from './pages/Albums';
import SongDetail from './pages/SongDetail';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDark(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);
    useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <Router>
      <div className="min-h-screen text-base transition-all duration-300 flex flex-col ">
        <nav className="fixed top-0 w-full py-4 px-6 flex gap-6 justify-center bg-[var(--nav-background-light)] dark:bg-[var(--nav-background-dark)] shadow-md">
          <Link to="/" className="text-white font-semibold hover:underline">Home</Link>
          <Link to="/albums" className="text-white font-semibold hover:underline">Albums</Link><button
          onClick={() => setIsDark(!isDark)}
          className="fixed top-4 right-4 px-4 py-2 rounded-md font-semibold z-50 bg-[var(--button-color-light)] dark:bg-[var(--button-color-dark)] text-white dark:text-black hover:bg-[var(--link-color-light)] dark:hover:bg-yellow-400 transition"
        >
          {isDark ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
        </nav>
        <main className="flex-grow flex flex-col items-center justify-center pt-20 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/songs/:id" element={<SongDetail />} />
            <Route
          path="*"
          element={
            <div className="flex flex-col items-center text-center  dark:text-white">
              <div className="text-6xl font-extrabold text-[#fdb034] dark:text-[#fdb034]">404</div>
              <h2 className="text-2xl font-semibold mt-4 mb-6 text-[#0e8388] dark:text-[#0e8388]">
                Oops! We couldn't find the page you're looking for.
              </h2>
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                It seems that the page has either been moved or doesn't exist.
              </p>
              <a
                href="/"
                className="mt-4 px-6 py-2 bg-[#0e8388]  font-semibold rounded-md hover:bg-[#306464] transition-all"
              >
                Go Back to Home
              </a>
            </div>
          }
        />
          </Routes>

        </main>
        <footer className="footer">
          All rights reserved
        </footer>
      </div>

    </Router>
  );
}

export default App;
