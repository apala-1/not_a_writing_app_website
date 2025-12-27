import '../globals.css';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-32 px-6">
        <h1 className="text-6xl font-extrabold mb-8 text-gray-800 tracking-tight">
          Write. Share. Collect.
        </h1>

        <p className="max-w-2xl text-xl text-gray-600 mb-12 leading-relaxed">
          Not A Writing App is a calm space to share poems, short stories,
          and thoughts — and turn them into books when you're ready.
        </p>

        <div className="flex flex-wrap gap-6 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300"
          >
            Start Writing
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">✍️ Write Freely</h3>
          <p className="text-gray-600">Capture poems, short stories, or daily thoughts in a distraction-free space.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">📚 Collect & Organize</h3>
          <p className="text-gray-600">Turn your writing into collections or even books when you’re ready.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">🌍 Share with Others</h3>
          <p className="text-gray-600">Publish your work or keep it private — you’re in control of your words.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-orange-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to begin your journey?</h2>
        <Link
          href="/register"
          className="px-10 py-4 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-gray-600">
          <p>© {new Date().getFullYear()} Not A Writing App. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-orange-600">About</Link>
            <Link href="/contact" className="hover:text-orange-600">Contact</Link>
            <Link href="/privacy" className="hover:text-orange-600">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
