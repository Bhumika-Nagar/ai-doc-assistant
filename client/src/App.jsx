import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import FilePanel from "./components/FilePanel";
import SummaryCard from "./components/SummaryCard";
import ChatInterface from "./components/ChatInterface";
import { getDocuments } from "./utils/api";

export default function App() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Load document list on first render
  useEffect(() => {
    getDocuments()
      .then((res) => {
        setDocs(res.data);
        if (res.data.length > 0) setSelectedDoc(res.data[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Nav */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Brain size={16} className="text-indigo-400" />
        </div>
        <h1 className="text-base font-semibold gradient-text">DocMind</h1>
        <span className="text-gray-700 text-sm ml-1">AI Document Assistant</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-700 bg-gray-800 px-2 py-1 rounded-md">
            Gemini · LangChain
          </span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Left Panel */}
        <div className="w-64 shrink-0 border-r border-gray-800 p-4 overflow-y-auto">
          <FilePanel
            docs={docs}
            setDocs={setDocs}
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedDoc ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center">
                <Brain size={28} className="text-indigo-400/60" />
              </div>
              <div>
                <p className="text-gray-400 font-medium">No document selected</p>
                <p className="text-sm text-gray-600 mt-1">
                  Upload a .txt or .pdf file to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-5 h-full">
              {/* Document title */}
              <div>
                <h2 className="text-lg font-semibold text-gray-100 truncate">
                  {selectedDoc.filename}
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  {selectedDoc.fileType?.toUpperCase()} · Uploaded{" "}
                  {new Date(selectedDoc.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Summary Card */}
              <SummaryCard key={selectedDoc._id} doc={selectedDoc} />

              {/* Chat — takes remaining height */}
              <div className="flex flex-col flex-1 min-h-[400px]">
                <ChatInterface key={selectedDoc._id} doc={selectedDoc} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
