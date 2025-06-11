import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth"
import { runMigrations } from "@/lib/db-init"

export async function POST() {
  try {
    // Ensure database is ready
    await runMigrations()

    const email = "jinuthomas6985@gmail.com"
    const password = "Antonyoyo"
    const name = "Jinu Thomas"

    try {
      // Try to create the user
      const user = await createUser(name, email, password)

      return NextResponse.json({
        success: true,
        message: "User added successfully",
        user: {
          email: user.email,
          name: user.name,
        },
      })
    } catch (error) {
      // If user already exists, that's okay
      if (error instanceof Error && error.message === "User already exists") {
        return NextResponse.json({
          success: true,
          message: "User already exists",
        })
      }

      throw error
    }
  } catch (error) {
    console.error("Error adding user:", error)
    return NextResponse.json(
      {
        error: "Failed to add user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
