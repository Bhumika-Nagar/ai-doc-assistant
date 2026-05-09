import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { summarizeDoc } from "../utils/api";

export default function SummaryCard({ doc }) {
  const [summary, setSummary] = useState(doc.summary || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await summarizeDoc(doc._id);
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#1a1d27] overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm font-semibold text-gray-200">AI Summary</span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-400 transition-colors disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={12} className="spinner" />
          ) : (
            <RefreshCw size={12} />
          )}
          {summary ? "Regenerate" : "Generate"}
        </button>
      </div>

      {/* Card body */}
      <div className="px-5 py-4">
        {error && <p className="text-sm text-red-400">{error}</p>}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={14} className="spinner" />
            Generating summary with Gemini…
          </div>
        )}

        {!loading && !summary && !error && (
          <p className="text-sm text-gray-600">
            Click <span className="text-gray-500">Generate</span> to create an AI summary of this document.
          </p>
        )}

        {!loading && summary && (
          <p className="text-sm text-gray-300 leading-relaxed fade-up">{summary}</p>
        )}
      </div>
    </div>
  );
}
