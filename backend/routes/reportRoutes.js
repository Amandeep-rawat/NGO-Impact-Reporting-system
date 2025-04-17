const express = require("express")
const Report = require("../models/Report")
const router = express.Router()

// Submit a new report
router.post("/report", async (req, res) => {
  try {
    const { ngoId, month, peopleHelped, eventsConducted, fundsUtilized } = req.body

    // Check if a report already exists for this NGO and month
    const existingReport = await Report.findOne({ ngoId, month })

    if (existingReport) {
      // Update existing report
      existingReport.peopleHelped = peopleHelped
      existingReport.eventsConducted = eventsConducted
      existingReport.fundsUtilized = fundsUtilized
      await existingReport.save()

      return res.status(200).json({
        success: true,
        message: "Report updated successfully",
        data: existingReport,
      })
    }

    // Create new report
    const newReport = new Report({
      ngoId,
      month,
      peopleHelped,
      eventsConducted,
      fundsUtilized,
    })

    await newReport.save()

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: newReport,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      })
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A report for this NGO and month already exists",
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit report",
      error: error.message,
    })
  }
})

// Get dashboard data for a specific month
// router.get("/dashboard", async (req, res) => {
//   try {
//     const { month } = req.query

//     if (!month || !month.match(/^\d{4}-\d{2}$/)) {
//       return res.status(400).json({
//         success: false,
//         message: "Month parameter is required in YYYY-MM format",
//       })
//     }

//     // Aggregate data for the specified month
//     const aggregatedData = await Report.aggregate([
//       { $match: { month } },
//       {
//         $group: {
//           _id: null,
//           totalNGOs: { $sum: 1 },
//           totalPeopleHelped: { $sum: "$peopleHelped" },
//           totalEventsConducted: { $sum: "$eventsConducted" },
//           totalFundsUtilized: { $sum: "$fundsUtilized" },
//         },
//       },
//     ])

//     // If no data found, return zeros
//     if (aggregatedData.length === 0) {
//       return res.status(200).json({
//         totalNGOs: 0,
//         totalPeopleHelped: 0,
//         totalEventsConducted: 0,
//         totalFundsUtilized: 0,
//       })
//     }

//     // Remove the _id field from the response
//     const { _id, ...dashboardData } = aggregatedData[0]

//     res.status(200).json(dashboardData)
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch dashboard data",
//       error: error.message,
//     })
//   }
// })

router.get("/dashboard", async (req, res) => {
  try {
    const { month } = req.query

    if (!month || !month.match(/^\d{4}-\d{2}$/)) {
      return res.status(400).json({
        success: false,
        message: "Month parameter is required in YYYY-MM format",
      })
    }

    // 1. Aggregated totals
    const aggregatedData = await Report.aggregate([
      { $match: { month } },
      {
        $group: {
          _id: null,
          totalNGOs: { $sum: 1 },
          totalPeopleHelped: { $sum: "$peopleHelped" },
          totalEventsConducted: { $sum: "$eventsConducted" },
          totalFundsUtilized: { $sum: "$fundsUtilized" },
        },
      },
    ])

    const summary =
      aggregatedData.length > 0
        ? (({ _id, ...rest }) => rest)(aggregatedData[0])
        : {
            totalNGOs: 0,
            totalPeopleHelped: 0,
            totalEventsConducted: 0,
            totalFundsUtilized: 0,
          }

    // 2. NGO-wise breakdown
    const ngoDetails = await Report.aggregate([
      { $match: { month } },
      {
        $group: {
          _id: "$ngoId",
          peopleHelped: { $sum: "$peopleHelped" },
          eventsConducted: { $sum: "$eventsConducted" },
          fundsUtilized: { $sum: "$fundsUtilized" },
        },
      },
      {
        $project: {
          _id: 0,
          ngoId: "$_id",
          peopleHelped: 1,
          eventsConducted: 1,
          fundsUtilized: 1,
        },
      },
    ])

    return res.status(200).json({
      success: true,
      summary,
      ngoDetails,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    })
  }
})


// Get dashboard data for all time
// router.get("/dashboard-all", async (req, res) => {
//   try {
//     // Aggregate all-time data (no month filter)
//     const aggregatedData = await Report.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalNGOs: { $addToSet: "$ngoId" }, // Unique NGOs
//           totalPeopleHelped: { $sum: "$peopleHelped" },
//           totalEventsConducted: { $sum: "$eventsConducted" },
//           totalFundsUtilized: { $sum: "$fundsUtilized" },
//         },
//       },
//       {
//         $project: {
//           totalNGOs: { $size: "$totalNGOs" }, // Count of unique NGOs
//           totalPeopleHelped: 1,
//           totalEventsConducted: 1,
//           totalFundsUtilized: 1,
//         },
//       },
//     ])

//     // If no data found, return zeros
//     if (aggregatedData.length === 0) {
//       return res.status(200).json({
//         totalNGOs: 0,
//         totalPeopleHelped: 0,
//         totalEventsConducted: 0,
//         totalFundsUtilized: 0,
//       })
//     }

//     res.status(200).json(aggregatedData[0])
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch all-time dashboard data",
//       error: error.message,
//     })
//   }
// })
router.get("/dashboard-all", async (req, res) => {
  try {
    // 1. All-time summary
    const aggregatedData = await Report.aggregate([
      {
        $group: {
          _id: null,
          totalNGOs: { $addToSet: "$ngoId" },
          totalPeopleHelped: { $sum: "$peopleHelped" },
          totalEventsConducted: { $sum: "$eventsConducted" },
          totalFundsUtilized: { $sum: "$fundsUtilized" },
        },
      },
      {
        $project: {
          totalNGOs: { $size: "$totalNGOs" },
          totalPeopleHelped: 1,
          totalEventsConducted: 1,
          totalFundsUtilized: 1,
        },
      },
    ])

    const summary =
      aggregatedData.length > 0
        ? aggregatedData[0]
        : {
            totalNGOs: 0,
            totalPeopleHelped: 0,
            totalEventsConducted: 0,
            totalFundsUtilized: 0,
          }

    // 2. NGO-wise breakdown
    const ngoDetails = await Report.aggregate([
      {
        $group: {
          _id: "$ngoId",
          peopleHelped: { $sum: "$peopleHelped" },
          eventsConducted: { $sum: "$eventsConducted" },
          fundsUtilized: { $sum: "$fundsUtilized" },
        },
      },
      {
        $project: {
          _id: 0,
          ngoId: "$_id",
          peopleHelped: 1,
          eventsConducted: 1,
          fundsUtilized: 1,
        },
      },
    ])

    return res.status(200).json({
      success: true,
      summary,
      ngoDetails,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all-time dashboard data",
      error: error.message,
    })
  }
})



module.exports = router
