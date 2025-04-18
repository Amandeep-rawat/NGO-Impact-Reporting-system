const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const reportRoutes = require("../routes/reportRoutes")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const allowedOrigins = [
  "http://localhost:3000", // for local dev
  "https://ngo-impact-reporting-system-frontend.vercel.app", // frontend production
]

app.use(
  cors({
    origin: allowedOrigins, // directly pass the array
    credentials: true,
  })
)


app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ngo-reporting")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api", reportRoutes)

// Health check route
app.get("/", (req, res) => {
  res.send("NGO Reporting API is running")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

