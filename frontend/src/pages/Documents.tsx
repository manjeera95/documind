import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

interface Document {
  id: number;
  filename: string;
}

export default function Documents() {
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

      setDocuments(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: number, filename: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Document deleted successfully!");

      fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete document.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        📚 My Documents
      </h1>

      <p className="text-gray-500 mb-8">
        Manage your uploaded PDF documents.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading documents...</p>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">
            No documents uploaded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  📄 {doc.filename}
                </h2>
              </div>

              <button
                onClick={() => deleteDocument(doc.id, doc.filename)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}