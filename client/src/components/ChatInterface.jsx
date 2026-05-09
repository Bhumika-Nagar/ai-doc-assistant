import { useState, useEffect, useRef } from "react";
import { Send, Loader2, MessageSquare, Bot, User } from "lucide-react";
import { askQuestion, getChatHistory } from "../utils/api";

export default function ChatInterface({ doc }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef();

  // Load existing chat history when doc changes
  useEffect(() => {
    if (!doc?._id) return;
    setMessages([]);
    setHistoryLoading(true);
    getChatHistory(doc._id)
      .then((res) => setMessages(res.data))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [doc?._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    // Optimistically add user message to UI
    setMessages((prev) => [...prev, { question, answer: null, _id: Date.now() }]);
    setLoading(true);

    try {
      const res = await askQuestion(doc._id, question);
      // Replace the optimistic entry with the real response
      setMessages((prev) =>
        prev.map((m) =>
          m.answer === null ? { ...m, answer: res.data.answer } : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.answer === null
            ? { ...m, answer: "⚠️ " + (err.response?.data?.error || "Something went wrong.") }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#1a1d27] overflow-hidden flex-1">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-800">
        <MessageSquare size={14} className="text-blue-400" />
        <span className="text-sm font-semibold text-gray-200">Ask Questions</span>
        <span className="ml-auto text-[10px] text-gray-600 font-mono">
          {messages.length} messages
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
        {historyLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 size={12} className="spinner" /> Loading history…
          </div>
        )}

        {!historyLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <Bot size={18} className="text-indigo-400" />
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Ask anything about <span className="text-gray-400">{doc.filename}</span>. The AI will answer based on the document content.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={msg._id || i} className="space-y-3 fade-up">
            {/* User question */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                <p className="text-sm text-gray-200">{msg.question}</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} className="text-indigo-400" />
              </div>
            </div>

            {/* AI answer */}
            {msg.answer === null ? (
              <div className="flex items-center gap-2 pl-10 text-sm text-gray-500">
                <Loader2 size={12} className="spinner" />
                Thinking…
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={12} className="text-violet-400" />
                </div>
                <div className="bg-white/5 border border-gray-700/50 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-gray-300 leading-relaxed">{msg.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-2 bg-white/5 border border-gray-700 rounded-xl px-4 py-2.5 focus-within:border-indigo-500/50 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document…"
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send size={12} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-gray-700 mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
