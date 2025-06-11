import Link from "next/link"
import { LogOut, UserIcon } from "lucide-react"
import type { User } from "@/lib/auth-system"

type HeaderProps = {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center">
          <div className="text-center flex-grow">
            <Link href="/">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                My Financial Journey
              </h1>
              <p className="text-xl text-gray-600 mt-2">Starting from scratch, learning step by step.</p>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon size={16} />
                <span>Welcome, {user.name}</span>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 mt-6"></div>
      </div>
    </header>
  )
}
