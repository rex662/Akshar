const Test = require("../models/tests");
const User = require("../models/user");

// -------------------- Controller: Save Test Results --------------------
const saveTestResults = async (req, res) => {
  const { user, guestId, testType, data, eyeResult, speechResult, combinedResult } = req.body;

  try {
    let testEntry;

    // -------------------- Identify user or guest --------------------
    if (user) {
      // Logged-in user mode
      testEntry = new Test({ user, isGuest: false });
    } else if (guestId) {
      // Guest mode
      testEntry = new Test({ guestId, isGuest: true });
    } else {
      return res.status(400).json({ error: "User or guestId required" });
    }

    // -------------------- Handle Eye + Speech Results --------------------
    if (testType === "eyeSpeech") {
      testEntry.eyeTracking = eyeResult || {};
      testEntry.speechAnalysis = speechResult || {};
      testEntry.overallRisk = combinedResult?.label || "Pending";
    }

    // -------------------- Handle Handwriting Results --------------------
    if (testType === "handwriting" && data) {
      testEntry.handwriting = {
        expectedSentence: data.expected || "",
        ocrOutput: data.ocr_output || "",
        charErrorRate: data.char_error_rate || 0,
        wordErrorRate: data.word_error_rate || 0,
        substitutions: data.substitutions || 0,
        insertions: data.insertions || 0,
        deletions: data.deletions || 0,
        reversedLetters: data.reversed_letters || 0,
        dysgraphiaRisk: data.dysgraphia_risk || "Unknown",
        comments: data.comments || "",
      };
    }

    // -------------------- Handle Quiz Results --------------------
    if (testType === "quiz" && data) {
      testEntry.quiz = {
        score: data.score || 0,
        totalQuestions: data.totalQuestions || 0,
        answers: data.answers || [],
      };
      // Optionally update overallRisk based on quiz
      testEntry.overallRisk = data.overallRisk || testEntry.overallRisk;
    }

    // -------------------- Save Test Entry --------------------
    await testEntry.save();
    console.log("Saved Test:", testEntry);

    res.json({ message: "Test results saved successfully", testEntry });
  } catch (err) {
    console.error("Save Test Results error:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Controller: Get Tests by User or Guest --------------------
const getTestsByUser = async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    if (!userId && !guestId)
      return res.status(400).json({ error: "userId or guestId query param required" });

    const query = userId ? { user: userId } : { guestId };
    const tests = await Test.find(query).sort({ createdAt: -1 });

    res.json({ tests });
  } catch (err) {
    console.error("Get Tests error:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Exports --------------------
module.exports = { saveTestResults, getTestsByUser };
