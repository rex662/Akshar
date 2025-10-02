// src/pages/EyeSpeech.js
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const EyeSpeech = ({ theme, toggleTheme }) => {
  // ------------------- States --------------------
  const [gazePoints, setGazePoints] = useState([]);
  const [eyeResult, setEyeResult] = useState(null);
  const [speechResult, setSpeechResult] = useState(null);
  const [combinedResult, setCombinedResult] = useState(null);
  const [isEyeTrackerRunning, setIsEyeTrackerRunning] = useState(false);
  const [recordingSpeech, setRecordingSpeech] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const navigate = useNavigate();

  // ------------------- Refs --------------------
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ------------------- Helper: Manage Webgazer Script --------------------
  useEffect(() => {
    // Check if webgazer is already loaded (useful for hot-reloading)
    if (window.webgazer) {
      window.webgazer.clearGazeListener();
      window.webgazer.end();
    }

    const script = document.createElement("script");
    script.src = "https://webgazer.cs.brown.edu/webgazer.js";
    script.async = true;

    // Use onload to ensure webgazer is available before trying to use it
    script.onload = () => {
      // webgazer is now available on window.webgazer
      console.log("WebGazer script loaded.");
    };

    document.body.appendChild(script);

    return () => {
      if (window.webgazer) {
        window.webgazer.clearGazeListener();
        window.webgazer.end();
      }
      document.body.removeChild(script);
    };
  }, []);

  // ------------------- Eye Tracking Control --------------------

  const startEyeTracking = async () => {
    if (!window.webgazer) {
      alert("WebGazer is still loading. Please wait a moment.");
      return;
    }

    try {
      // 1. Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 2. Configure and start WebGazer
      window.webgazer.setGazeListener((data) => {
          if (data) {
            setGazePoints((prev) => {
              // Keep the last 100 points
              const newPoints = [...prev, [data.x, data.y]];
              return newPoints.length > 100 ? newPoints.slice(newPoints.length - 100) : newPoints;
            });
          }
        })
        .begin()
        .catch(err => console.error("WebGazer start error:", err)); // Catches errors from begin()

      setIsEyeTrackerRunning(true);
      setEyeResult(null); // Clear previous result
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };


  const stopEyeTracking = () => {
    if (window.webgazer) {
      window.webgazer.clearGazeListener();
      window.webgazer.end();
    }

    // Stop all tracks on the video element's stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsEyeTrackerRunning(false);
    // Clearing gazePoints after stopping
    // setGazePoints([]); 
  };
  
  const sendEyeData = async () => {
    // Ensure eye tracking is stopped before sending data
    stopEyeTracking();
    
    // Ensure we have points to send
    if (gazePoints.length === 0) {
        setEyeResult({ error: "No gaze data recorded. Start the game first." });
        return { error: "No gaze data recorded. Start the game first." };
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/eye/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gaze_points: gazePoints }),
      });
      const data = await res.json();
      setEyeResult(data);
      return data;
    } catch {
      const err = { error: "Eye API not reachable" };
      setEyeResult(err);
      return err;
    }
  };

  // ------------------- Speech Recording --------------------
  const startRecording = async () => {
    if(recordingSpeech) return; // Prevent double click
    
    audioChunksRef.current = [];
    setRecordingSpeech(true);
    setSpeechResult(null); // Clear previous result
    setAudioUrl(null); // Clear previous audio

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      // Keep a reference to the stream to stop it later
      mediaRecorderRef.current.stream = stream;

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setRecordingSpeech(false);
        // Stop all tracks on the microphone stream
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));

        const formData = new FormData();
        formData.append("file", blob, "reading.webm");
        formData.append(
          "text",
          "The quick brown fox jumps over the lazy dog."
        );

        try {
          const res = await fetch("http://127.0.0.1:8000/speech/result", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          setSpeechResult(data);
        } catch {
          setSpeechResult({
            prediction: 0,
            error: "Speech API not reachable",
          });
        }
      };

      mediaRecorderRef.current.start();

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      }, 10000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setRecordingSpeech(false);
      alert("Could not access microphone. Please check permissions.");
    }
  };
  
  // ------------------- Combined Result --------------------
  const getCombinedResult = async (eyeData) => {
    // Use eyeData if passed, otherwise use state, otherwise try to send the data
    const eye = eyeData || eyeResult || (await sendEyeData());
    
    if (!speechResult || speechResult.error) {
        if (!combinedResult || combinedResult.error !== "Please record speech first.") {
            setCombinedResult({ error: "Please record speech first." });
        }
        return;
    }
    
    if (eye.error) {
        if (!combinedResult || combinedResult.error !== "Eye data not available or API error.") {
            setCombinedResult({ error: eye.error }); // Use the actual eye error
        }
        return;
    }
    
    const eyeScore = eye?.score ?? 0;
    const speechScore = speechResult?.prediction ?? 0;

    try {
      const res = await fetch("http://127.0.0.1:8000/combined-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eye_score: eyeScore, speech_score: speechScore }),
      });
      const data = await res.json();
      setCombinedResult(data);
    } catch {
      setCombinedResult({ error: "Combined API not reachable" });
    }
  };

  // ------------------- Auto trigger combined result --------------------
  useEffect(() => {
    if (speechResult && !speechResult.error) {
        getCombinedResult();
    }
  }, [speechResult, eyeResult]); 

  // ------------------- JSX --------------------
  return (
    <div className="flex flex-col">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div
        style={{
          backgroundColor: "#e3f2fd",
          backgroundImage: `
            repeating-linear-gradient(to right,#bbdefb,#bbdefb 1px,transparent 1px,transparent 100%),
            repeating-linear-gradient(to bottom,#bbdefb,#bbdefb 1px,transparent 1px,transparent 32px)
          `,
          backgroundSize: "32px 32px",
        }}
        // ADJUSTED: Added flex classes to center content vertically and horizontally
        className="playbook-bg min-h-screen p-6 font-sans pt-[80px] gap-4 dark:bg-zinc-800 flex flex-col justify-center items-center"
      >
        <div
          // ADJUSTED: max-w-7xl for increased width. min-h-fit to respect the vh below.
          className="w-full max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative min-h-fit lg:min-h-[90vh]"
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            border: "1px solid #CFD8DC",
          }}
        >
          {/* Left Side: Eye + Speech */}
          <div className="floating w-full position-relative mx-auto playbook-binding">
            <div className="space-y-6 bg-white p-6 sm:p-8 md:p-10 flex flex-col rounded-2xl shadow-lg shadow-gray-700 gap-4 flex-grow transition-all hover:shadow-2xl h-full">
              <h2
                className="text-center text-4xl md:text-6xl font-bold text-blue-600 mb-4"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                MY PLAYBOOK
              </h2>
              <nav className="flex justify-center space-x-2 sm:space-x-4 mb-8">
                <a className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-blue-100 text-blue-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-blue-200 transition" >EYE</a>
                <a className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-yellow-100 text-yellow-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-yellow-200 transition" >SPEECH</a>
                <a className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-green-100 text-green-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-green-200 transition" >COMBINED</a>
                <a className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-red-100 text-red-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-red-200 transition" >Result</a>
              </nav>

              {/* Eye Gaze Card */}
              <div className="space-y-4 w-full bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700 mb-6 floating">
                <h3 className="text-blue-600 text-xl sm:text-2xl font-bold mb-3 flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl">
                    visibility
                  </span>
                  Eye Gaze Game
                </h3>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted // Mute video feed to avoid echo issues
                  className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-300 dark:text-gray-400 object-cover"
                >
                  <p>CAMERA FEED</p>
                </video>
                <div className="flex flex-wrap gap-3">
                    <button
                    onClick={startEyeTracking}
                    disabled={isEyeTrackerRunning}
                    className={`animate-bounce transition-all hover:shadow-2xl ${isEyeTrackerRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 '} text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 justify-center`}
                    >
                    <span className="material-symbols-outlined">play_circle</span>
                    {isEyeTrackerRunning ? "Running..." : "Start Game"}
                    </button>
                    <button
                    onClick={stopEyeTracking}
                    disabled={!isEyeTrackerRunning}
                    className=" animate-bounce transition-all hover:shadow-2xl bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 flex items-center gap-2 justify-center"
                    >
                    <span className="material-symbols-outlined">stop_circle</span>
                    Stop Game
                    </button>
                    <button
                    onClick={sendEyeData}
                    disabled={gazePoints.length === 0 || isEyeTrackerRunning}
                    className={` animate-bounce transition-all hover:shadow-2xl ${gazePoints.length === 0 || isEyeTrackerRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 justify-center`}
                    >
                    <span className=" material-symbols-outlined">analytics</span>
                    Analyse Eye Data
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Gaze Points Recorded: {gazePoints.length}
                </p>
              </div>

              {/* Speech Analysis Card */}
              <div className="space-y-4 bg-yellow-50 p-6 rounded-xl border border-yellow-400">
                <h3 className="text-2xl font-bold text-yellow-600 mb-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl">mic</span>
                  Speech Analysis
                </h3>
                <p className="mt-2 text-xl">
                  Read this aloud:
                  <strong className="block mt-2 p-3 bg-white rounded-lg border border-yellow-200 shadow-sm text-gray-700">
                    The quick brown fox jumps over the lazy dog.
                  </strong>
                </p>
                <button
                  onClick={startRecording}
                  disabled={recordingSpeech}
                  className={`transition-all hover:shadow-xl text-white text-xl px-6 py-3 rounded-xl shadow-lg cursor-pointer ${recordingSpeech ? 'bg-red-500 animate-pulse' : 'bg-yellow-500 hover:bg-yellow-600 animate-bounce'} flex items-center gap-2 justify-center`}
                >
                    <span className="material-symbols-outlined">{recordingSpeech ? 'mic_off' : 'mic'}</span>
                  {recordingSpeech ? "Recording..." : "Start Reading (10s)"}
                </button>

                <p className="text-sm text-gray-500 mt-2">
                  Recording automatically stops after 10 seconds.
                </p>
                {audioUrl && (
                    <div className="mt-4 p-3 bg-white rounded-lg shadow-inner">
                        <p className="text-gray-600 text-sm mb-2">Recorded Audio:</p>
                        <audio src={audioUrl} controls className="w-full" />
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider Strip */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-6 bg-gray-300 pointer-events-none"
            style={{
              transform: "translateX(-50%)",
              backgroundImage:
                "linear-gradient(to bottom, #17151586 50%, transparent 50%)",
              backgroundSize: "4px 24px",
            }}
          ></div>

          {/* Right Side: Combined Results */}
          <div className="w-full transition-all hover:shadow-2xl floating bg-white p-6 sm:p-8 md:p-10 flex flex-col rounded-2xl shadow-lg shadow-gray-700 gap-4 flex-grow h-full">
            <div className="space-y-6 bg-green-50 p-6 rounded-xl border border-green-200 text-gray-700 flex-grow">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-4 text-green-700">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
                Your Progress & Results
              </h2>
              <div className="space-y-4 text-lg">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-xl font-bold text-blue-600 mb-1">Eye Gaze Result:</p>
                  <span className="font-semibold text-2xl text-gray-800">
                    {eyeResult?.error ? (
                        <span className="text-red-500">{eyeResult.error}</span>
                    ) : eyeResult?.label ? (
                        <span className="text-blue-500">{eyeResult.label}</span>
                    ) : (
                        "Not analyzed"
                    )}
                  </span>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <h2 className="font-bold text-xl text-yellow-600 mb-1">Speech Result:</h2>
                  <span className="font-semibold text-2xl text-gray-800">
                    {speechResult?.error ? (
                        <span className="text-red-500">{speechResult.error}</span>
                    ) : speechResult?.prediction !== undefined ? (
                        speechResult.prediction > 0 ? (
                        <span className="text-yellow-700">🧠 Dyslexic ({speechResult.prediction.toFixed(2)})</span>
                        ) : (
                        <span className="text-green-500">✔️ Typical ({speechResult.prediction.toFixed(2)})</span>
                        )
                    ) : (
                        "Not recorded/analyzed"
                    )}
                  </span>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <strong className="font-bold text-xl text-green-700 mb-1">Combined Score:</strong>
                  <span className="font-semibold text-2xl text-gray-800 block mt-1">
                    {combinedResult?.error ? (
                        <span className="text-red-500">{combinedResult.error}</span>
                    ) : combinedResult?.combined !== undefined ? (
                        <span className="text-purple-600">{combinedResult.combined.toFixed(2)}</span>
                    ) : (
                        "Awaiting both results..."
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => getCombinedResult()}
                disabled={!eyeResult || !speechResult}
                className={`transition-all hover:shadow-2xl mt-2 px-6 py-3 rounded-xl shadow-lg transition-transform transform translate-x-4 flex items-center gap-2 justify-center text-xl font-bold ${(!eyeResult || !speechResult) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 animate-bounce'} text-white`}
              >
                <span className="material-symbols-outlined">model_training</span>
                Recalculate Combined Result
              </button>
            </div>
          </div>
        </div>
         <button 
            onClick={() => navigate("/handwriting")}
            className="page-turn-btn absolute bottom-6 right-6 p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition" 
            id="turn-page-btn"
        >
              <span className="material-icons">arrow_forward_ios</span>
            </button>
      </div>
    </div>
  );
};

export default EyeSpeech;