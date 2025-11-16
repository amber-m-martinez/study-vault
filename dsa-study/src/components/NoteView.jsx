import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function NoteView({ notes, onUpdateNote, onDeleteNote }) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(null);

  const note = notes.find((n) => n.id === parseInt(noteId));

  useEffect(() => {
    if (note) {
      setEditedNote({ ...note });
    }
  }, [note]);

  if (!note || !editedNote) {
    return (
      <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/notes")}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </button>
          <p className="text-stone-500">Note not found</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    await onUpdateNote(editedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNote({ ...note });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await onDeleteNote(note.id);
      navigate("/notes");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-300">
          <button
            onClick={() => navigate("/notes")}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </button>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-stone-50 hover:bg-stone-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-stone-50 hover:bg-stone-700"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="text-left bg-white border border-stone-300 p-8">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedNote.noteTitle}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, noteTitle: e.target.value })
                }
                className="w-full text-3xl font-serif border-b-2 border-stone-200 focus:border-stone-800 focus:outline-none pb-2 bg-transparent"
                placeholder="Note Title"
              />

              <div className="flex gap-4">
                <select
                  value={editedNote.dataStructure || ""}
                  onChange={(e) =>
                    setEditedNote({
                      ...editedNote,
                      dataStructure: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="">Topic (optional)</option>
                  <option value="Arrays">Arrays</option>
                  <option value="Strings">Strings</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Stacks">Stacks</option>
                  <option value="Queues">Queues</option>
                  <option value="Hash Maps">Hash Maps</option>
                  <option value="Trees">Trees</option>
                  <option value="Graphs">Graphs</option>
                  <option value="Heaps">Heaps</option>
                  <option value="Tries">Tries</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  value={editedNote.tags || ""}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, tags: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                  placeholder="Tags (comma-separated)"
                />
              </div>

              <div className="border-t border-stone-200 pt-4">
                <label className="block text-sm text-stone-600 mb-2">
                  Content (Markdown supported)
                </label>
                <textarea
                  value={editedNote.noteContent || ""}
                  onChange={(e) =>
                    setEditedNote({
                      ...editedNote,
                      noteContent: e.target.value,
                    })
                  }
                  className="w-full p-4 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 font-mono text-sm bg-white min-h-[400px]"
                  placeholder="Write your note here... Markdown is supported!"
                />
                <p className="text-xs text-stone-500 mt-2">
                  Tip: Use **bold**, *italic*, # Headings, `code`, and more!
                </p>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-serif text-stone-800 mb-4">
                {note.noteTitle}
              </h1>

              {(note.dataStructure || note.tags) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {note.dataStructure && (
                    <span className="text-xs px-3 py-1 border border-stone-200 text-stone-700 bg-stone-50">
                      {note.dataStructure}
                    </span>
                  )}
                  {note.tags &&
                    note.tags.split(",").map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 border border-stone-200 text-stone-700"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              )}

              <div className="prose prose-stone max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-serif text-stone-800 mb-4 mt-6">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-serif text-stone-800 mb-3 mt-5">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-serif text-stone-800 mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-stone-700 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 text-stone-800 text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block p-4 bg-stone-100 border border-stone-200 text-stone-800 text-sm font-mono whitespace-pre-wrap mb-4">
                          {children}
                        </code>
                      ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-1 text-stone-700">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-1 text-stone-700">
                        {children}
                      </ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-stone-300 pl-4 italic text-stone-600 mb-4">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-stone-900">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-stone-700">{children}</em>
                    ),
                  }}
                >
                  {note.noteContent || "*No content*"}
                </ReactMarkdown>
              </div>

              {note.createdAt && (
                <p className="text-xs text-stone-500 mt-8 pt-4 border-t border-stone-200">
                  Created: {new Date(note.createdAt).toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
