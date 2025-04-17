"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Users, Calendar, DollarSign, Building } from "lucide-react"
import Link from "next/link"
import {  Ngodetails } from "@/components/NgoDetail"

interface DashboardData {
  ngoId: string
  peopleHelped: number
  eventsConducted: number
  fundsUtilized: number
}



export default function AdminDashboard() {
  const [month, setMonth] = useState<string>("all")


  const [data, setData] = useState<DashboardData[]>([]) // Update to array
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate last 12 months for the dropdown
  const getLastMonths = () => {
    const months = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = month.toISOString().slice(0, 7)
      months.push(monthStr)
    }
    return months
  }

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      setError(null)
    
      try {
        const url =
          month === "all"
            ? "http://localhost:5000/api/dashboard-all"
            : `http://localhost:5000/api/dashboard?month=${month}`
    
        const response = await fetch(url)
    
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
    
        const dashboardData = await response.json()
        console.log("Fetched data:", dashboardData)
    
        // Access ngoDetails array from the response
        if (Array.isArray(dashboardData.ngoDetails)) {
          setData(dashboardData.ngoDetails)
        } else {
          throw new Error("Fetched data.ngoDetails is not an array")
        }
    
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setData([]) // Set an empty array to avoid issues with reduce
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [month])
  
  // Check that data is an array before performing reduce
  const totalPeopleHelped = Array.isArray(data) ? data.reduce((sum, ngo) => sum + ngo.peopleHelped, 0) : 0
  const totalEventsConducted = Array.isArray(data) ? data.reduce((sum, ngo) => sum + ngo.eventsConducted, 0) : 0
  const totalFundsUtilized = Array.isArray(data) ? data.reduce((sum, ngo) => sum + ngo.fundsUtilized, 0) : 0
  const totalNGOs = Array.isArray(data) ? data.length : 0
  



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">View aggregated impact data across all NGOs</p>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-auto">
        <Select value={month} onValueChange={setMonth}>
  <SelectTrigger className="w-full md:w-[200px]">
    <SelectValue placeholder="Select month" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Time</SelectItem>
    {getLastMonths().map((m) => (
      <SelectItem key={m} value={m}>
        {new Date(m + "-01").toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total NGOs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total NGOs Reporting</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{data ? formatNumber(totalNGOs) : "0"}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Organizations submitted reports</p>
          </CardContent>
        </Card>

        {/* People Helped Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">People Helped</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{data ? formatNumber(totalPeopleHelped) : "0"}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Total beneficiaries this month</p>
          </CardContent>
        </Card>

        {/* Events Conducted Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events Conducted</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{data ? formatNumber(totalEventsConducted) : "0"}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Programs and workshops organized</p>
          </CardContent>
        </Card>

        {/* Funds Utilized Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Funds Utilized</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>


            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{data ? formatCurrency(totalFundsUtilized) : "₹0"}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Total expenditure this month</p>
          </CardContent>
        </Card>
      </div>
              {/* Conditionally render NGODetail component when data is available */}
  {data && (
    <div className="mt-8">
      {/* <Ngodetail data={data} /> */}
      
    </div>
    
  )}
   {/* Render Table if Data is available */}
   {data.length > 0 && !loading && (
        <Ngodetails data={data} />
      )}
      {/* Empty state */}
      {!loading && data.length === 0 && (
  <div className="mt-8 p-8 text-center border rounded-lg">
    <h3 className="text-lg font-medium mb-2">No data available for this month</h3>
    <p className="text-muted-foreground">
      There are no NGO reports submitted for{" "}
      {month === "all"
        ? "All Time"
        : new Date(month + "-01").toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
      .
    </p>
  </div>
)}
    </div>
  )
}
