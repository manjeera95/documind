import { useState } from "react";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Upload Document
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="w-full border rounded-lg p-3"
        />

        {file && (
          <p className="mt-4 text-gray-600">
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <button
          onClick={handleUpload}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </div>
    </div>
  );
}