import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NGO Impact Reporting System",
  description: "Track and report the impact of NGO work across India",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.png" type="image/png" />

      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4">
              {children}
              </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
