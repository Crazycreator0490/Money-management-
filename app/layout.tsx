import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import ErrorBoundary from "@/components/error-boundary"
import { getCurrentUser } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Financial Journey",
  description: "Starting from scratch, learning step by step.",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null

  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error("Error getting current user:", error)
    // Continue without user - they'll be redirected to login if needed
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header user={user} />
            {user && <Navigation />}
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
