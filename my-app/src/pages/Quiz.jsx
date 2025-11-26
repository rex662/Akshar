import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "material-icons/iconfont/material-icons.css";

const questions = [
  {
    question: "Does the child frequently guess words instead of sounding them out?",
    options: [
      { text: "Never guess!", emoji: "😎", score: 0 },
      { text: "Sometimes I guess...", emoji: "🤔", score: 1 },
      { text: "I guess a lot!", emoji: "🤫", score: 2 },
      { text: "Always!", emoji: "🦸", score: 3 },
    ],
  },
  {
    question: "Does the child have trouble recognizing common sight words?",
    options: [
      { text: "No trouble", emoji: "✅", score: 0 },
      { text: "Minor trouble", emoji: "🤏", score: 1 },
      { text: "Regular trouble", emoji: "😕", score: 2 },
      { text: "Constant trouble", emoji: "😣", score: 3 },
    ],
  },
  {
    question: "Does the child mix up letters like b/d or p/q while reading or writing?",
    options: [
      { text: "Never", emoji: "🙅", score: 0 },
      { text: "Sometimes", emoji: "🤷", score: 1 },
      { text: "Often", emoji: "🔄", score: 2 },
      { text: "Always", emoji: "♻️", score: 3 },
    ],
  },
  {
    question: "Does the child read much more slowly than peers?",
    options: [
      { text: "Not at all", emoji: "⚡", score: 0 },
      { text: "A little slower", emoji: "🚶", score: 1 },
      { text: "Quite slow", emoji: "🐢", score: 2 },
      { text: "Extremely slow", emoji: "⏳", score: 3 },
    ],
  },
  {
    question: "Does the child struggle to spell even simple words correctly?",
    options: [
      { text: "Rarely misspells", emoji: "✍️", score: 0 },
      { text: "Occasionally", emoji: "📝", score: 1 },
      { text: "Frequently", emoji: "📉", score: 2 },
      { text: "Always", emoji: "🚨", score: 3 },
    ],
  },
  {
    question: "Does the child avoid reading activities because they feel difficult?",
    options: [
      { text: "Loves reading", emoji: "📚", score: 0 },
      { text: "Sometimes avoids", emoji: "😐", score: 1 },
      { text: "Often avoids", emoji: "🙁", score: 2 },
      { text: "Always avoids", emoji: "🚫", score: 3 },
    ],
  },
];

const getResultMessage = (score) => {
  if (score <= 6) return "🟢 Unlikely Dyslexia – No significant signs.";
  if (score <= 13) return "🟡 Mild Signs – Monitor and support.";
  if (score <= 20) return "🟠 Moderate Concern – Consider professional screening.";
  return "🔴 High Concern – Seek professional evaluation.";
};

export default function DyslexiaQuiz() {
  const REACT_API=process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (qIndex, oIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = oIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitted(true);

    // Calculate score
    const totalScore = answers.reduce(
      (acc, curr, i) => (curr !== null ? acc + questions[i].options[curr].score : acc),
      0
    );

    const result = getResultMessage(totalScore);

    // Guest ID handling
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }

    // Prepare payload for individual storage
    const payload = {
      guestId,
      testType: "quiz",
      isGuest: true,
      data: {
        score: totalScore,
        totalQuestions: questions.length,
        answers: answers.map((ans, i) => ({
          question: questions[i].question,
          selectedOption: ans !== null ? questions[i].options[ans].text : null,
          score: ans !== null ? questions[i].options[ans].score : 0,
        })),
        overallRisk: result,
      },
      overallRisk: result, // separate field for easy query
    };

    // Send to backend
    try {
      const response = await fetch(`${REACT_API}/api/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save quiz results");

      const resData = await response.json();
      console.log("✅ Quiz saved:", resData);
    } catch (err) {
      console.error("❌ Error sending quiz to DB:", err);
    }
  };

  const totalScore = answers.reduce(
    (acc, curr, i) => (curr !== null ? acc + questions[i].options[curr].score : acc),
    0
  );

  const result = getResultMessage(totalScore);

  return (
    <div className="bg-[#fef9e2] font-inter min-h-screen relative">
      <div className="absolute inset-0 z-0" />
      <Navbar />
      <main className="container mx-auto px-4 py-10 flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-fredoka text-[#00796B] mb-2">
            Word Explorer Quiz!
          </h1>
          <p className="text-[#004D40] text-lg">
            Let's see how you read words. It's a fun game!
          </p>
        </div>

        {!submitted ? (
          <div className="w-full max-w-2xl">
            {/* Question Card */}
            <div className="bg-[#F7F5F2] p-8 rounded-2xl shadow-lg border-4 border-[#4DB6AC] mb-8 relative">
              <div className="absolute -top-6 -left-6 bg-[#FFC107] text-white font-fredoka text-3xl w-16 h-16 rounded-full flex items-center justify-center border-4 border-white">
                {currentQuestion + 1}
              </div>
              <h2 className="text-2xl font-bold mb-6 text-[#004D40] text-center">
                {questions[currentQuestion].question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      answers[currentQuestion] === oIndex
                        ? "border-[#FFC107] bg-[#FFF8E1]"
                        : "border-gray-200 hover:border-[#FFC107] hover:bg-[#FFF8E1]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={oIndex}
                      checked={answers[currentQuestion] === oIndex}
                      onChange={() => handleOptionSelect(currentQuestion, oIndex)}
                      className="form-radio text-[#FFC107] focus:ring-[#FFC107] h-6 w-6"
                    />
                    <span className="ml-4 text-lg text-gray-700 font-semibold">
                      {option.text}
                    </span>
                    <span className="ml-auto text-3xl">{option.emoji}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B2DFDB] text-[#004D40] font-bold text-lg hover:bg-[#80CBC4] transition-colors shadow-md disabled:opacity-50"
              >
                ⬅ Back
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFC107] text-white font-fredoka text-2xl hover:bg-amber-500 transition-colors shadow-lg transform hover:scale-105"
                >
                  Next ➡
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-green-600 text-white font-fredoka text-2xl hover:bg-green-700 transition-colors shadow-lg transform hover:scale-105"
                >
                  Submit ✅
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center mt-10 z-10 bg-white p-8 rounded-xl shadow-lg border-4 border-[#4DB6AC] max-w-lg">
            <h2 className="text-4xl font-semibold text-green-700 mb-4">
              Quiz Submitted 🎉
            </h2>
            <p className="text-lg font-medium mb-2">
              Total Score: {totalScore} / {questions.length * 3}
            </p>
            <p className="text-base font-bold text-gray-800">{result}</p>

            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={() => {
                  setAnswers(Array(questions.length).fill(null));
                  setSubmitted(false);
                  setCurrentQuestion(0);
                }}
                className="bg-[#CC9966] text-white px-5 py-2 rounded hover:bg-brown"
              >
                Retake Quiz 🔄
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
