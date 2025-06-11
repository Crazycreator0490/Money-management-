import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-sm py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              My Financial Journey
            </h1>
            <p className="text-xl text-gray-600 mt-2">Starting from scratch, learning step by step.</p>
          </Link>
        </div>
        <div className="border-t border-gray-200 mt-6"></div>
      </div>
    </header>
  )
}
