export default function Footer() {
  return (
    <footer className="bg-white shadow-inner py-6 mt-12">
      <div className="container mx-auto px-4 max-w-4xl text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} My Financial Journey. All rights reserved.</p>
      </div>
    </footer>
  )
}
