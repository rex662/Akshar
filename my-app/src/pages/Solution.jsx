import React, { useState, useEffect } from "react";
import "./Solution.css";
import Navbar from "../components/Navbar";

export default function DyslexiaSupport() {
  const [isDyslexiaFont, setIsDyslexiaFont] = useState(false);
  const [ttsInput, setTtsInput] = useState("");
  const [lineInput, setLineInput] = useState("");
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [lineWordCount, setLineWordCount] = useState(0);
  const [lineError, setLineError] = useState("");
  const [syllableInput, setSyllableInput] = useState("");
  const [syllableWordCount, setSyllableWordCount] = useState(0);
  const [syllableOutput, setSyllableOutput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const maxWords = 5000;

  const toggleFont = () => setIsDyslexiaFont(!isDyslexiaFont);

  const speakText = () => {
    if (!ttsInput.trim()) return alert("Please enter some text to read aloud.");
    const utterance = new SpeechSynthesisUtterance(ttsInput);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const updateLineWordCount = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    setLineWordCount(words.length);
    setLineError(
      words.length <= maxWords
        ? ""
        : `Error: Maximum word limit of ${maxWords} exceeded.`
    );
  };

  const updateSyllableWordCount = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    setSyllableWordCount(words.length);
    setErrorMsg(
      words.length <= maxWords
        ? ""
        : `Error: Maximum word limit of ${maxWords} exceeded.`
    );
  };

  const loadLines = () => {
    const text = lineInput.trim();
    const words = text ? text.split(/\s+/) : [];
    if (words.length > maxWords) return;
    if (!text) return alert("Please enter some text to load lines.");
    const splitLines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
    setLines(splitLines);
    setCurrentLine(0);
  };

  const highlightNextLine = () => {
    if (lines.length === 0) return;
    setCurrentLine((prev) => (prev + 1) % lines.length);
  };

 const getSyllables = async () => {
  const text = syllableInput.trim();
  if (!text) return alert("Please enter some words to split into syllables.");

  try {
    const res = await fetch("http://127.0.0.1:8000/split/split", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) return setErrorMsg(data.error || "Something went wrong.");
    setSyllableOutput(data.output);
  } catch (err) {
    setErrorMsg("Network error. Please try again later.");
  }
};

  useEffect(() => {
    updateLineWordCount(lineInput);
  }, [lineInput]);

  useEffect(() => {
    updateSyllableWordCount(syllableInput);
  }, [syllableInput]);

  return (
    <div
      className={`app-container ${isDyslexiaFont ? "dyslexia-font" : ""}`}
      style={{
        backgroundColor: "#fdf4ff", // soft pastel base
        backgroundImage: `
          linear-gradient(45deg, rgba(255, 228, 225, 0.25) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(208, 235, 255, 0.25) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(255, 249, 230, 0.25) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(245, 222, 255, 0.25) 75%)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        minHeight: "100vh",
        paddingBottom: "4rem",
      }}
    >
      <Navbar />

      <div className="header mt-4 text-center text-black">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
          Dyslexia Reading Support Tools
        </h1>
        <p className="mb-4 text-lg md:text-xl">
          Empowering readers with tools designed for clarity and comprehension.
        </p>
        <button className="btn btn-primary" onClick={toggleFont}>
          {isDyslexiaFont
            ? "Disable Dyslexia-Friendly Font"
            : "Enable Dyslexia-Friendly Font"}
        </button>
      </div>

      {/* Tools Grid */}
      <div className="tools-grid mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Text-to-Speech */}
        <div className="floating-card card p-4 rounded-2xl shadow-lg bg-white transition transform hover:scale-105">
          <h2 className="text-xl font-bold mb-2">🔊 Text-to-Speech Reader</h2>
          <textarea
            placeholder="Paste or type text here..."
            value={ttsInput}
            onChange={(e) => setTtsInput(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />
          <button className="btn btn-primary w-full" onClick={speakText}>
            Read Aloud
          </button>
        </div>

        {/* Line-by-Line */}
        <div className="floating-card card p-4 rounded-2xl shadow-lg bg-white transition transform hover:scale-105">
          <h2 className="text-xl font-bold mb-2">📖 Line-by-Line Reader</h2>
          <textarea
            placeholder="Paste or type text here to read line-by-line..."
            value={lineInput}
            onChange={(e) => setLineInput(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />
          <span className="text-sm text-gray-600">Words: {lineWordCount}</span>
          <p className="text-red-600 text-sm">{lineError}</p>
          <button className="btn btn-primary w-full mt-2" onClick={loadLines}>
            Load Lines for Reading
          </button>
          <div className="line-display mt-2 space-y-1">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className={`block p-1 rounded ${
                  currentLine === idx ? "bg-yellow-100 font-bold" : ""
                }`}
              >
                {line}
              </span>
            ))}
          </div>
          {lines.length > 0 && (
            <button
              className="btn btn-primary w-full mt-2"
              onClick={highlightNextLine}
            >
              Next Line
            </button>
          )}
        </div>

        {/* Syllable Splitter */}
        <div className="floating-card card p-4 rounded-2xl shadow-lg bg-white transition transform hover:scale-105">
          <h2 className="text-xl font-bold mb-2">
            🔡 Syllable Splitter (requires backend API)
          </h2>
          <textarea
            placeholder="Type words here..."
            value={syllableInput}
            onChange={(e) => setSyllableInput(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />
          <span className="text-sm text-gray-600">
            Words: {syllableWordCount}
          </span>
          <button className="btn btn-primary w-full mt-2" onClick={getSyllables}>
            Split into Syllables
          </button>
          <p className="text-red-600 text-sm">{errorMsg}</p>
          <pre className="syllable-output mt-2 bg-gray-50 p-2 rounded">
            {syllableOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
