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

  // ------------------- Helper: Manage Webgazer Script (UNCHANGED) --------------------
  useEffect(() => {
    if (window.webgazer) {
      window.webgazer.clearGazeListener();
      window.webgazer.end();
    }

    const script = document.createElement("script");
    script.src = "https://webgazer.cs.brown.edu/webgazer.js";
    script.async = true;

    script.onload = () => {
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

  // ------------------- Eye Tracking Control (UNCHANGED) --------------------

  const startEyeTracking = async () => {
    if (!window.webgazer) {
      alert("WebGazer is still loading. Please wait a moment.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      window.webgazer
        .setGazeListener((data) => {
          if (data) {
            setGazePoints((prev) => {
              const newPoints = [...prev, [data.x, data.y]];
              return newPoints.length > 100
                ? newPoints.slice(newPoints.length - 100)
                : newPoints;
            });
          }
        })
        .begin()
        .catch((err) => console.error("WebGazer start error:", err));

      setIsEyeTrackerRunning(true);
      setEyeResult(null);
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

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsEyeTrackerRunning(false);
  };

  const sendEyeData = async () => {
    stopEyeTracking();

    if (gazePoints.length === 0) {
      const errorResult = {
        error: "No gaze data recorded. Start the game first.",
      };
      setEyeResult(errorResult);
      return errorResult;
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
    } catch (e) {
      const err = { error: `Eye API not reachable: ${e.message}` };
      setEyeResult(err);
      return err;
    }
  };

  // ------------------- Speech Recording (FINAL VERSION) --------------------
  const startRecording = async () => {
    if (recordingSpeech) return;

    // 1. Browser support check
    if (typeof MediaRecorder === "undefined") {
      alert("MediaRecorder API not supported. Use Chrome/Firefox.");
      return;
    }

    setRecordingSpeech(true);
    setSpeechResult(null);
    setAudioUrl(null);
    audioChunksRef.current = [];

    try {
      // 2. Check microphone availability
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (!devices.some((d) => d.kind === "audioinput")) {
        throw new Error(
          "No microphone detected. Please enable or connect one."
        );
      }

      // 3. Request permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("🎙️ Microphone stream started");

      // 4. Pick safe mime type
      let options = { mimeType: "audio/webm; codecs=opus" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "audio/webm" };
      }
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      // 5. Collect audio chunks
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      // 6. On stop → send to backend
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecordingSpeech(false);

        if (audioChunksRef.current.length === 0) {
          setSpeechResult({ prediction: 0, error: "No sound recorded." });
          return;
        }

        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType,
        });
        setAudioUrl(URL.createObjectURL(blob));

        const formData = new FormData();
        formData.append("file", blob, "reading.webm"); // ✅ FastAPI expects "file"

        try {
          const res = await fetch("http://127.0.0.1:8000/speech/result", {
            method: "POST",
            body: formData,
          });

          let data = await res.json();

          // 🔥 Frontend fix: ensure numpy values become plain JS
          const safeData = JSON.parse(JSON.stringify(data));

          setSpeechResult(safeData);
        } catch (e) {
          setSpeechResult({
            prediction: 0,
            error: `Speech API not reachable: ${e.message}`,
          });
        }
      };

      // 7. Start recording
      recorder.start();

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 10000);
    } catch (err) {
      console.error("❌ Microphone access error:", err);
      setRecordingSpeech(false);
      alert(
        `Microphone error: ${
          err.name || err.message
        }\n👉 Allow mic access in browser (Site Settings → Microphone → Allow).`
      );
    }
  };

  // ------------------- Combined Result (UNCHANGED LOGIC) --------------------
  const getCombinedResult = async (eyeData) => {
    const eye = eyeData || eyeResult || (await sendEyeData());

    if (!speechResult || speechResult.error) {
      if (
        !combinedResult ||
        combinedResult.error !== "Please record speech first."
      ) {
        setCombinedResult({ error: "Please record speech first." });
      }
      return;
    }

    if (eye.error) {
      if (!combinedResult || combinedResult.error !== eye.error) {
        setCombinedResult({ error: eye.error });
      }
      return;
    }

    const eyeScore = eye?.score ?? 0;
    const speechScore = speechResult?.prediction ?? 0;

    try {
      const res = await fetch("http://127.0.0.1:8000/combined-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eye_score: eyeScore,
          speech_score: speechScore,
        }),
      });
      const data = await res.json();
      setCombinedResult(data);
    } catch (e) {
      setCombinedResult({ error: `Combined API not reachable: ${e.message}` });
    }
  };

  // ------------------- Auto trigger combined result (UNCHANGED) --------------------
  useEffect(() => {
    if (speechResult && !speechResult.error) {
      getCombinedResult();
    }
  }, [speechResult, eyeResult]);

  // ------------------- JSX (UNCHANGED) --------------------
  return (
    <div className="flex flex-col">
      <div
        style={{
          backgroundColor: "#e3f2fd",
          backgroundImage: `
            repeating-linear-gradient(to right,#bbdefb,#bbdefb 1px,transparent 1px,transparent 100%),
            repeating-linear-gradient(to bottom,#bbdefb,#bbdefb 1px,transparent 1px,transparent 32px)
          `,
          backgroundSize: "32px 32px",
        }}
        className="playbook-bg min-h-screen p-6 font-sans pt-[30px] gap-4 dark:bg-zinc-800 flex flex-col justify-center items-center"
      >
        <div
          className="w-full max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative min-h-fit lg:min-h-[30vh]"
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
                <a
                  className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-blue-100 text-blue-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-blue-200 transition"
                  href="/"
                >
                  Home
                </a>
                <a
                  className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-yellow-100 text-yellow-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-yellow-200 transition"
                  href="/handwriting"
                >
                  Playbook2
                </a>
                <a
                  className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-green-100 text-green-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-green-200 transition"
                  href="/sol"
                >
                  Enhancer
                </a>
                <a
                  className="overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%,0%_85%)] bg-red-100 text-red-800 px-4 py-2 text-lg font-bold rounded-t-lg hover:bg-red-200 transition"
                  href="/quiz"
                >
                  QuirkQuest
                </a>
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
                  muted
                  className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-300 dark:text-gray-400 object-cover"
                >
                  <p>CAMERA FEED</p>
                </video>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={startEyeTracking}
                    disabled={isEyeTrackerRunning}
                    className={` transition-all hover:shadow-2xl ${
                      isEyeTrackerRunning
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-700 hover:bg-blue-800 "
                    } text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 justify-center`}
                  >
                    <span className="material-symbols-outlined">
                      play_circle
                    </span>
                    {isEyeTrackerRunning ? "Running..." : "Start Game"}
                  </button>
                  <button
                    onClick={stopEyeTracking}
                    disabled={!isEyeTrackerRunning}
                    className="  transition-all hover:shadow-2xl bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 flex items-center gap-2 justify-center"
                  >
                    <span className="material-symbols-outlined">
                      stop_circle
                    </span>
                    Stop Game
                  </button>
                  <button
                    onClick={sendEyeData}
                    disabled={gazePoints.length === 0 || isEyeTrackerRunning}
                    className={`  transition-all hover:shadow-2xl ${
                      gazePoints.length === 0 || isEyeTrackerRunning
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 justify-center`}
                  >
                    <span className=" material-symbols-outlined">
                      analytics
                    </span>
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
                  <span className="material-symbols-outlined text-3xl">
                    mic
                  </span>
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
                  className={`transition-all hover:shadow-xl text-white text-xl px-6 py-3 rounded-xl shadow-lg cursor-pointer ${
                    recordingSpeech
                      ? "bg-red-500 "
                      : "bg-yellow-500 hover:bg-yellow-600 "
                  } flex items-center gap-2 justify-center`}
                >
                  <span className="material-symbols-outlined">
                    {recordingSpeech ? "mic_off" : "mic"}
                  </span>
                  {recordingSpeech ? "Recording..." : "Start Reading (10s)"}
                </button>

                <p className="text-sm text-gray-500 mt-2">
                  Recording automatically stops after 10 seconds.
                </p>
                {audioUrl && (
                  <div className="mt-4 p-3 bg-white rounded-lg shadow-inner">
                    <p className="text-gray-600 text-sm mb-2">
                      Recorded Audio:
                    </p>
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
                <span className="material-symbols-outlined text-4xl">
                  check_circle
                </span>
                Your Progress & Results
              </h2>
              <div className="space-y-4 text-lg">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-xl font-bold text-blue-600 mb-1">
                    Eye Gaze Result:
                  </p>
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
                  <h2 className="font-bold text-xl text-yellow-600 mb-1">
                    Speech Result:
                  </h2>
                  <span className="font-semibold text-2xl text-gray-800">
                    {speechResult?.error ? (
                      <span className="text-red-500">{speechResult.error}</span>
                    ) : speechResult?.prediction !== undefined ? (
                      speechResult.prediction > 0 ? (
                        <span className="text-yellow-700">
                          🧠 Dyslexic ({speechResult.prediction.toFixed(2)})
                        </span>
                      ) : (
                        <span className="text-green-500">
                          ✔️ Typical ({speechResult.prediction.toFixed(2)})
                        </span>
                      )
                    ) : (
                      "Not recorded/analyzed"
                    )}
                  </span>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <strong className="font-bold text-xl text-green-700 mb-1">
                    Combined Score:
                  </strong>
                  <span className="font-semibold text-2xl text-gray-800 block mt-1">
                    {combinedResult?.error ? (
                      <span className="text-red-500">
                        {combinedResult.error}
                      </span>
                    ) : combinedResult?.combined !== undefined ? (
                      <>
                        <span className="text-purple-600">
                          {combinedResult.combined.toFixed(2)}
                        </span>
                        <span className="block mt-2 text-xl">
                          {combinedResult.label}
                        </span>
                      </>
                    ) : (
                      "Awaiting both results..."
                    )}
                  </span>
                </div>
                <button
                  onClick={() => getCombinedResult()}
                  disabled={!eyeResult || !speechResult}
                  className={`transition-all hover:shadow-2xl mt-2 px-6 py-3 rounded-xl shadow-lg transition-transform transform translate-x-4 flex items-center gap-2 justify-center text-xl font-bold ${
                    !eyeResult || !speechResult
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-700 hover:bg-green-800 "
                  } text-white`}
                >
                  <span className="material-symbols-outlined">
                    model_training
                  </span>
                  Recalculate Combined Result
                </button>
              </div>
              <a
                href="/handwriting"
                className="ml-5 bg-green-600 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Playbook2
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeSpeech;
