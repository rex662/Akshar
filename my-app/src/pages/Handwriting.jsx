// src/pages/HandwritingHelper.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Report from "./Report";

const Handwriting = ({ theme }) => {
  const [childName, setChildName] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload your handwriting image first.");

    setLoading(true);
    setResult(null);

    const referenceSentence = "the quick brown fox jumps over the lazy dog";
    const userName = childName || "Anonymous";

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expected", referenceSentence);
      formData.append("name", userName);

      const response = await fetch("http://localhost:8000/hand/hand", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error analyzing handwriting");
      const ocrData = await response.json();
      setResult(ocrData);

      // Store results for guest
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }

      await fetch("http://localhost:5000/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: null,
          guestId,
          testType: "handwriting",
          data: ocrData,
          isGuest: true,
        }),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to analyze handwriting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) return alert("No report available for download.");

    try {
      const response = await fetch("http://localhost:8000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${childName || "handwriting"}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("PDF download failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-[#fef9e2] flex flex-col items-center justify-start py-10 transition-colors">
        <div className="w-full max-w-4xl bg-[#F7F5F2] rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-slate-900">Handwriting Helper</h1>
            <p className="text-slate-600 mt-2">
              Upload a handwritten sample to analyze for indicators of dysgraphia.
            </p>
          </header>

          {/* Reference sentence */}
          <div>
            <label className="text-lg font-semibold text-slate-700">Reference Sentence</label>
            <p className="mt-2 text-lg text-slate-800 bg-slate-100 p-4 rounded-lg shadow-inner">
              the quick brown fox jumps over the lazy dog
            </p>
          </div>

          {/* File upload */}
          <div className="text-center">
            <label className="cursor-pointer inline-block bg-[#CC9966] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
              Upload Handwriting Image
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {file && <p className="text-slate-500 mt-3 text-sm">{file.name}</p>}
          </div>

          {/* Analyze button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full md:w-auto bg-green-500 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Analyzing..." : "Analyze Now"}
            </button>
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex flex-col items-center justify-center mt-4 space-y-2">
              <div className="loader border-4 border-f3f3f3 border-t-4 border-t-indigo-600 rounded-full w-10 h-10 animate-spin"></div>
              <p className="text-slate-600">Processing OCR and analysis...</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div>
              <div id="handwritingReport">
                <Report result={result} timestamp={new Date().toLocaleString()} />
              </div>

              <div className={`text-center p-6 rounded-xl ${
                result.dysgraphia_risk.includes("High") ? "bg-red-100 text-red-800 border border-red-300" :
                result.dysgraphia_risk.includes("Moderate") ? "bg-yellow-100 text-yellow-800 border border-yellow-300" :
                "bg-green-100 text-green-800 border border-green-300"
              }`}>
                <p className="text-lg font-semibold">Dysgraphia Prediction:</p>
                <p className="text-2xl font-bold">{result.dysgraphia_risk}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Recognized Text (OCR Output)</h3>
                <p className="bg-slate-50 p-4 rounded-lg text-slate-800 shadow-inner"><em>{result.ocr_output}</em></p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Error Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  {["char_error_rate", "word_error_rate", "substitutions", "insertions", "deletions", "reversed_letters"].map((key) => (
                    <div key={key} className="bg-slate-100 p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-slate-600">{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <p className="text-2xl font-bold text-slate-900">{result[key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={handleDownloadReport}
                  className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Download PDF Report
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Handwriting;
