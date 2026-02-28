"use client";

import '../globals.css';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center py-20 md:py-32 px-6">
        {/* Floating badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-gray-700">Join 10,000+ writers today</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 tracking-tight leading-tight max-w-5xl">
          Write. Share.{" "}
          <span className="bg-gradient-to-r from-orange-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
            Collect.
          </span>
        </h1>

        <p className="max-w-3xl text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
          Not A Writing App is a calm space to share poems, short stories,
          and thoughts — and turn them into books when you're ready.
        </p>

        <div className="flex flex-wrap gap-4 md:gap-6 justify-center mb-16">
          <Link
            href="/register"
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white rounded-xl shadow-lg font-bold hover:shadow-xl hover:scale-[1.05] transition-all duration-200 flex items-center gap-2 relative overflow-hidden"
          >
            <span className="relative z-10">Start Writing Free</span>
            <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-bold hover:border-orange-400 hover:text-orange-600 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </Link>
        </div>

        {/* Hero Image/Illustration Placeholder */}
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] transform hover:scale-105 transition-transform duration-200">
                <svg className="w-16 h-16 text-orange-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="font-semibold text-gray-800">Clean Editor</p>
              </div>

              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] transform hover:scale-105 transition-transform duration-200">
                <svg className="w-16 h-16 text-amber-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="font-semibold text-gray-800">Collections</p>
              </div>

              <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] transform hover:scale-105 transition-transform duration-200">
                <svg className="w-16 h-16 text-rose-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <p className="font-semibold text-gray-800">Share Easily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              write freely
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A distraction-free writing experience designed for poets, storytellers, and thinkers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">✍️ Write Freely</h3>
            <p className="text-gray-600 leading-relaxed">
              Capture poems, short stories, or daily thoughts in a distraction-free space designed for creativity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">📚 Collect & Organize</h3>
            <p className="text-gray-600 leading-relaxed">
              Turn your writing into beautiful collections or even publish them as books when you're ready.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">🌍 Share with Others</h3>
            <p className="text-gray-600 leading-relaxed">
              Publish your work publicly or keep it private — you're in complete control of your words.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">🎨 Customize</h3>
            <p className="text-gray-600 leading-relaxed">
              Personalize your writing space with themes, fonts, and layouts that inspire your creativity.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">🔒 Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">
              Your work is yours. We encrypt everything and never share your data with third parties.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">⚡ Fast & Simple</h3>
            <p className="text-gray-600 leading-relaxed">
              No clutter, no complexity. Just open and start writing. Your words deserve better tools.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              writers everywhere
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our community of poets, authors, and thinkers have to say.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "This is the writing app I didn't know I needed. Clean, simple, and beautiful. I've written more in the last month than in the past year."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                SM
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sarah Mitchell</p>
                <p className="text-sm text-gray-600">Poet & Author</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "Finally, a platform that respects my creativity. No ads, no distractions. Just me and my words."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold">
                JC
              </div>
              <div>
                <p className="font-semibold text-gray-900">James Chen</p>
                <p className="text-sm text-gray-600">Short Story Writer</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "I've published three collections using this platform. The export features are incredible and the community is so supportive."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                ER
              </div>
              <div>
                <p className="font-semibold text-gray-900">Emma Rodriguez</p>
                <p className="text-sm text-gray-600">Novelist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 text-center py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 rounded-3xl shadow-2xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/50 to-rose-600/50"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
                Ready to begin your journey?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of writers who have found their creative home. Start writing for free today.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/register"
                  className="group px-10 py-4 bg-white text-orange-600 rounded-xl shadow-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link
                  href="/login"
                  className="px-10 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>

              <p className="text-white/80 text-sm mt-6">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
