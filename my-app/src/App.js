import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
// Import your page components
import Home from './pages/Home';
import Handwriting from './pages/Handwriting';
import EyeSpeech from './pages/EyeSpeech';
import DyslexiaQuiz from './pages/Quiz';
import DyslexiaSupport from './pages/Solution';
import AboutDyslexia from './pages/About';
import Ab from "./pages/about2"
const App = () => {
  const [theme, setTheme] = useState('light');

  // Apply theme class to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      {/* You can pass theme and toggleTheme as props to Navbar or other components */}
      <Routes>
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/handwriting" element={<Handwriting theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/test" element={<EyeSpeech theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/quiz" element={<DyslexiaQuiz theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/sol" element={<DyslexiaSupport theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/about" element={<AboutDyslexia theme={theme} toggleTheme={toggleTheme} />} />
         <Route path="/ab" element={<Ab theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
