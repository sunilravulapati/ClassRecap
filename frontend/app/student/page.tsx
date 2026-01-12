"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Simple API helper
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const safeApi = {
  get: async (url: string) => {
    const res = await fetch(`${API_BASE}${url}`);
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return { data: await res.json() };
  },
  post: async (url: string, body: any) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    return { data: await res.json() };
  }
};

interface SavedNote {
  id: number;
  content: string;
  note_type: string;
  created_at: string;
}

export default function StudentPage() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [aiNotes, setAiNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<"ai" | "raw">("ai");
  const [isSaving, setIsSaving] = useState(false);
  
  // History state
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedNote, setSelectedNote] = useState<SavedNote | null>(null);

  useEffect(() => {
    fetchSavedNotes();
  }, []);

  const fetchSavedNotes = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await safeApi.get("/student-notes/saved");
      setSavedNotes(res.data.saved_notes || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSave = async () => {
    const textToSave = view === "ai" ? aiNotes : content;
    if (!textToSave.trim()) {
      alert("Nothing to save!");
      return;
    }

    setIsSaving(true);
    try {
      await safeApi.post("/student-notes/save", { 
        content: textToSave,
        note_type: view === "ai" ? "ai_refined" : "raw"
      });
      alert("✅ Note saved successfully!");
      fetchSavedNotes();
    } catch (error) {
      console.error("Save failed:", error);
      alert("❌ Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const generateNotes = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    setAiNotes(""); 
    setView("ai"); 

    try {
      const res = await safeApi.post("/student-notes", { content }); 
      setAiNotes(res.data?.notes || "No notes generated.");
    } catch (err) {
      setAiNotes("❌ Failed to connect to AI service.");
    } finally {
      setIsGenerating(false);
    }
  };

  const submit = async () => {
    if (!content.trim()) return;
    setStatus("loading");
    try {
      await safeApi.post("/upload", { content });
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  const handleCopy = () => {
    const textToCopy = view === "ai" ? aiNotes : content;
    navigator.clipboard.writeText(textToCopy);
    alert("📋 Copied!");
  };

  // ✅ FIXED: Proper implementation to show modal
  const viewNoteDetail = (note: SavedNote) => {
    setSelectedNote(note);
  };

  // ✅ FIXED: Proper implementation to close modal
  const closeNoteDetail = () => {
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Note Refinement</h1>
          <p className="text-gray-600 mt-2">Upload today's learning to refine concepts and generate summaries</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload Today's Learning</h2>
            <span className="text-sm text-gray-500">Draft</span>
          </div>
          
          <textarea
            className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-700 placeholder-gray-400"
            rows={8}
            placeholder="Paste your notes, code snippets, definitions, or key concepts from today's class..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (status === "success") setStatus("idle");
            }}
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
            >
                {isSaving ? "Saving..." : "💾 Save Draft"}
            </button>
            <button
              onClick={submit}
              disabled={status === "loading" || !content.trim()}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold shadow-md transition-all ${
                status === "success" 
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {status === "loading" ? "Uploading..." : status === "success" ? "✓ Notes Uploaded" : "📤 Upload Notes"}
            </button>

            <button
              onClick={generateNotes}
              disabled={status !== "success" || isGenerating}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold border-2 transition-all ${
                status === "success"
                  ? "border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
                  : "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
              }`}
            >
              {isGenerating ? "✨ Refining..." : "✨ Refine with AI"}
            </button>
          </div>

          {status === "error" && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              ✕ Upload failed. Please try again.
            </div>
          )}
        </div>

        {/* AI-Generated Notes Section */}
        {(isGenerating || aiNotes) && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  📘
                </span>
                Note Review
              </h3>

              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setView("ai")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === "ai"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  ✨ AI Refined
                </button>
                <button
                  onClick={() => setView("raw")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === "raw"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  📝 Raw Notes
                </button>
              </div>
            </div>
            
            {isGenerating ? (
              <div className="space-y-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <p className="text-sm text-gray-500 text-center mt-4">AI is analyzing your notes...</p>
              </div>
            ) : (
              <div>
                <div className="relative bg-gray-50 rounded-xl border border-gray-100 p-6 min-h-[200px]">
                  {view === "ai" ? (
                    <article className="prose prose-blue max-w-none 
                      prose-p:my-2 prose-p:leading-relaxed 
                      prose-headings:mt-6 prose-headings:mb-3 prose-headings:font-bold
                      prose-h1:text-2xl prose-h2:text-xl
                      prose-ul:my-2 prose-li:my-0.5 prose-li:text-gray-700
                      text-gray-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiNotes}</ReactMarkdown>
                    </article>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {content}
                    </pre>
                  )}
                  
                  <div className="absolute top-4 right-4 px-2 py-1 bg-white/80 backdrop-blur rounded text-xs font-semibold text-gray-400 border border-gray-200">
                    {view === "ai" ? "AI View" : "Raw View"}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium transition-all"
                  >
                    📋 Copy
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "💾 Save to History"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Notes History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Saved Notes</h2>
          
          {isLoadingHistory ? (
            <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : savedNotes.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No saved notes yet. Start by uploading and refining your notes above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedNotes.map((note) => (
                <div 
                  key={note.id} 
                  onClick={() => viewNoteDetail(note)}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      note.note_type === 'ai_refined' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {note.note_type === 'ai_refined' ? '✨ AI Refined' : '📝 Raw Draft'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(note.created_at).toLocaleDateString()} • {new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 text-sm">
                    {note.content.substring(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
          onClick={closeNoteDetail}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  selectedNote.note_type === 'ai_refined' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedNote.note_type === 'ai_refined' ? '✨ AI Refined' : '📝 Raw Draft'}
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(selectedNote.created_at).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={closeNoteDetail} 
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="border-t pt-4">
              {selectedNote.note_type === 'ai_refined' ? (
                <article className="prose prose-blue max-w-none">
                  <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                </article>
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedNote.content}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}