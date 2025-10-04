const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/testRoutes");

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/tests", testRoutes);



// Routes
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
