import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Financial Journey",
  description: "Starting from scratch, learning step by step - A comprehensive financial education platform",
  keywords: "financial education, budgeting, savings, expense tracking, financial literacy",
  authors: [{ name: "Financial Journey Team" }],
  openGraph: {
    title: "My Financial Journey",
    description: "Starting from scratch, learning step by step",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Navigation />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
