import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

interface Document {
  id: number;
  filename: string;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: {
    document_id: number;
    chunk_index: number;
    score: number;
  }[];
}

export default function Chat() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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

      if (response.data.length > 0) {
        setSelectedDocument(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load documents.");
    }
  };

  const askQuestion = async () => {
    if (!selectedDocument || !question.trim()) {
      toast.error("Select a document and enter a question.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/chat",
        {
          document_ids: [selectedDocument],
          question,
          session_id: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: question,
        },
        {
          role: "assistant",
          text: response.data.answer,
          sources: response.data.sources,
        },
      ]);

      setQuestion("");
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.detail || "Something went wrong.");
      } else {
        toast.error("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            🤖 AI Assistant
          </h1>

          <p className="text-gray-500 mt-2">
            Ask questions about your uploaded documents.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <label className="block mb-2 font-semibold">
            Select Document
          </label>

          <select
            value={selectedDocument ?? ""}
            onChange={(e) => setSelectedDocument(Number(e.target.value))}
            className="w-full border rounded-lg p-3 mb-5"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.filename}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Ask something about your document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border rounded-lg p-3 h-32"
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            className={`mt-5 px-6 py-3 rounded-lg text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "🤖 Thinking..." : "Ask AI"}
          </button>

          <div className="mt-10 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-2xl p-5 shadow ${
                  message.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex justify-between items-start gap-4">

                  <div className="flex-1">
                    <h3 className="font-bold mb-2">
                      {message.role === "user" ? "You" : "AI"}
                    </h3>

                    <p className="leading-7 whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>

                  {message.role === "assistant" && (
                    <button
                      onClick={() => copyMessage(message.text)}
                      className="text-sm bg-white text-gray-700 border px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                    >
                      📋 Copy
                    </button>
                  )}

                </div>

                {message.role === "assistant" &&
                  message.sources &&
                  message.sources.length > 0 && (
                    <div className="mt-4 border-t pt-3">
                      <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                        Sources
                      </h4>

                      {message.sources.map((source, i) => (
                        <div
                          key={i}
                          className="text-sm text-gray-600"
                        >
                          📄 Document {source.document_id} • Chunk{" "}
                          {source.chunk_index} • Score{" "}
                          {source.score.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}