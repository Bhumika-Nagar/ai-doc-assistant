import { useState, useRef } from "react";
import { FileText, Upload, File, Loader2 } from "lucide-react";
import { uploadFile, getDocuments } from "../utils/api";

export default function FilePanel({ docs, setDocs, selectedDoc, setSelectedDoc }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      await uploadFile(file);
      const res = await getDocuments();
      setDocs(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <FileText size={14} className="text-indigo-400" />
        </div>
        <span className="text-sm font-semibold text-gray-200">Documents</span>
      </div>

      {/* Upload Button */}
      <label className="cursor-pointer">
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.pdf"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        <div
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed text-sm font-medium transition-all
            ${uploading
              ? "border-indigo-500/40 text-indigo-400 bg-indigo-500/5"
              : "border-gray-600 text-gray-400 hover:border-indigo-500/60 hover:text-indigo-400 hover:bg-indigo-500/5"
            }`}
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="spinner" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload File
            </>
          )}
        </div>
      </label>

      {error && (
        <p className="text-xs text-red-400 px-1">{error}</p>
      )}

      {/* File List */}
      <div className="flex flex-col gap-1 overflow-y-auto flex-1">
        {docs.length === 0 && (
          <p className="text-xs text-gray-600 px-1 mt-2">
            No documents yet. Upload a .txt or .pdf to get started.
          </p>
        )}
        {docs.map((doc) => (
          <button
            key={doc._id}
            onClick={() => setSelectedDoc(doc)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group
              ${selectedDoc?._id === doc._id
                ? "bg-indigo-500/15 border border-indigo-500/30"
                : "hover:bg-white/5 border border-transparent"
              }`}
          >
            <div className="flex items-start gap-2">
              <File
                size={13}
                className={`mt-0.5 shrink-0 ${selectedDoc?._id === doc._id ? "text-indigo-400" : "text-gray-500"}`}
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-200 truncate">{doc.filename}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  {doc.fileType?.toUpperCase()} · {formatSize(doc.size)} · {formatDate(doc.createdAt)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-[10px] text-gray-700 px-1">Supports .txt and .pdf · 10MB max</p>
    </aside>
  );
}
