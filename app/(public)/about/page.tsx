export default function AboutPage() {
  return (
    <section className="relative bg-gradient-to-b from-orange-50 to-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">About Us</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-12 max-w-2xl mx-auto">
          <span className="font-semibold">Not A Writing App</span> is a calm space for words. 
          No streaks, no pressure — just authentic writing, at your own pace.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 text-left">
        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">Our Philosophy</h3>
          <p className="text-gray-700 leading-relaxed">
            Writing is more than hitting targets. It’s about expression, discovery, and connection. 
            We designed this app to remove distractions and let you focus on your words. 
            Whether you’re journaling, drafting stories, or capturing ideas, you’ll find a calm environment 
            that supports your creativity.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">What Makes Us Different</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>No deadlines or streaks — write at your own pace.</li>
            <li>Minimalist design that keeps the focus on your words.</li>
            <li>Privacy first: your writing belongs to you.</li>
            <li>Tools that encourage reflection, not performance.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">Who It’s For</h3>
          <p className="text-gray-700 leading-relaxed">
            This app is for anyone who loves writing — whether you’re a novelist, a student, 
            a professional, or someone who just wants to keep a personal journal. 
            If you’ve ever felt overwhelmed by apps that gamify writing, this is your safe space to breathe and create.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">Our Vision</h3>
          <p className="text-gray-700 leading-relaxed">
            We imagine a world where writing is celebrated for its authenticity, not its metrics. 
            Our vision is to help people reconnect with the joy of words, one page at a time.
          </p>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-16 text-center">
        <p className="text-xl text-gray-800 italic">
          “Not A Writing App is not about being productive. It’s about being yourself.”
        </p>
      </div>

      {/* Call to action */}
      <div className="mt-20 text-center">
        <a
          href="/register"
          className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-orange-600 transition"
        >
          Start Writing Today
        </a>
      </div>
    </section>
  );
}
