"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"


export default function Home() {
  return (
    <div className="container mx-auto py-10">
     
    

      <motion.h1
        className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        NGO Impact Reporting System
      </motion.h1>

      <motion.p
        className="text-lg mb-8 text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        A platform for NGOs to submit monthly reports and track their impact, as well as view aggregated data and insights.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Submit Monthly Report Card */}
        <motion.div
          className="shadow-md hover:shadow-lg transition-shadow"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Submit Monthly Report</CardTitle>
              <CardDescription>For NGOs to submit their monthly impact data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Submit details about people helped, events conducted, and funds utilized for the month.
              </p>
              <Link href="/submit-report" passHref>
                <Button className="w-full">Go to Report Form</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Dashboard Card */}
        <motion.div
          className="shadow-md hover:shadow-lg transition-shadow"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>View aggregated impact data across all NGOs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access total numbers and statistics for all reporting NGOs by month.</p>
              <Link href="/admin-dashboard" passHref>
                <Button className="w-full bg-green-500" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Notification Box */}
      <div className="mt-8 p-4 bg-yellow-200 text-yellow-800 rounded-lg shadow-md text-center">
        <p className="font-semibold">Note:</p>
        <p>Currently, the Admin Dashboard will be visible to all users for testing purposes.</p>
      </div>
    </div>
  )
}
