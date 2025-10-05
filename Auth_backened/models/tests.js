const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional for guest
    guestId: { type: String }, // unique guest identifier
eyeTracking: {
  totalFixations: Number,
  averageFixationDuration: Number,
  regressionCount: Number,
  saccadeAmplitude: Number,
  comments: String,
  dyslexiaRisk: String, 
  riskScore: Number     
},

speechAnalysis: {
  totalWords: Number,
  mispronunciations: Number,
  speechRate: Number,
  pauses: Number,
  clarityScore: Number,
  comments: String,
  dyslexiaRisk: String, 
  riskScore: Number     
}
,

    handwriting: {
      expectedSentence: String,
      ocrOutput: String,
      charErrorRate: Number,
      wordErrorRate: Number,
      substitutions: Number,
      insertions: Number,
      deletions: Number,
      reversedLetters: Number,
      dysgraphiaRisk: String,
      comments: String,
    },

    quiz: {
      score: Number,
      totalQuestions: Number,
      answers: [
        {
          question: String,
          selectedOption: String,
          score: Number,
        },
      ],
    },

    overallRisk: String,
    isGuest: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tests", TestSchema);
