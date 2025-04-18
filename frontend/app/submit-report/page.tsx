"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Form schema with validation
const formSchema = z.object({
  ngoId: z.string().min(1, { message: "NGO ID is required" }),
  month: z.string().regex(/^\d{4}-\d{2}$/, { message: "Month must be in YYYY-MM format" }),
  peopleHelped: z.coerce.number().int().positive({ message: "Must be a positive number" }),
  eventsConducted: z.coerce.number().int().positive({ message: "Must be a positive number" }),
  fundsUtilized: z.coerce.number().positive({ message: "Must be a positive number" }),
})

export default function SubmitReport() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Current month in YYYY-MM format for default value
  const currentMonth = new Date().toISOString().slice(0, 7)

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ngoId: "",
      month: currentMonth,
      peopleHelped: undefined,
      eventsConducted: undefined,
      fundsUtilized: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${ process.env.NEXT_PUBLIC_API_URL}/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit report")
      }

      toast({
        title: "Report Submitted Successfully",
        description: "Your monthly impact report has been recorded.",
      })

      // Reset form after successful submission
      form.reset({
        ngoId: "",
        month: currentMonth,
        peopleHelped: undefined,
        eventsConducted: undefined,
        fundsUtilized: undefined,
      })

      // Redirect to home after a short delay
      setTimeout(() => router.push("/"), 2000)
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Submit Monthly Report</CardTitle>
          <CardDescription>Enter your NGO's impact data for the month</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ngoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NGO ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your NGO ID" {...field} />
                    </FormControl>
                    <FormDescription>Your unique organization identifier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporting Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getLastMonths().map((month) => (
                          <SelectItem key={month} value={month}>
                            {new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>The month for which you're reporting impact</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="peopleHelped"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>People Helped</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>Total number of beneficiaries this month</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventsConducted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Events Conducted</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>Number of programs, workshops, or events</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fundsUtilized"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funds Utilized (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Total funds spent this month (in INR)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
