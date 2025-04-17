"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white p-4 shadow-md transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        {/* Branding */}
        <Link href="/" className="text-2xl font-bold">
          NGO Impact
        </Link>

        {/* Theme toggle on right */}
        <ModeToggle />
      </div>
    </nav>
  )
}
