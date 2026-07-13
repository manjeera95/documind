import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/documents/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);

      // Clear selected file
      setFile(null);

    } catch (error: any) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.detail || "Upload failed");
      } else {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          📄 Upload Document
        </h1>

        <p className="text-gray-500 mb-6">
          Upload a PDF to chat with it using AI.
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
          className="w-full border rounded-lg p-3"
        />

        {file && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-gray-700">
              <strong>Selected:</strong> {file.name}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-6 w-full py-3 rounded-lg text-white transition ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>

      </div>
    </div>
  );
}