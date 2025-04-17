const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema(
  {
    ngoId: {
      type: String,
      required: [true, "NGO ID is required"],
      trim: true,
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    },
    peopleHelped: {
      type: Number,
      required: [true, "Number of people helped is required"],
      min: [0, "People helped must be a positive number"],
    },
    eventsConducted: {
      type: Number,
      required: [true, "Number of events conducted is required"],
      min: [0, "Events conducted must be a positive number"],
    },
    fundsUtilized: {
      type: Number,
      required: [true, "Funds utilized is required"],
      min: [0, "Funds utilized must be a positive number"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate reports for the same NGO and month
reportSchema.index({ ngoId: 1, month: 1 }, { unique: true })

const Report = mongoose.model("Report", reportSchema)

module.exports = Report
