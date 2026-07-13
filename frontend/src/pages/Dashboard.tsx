import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Document {
  id: number;
  filename: string;
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/documents/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard Documents:", response.data);

      setDocuments(response.data);
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        alert(
          `Status: ${error.response.status}\n${JSON.stringify(
            error.response.data,
            null,
            2
          )}`
        );
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        DocuMind Dashboard
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">📄 Total Documents</h2>

          <p className="text-5xl font-bold text-blue-600 mt-4">
            {loading ? "..." : documents.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">📑 Latest Upload</h2>

          <p className="text-lg mt-4">
            {loading
              ? "Loading..."
              : documents.length > 0
              ? documents[0].filename
              : "No documents uploaded"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/upload"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold">📄 Upload Documents</h2>
          <p className="text-gray-600 mt-2">
            Upload PDFs for AI processing.
          </p>
        </Link>

        <Link
          to="/documents"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold">📚 My Documents</h2>
          <p className="text-gray-600 mt-2">
            View uploaded documents.
          </p>
        </Link>

        <Link
          to="/chat"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold">💬 AI Chat</h2>
          <p className="text-gray-600 mt-2">
            Chat with your documents.
          </p>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">🔍 Semantic Search</h2>
          <p className="text-gray-600 mt-2">
            Search across your documents.
          </p>
        </div>
      </div>
    </div>
  );
}