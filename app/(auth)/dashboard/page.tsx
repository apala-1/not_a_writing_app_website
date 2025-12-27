export default function DashboardPage() {
  return (
    <>
      <h2 className="text-4xl font-extrabold mb-6">Welcome back ✍️</h2>
      <p className="text-lg text-gray-700 mb-12">
        Start writing, share your thoughts, or continue your stories. Your words matter.
      </p>

      {/* Writing Prompt */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-16">
        <h3 className="text-xl font-semibold mb-4 text-orange-600">Start a new entry</h3>
        <textarea
          rows={8}
          placeholder="What's on your mind today?"
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
        <button className="mt-6 px-8 py-3 bg-orange-500 text-white rounded-md text-lg hover:bg-orange-600 transition">
          Save Entry
        </button>
      </div>

      {/* Recent Entries Preview */}
      <section>
        <h3 className="text-xl font-semibold mb-6 text-orange-600">Your recent entries</h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="font-bold mb-2">Poem: Winter Light</h4>
            <p className="text-gray-600 text-sm">A short reflection on quiet mornings and golden skies...</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="font-bold mb-2">Story: The Lost Letter</h4>
            <p className="text-gray-600 text-sm">A mysterious envelope arrives with no return address...</p>
          </div>
        </div>
      </section>
    </>
  );
}
