export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        DocuMind Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">📄 Upload Documents</h2>
          <p className="text-gray-600 mt-2">
            Upload PDFs for AI processing.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">📚 My Documents</h2>
          <p className="text-gray-600 mt-2">
            View all uploaded documents.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">💬 AI Chat</h2>
          <p className="text-gray-600 mt-2">
            Chat with your documents using RAG.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">🔍 Semantic Search</h2>
          <p className="text-gray-600 mt-2">
            Search across all your documents.
          </p>
        </div>
      </div>
    </div>
  );
}