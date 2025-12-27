export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto py-24 px-6">
      <h2 className="text-4xl font-bold mb-6 text-gray-900">About</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        <span className="font-semibold">Not A Writing App</span> was created for writers who want freedom, not pressure.
        We believe writing should feel natural, joyful, and personal — without word counts, algorithms, or the stress of
        productivity metrics. It’s a space to simply write.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">Our Philosophy</h3>
          <p className="text-gray-700 leading-relaxed">
            Writing is more than hitting targets. It’s about expression, discovery, and connection. We designed this app
            to remove distractions and let you focus on your words. Whether you’re journaling, drafting stories, or
            capturing ideas, you’ll find a calm environment that supports your creativity.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">What Makes Us Different</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>No deadlines or streaks — write at your own pace.</li>
            <li>Clean, minimalist design that keeps the focus on your words.</li>
            <li>Privacy first: your writing belongs to you.</li>
            <li>Tools that encourage reflection, not performance.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">Who It’s For</h3>
          <p className="text-gray-700 leading-relaxed">
            This app is for anyone who loves writing — whether you’re a novelist, a student, a professional, or someone
            who just wants to keep a personal journal. If you’ve ever felt overwhelmed by apps that gamify writing, this
            is your safe space to breathe and create.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-3">Our Vision</h3>
          <p className="text-gray-700 leading-relaxed">
            We imagine a world where writing is celebrated for its authenticity, not its metrics. Our vision is to help
            people reconnect with the joy of words, one page at a time.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 italic">
          “Not A Writing App is not about being productive. It’s about being yourself.”
        </p>
      </div>
    </section>
  );
}
