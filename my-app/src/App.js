import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
// Import your page components
import Home from './pages/Home';
import Handwriting from './pages/Handwriting';
import EyeSpeech from './pages/EyeSpeech';
import DyslexiaQuiz from './pages/Quiz';
import DyslexiaSupport from './pages/Solution';
import AboutDyslexia from './pages/About';
import Ab from "./pages/about2";
import Login from "./components/Login";
import Signup from './components/Signup';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/handwriting" element={<Handwriting />} />
        <Route path="/test" element={<EyeSpeech />} />
        <Route path="/quiz" element={<DyslexiaQuiz />} />
        <Route path="/sol" element={<DyslexiaSupport />} />
        <Route path="/about" element={<AboutDyslexia />} />
        <Route path="/ab" element={<Ab />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
