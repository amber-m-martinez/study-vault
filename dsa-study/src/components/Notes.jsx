import React, { useState } from "react";
import { Plus, X, Edit2, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function Notes({ notes = [], onOpenModal, onDeleteItem }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dataStructureFilter, setDataStructureFilter] = useState("all");

  // Get unique data structures
  const dataStructures = [
    ...new Set(notes.map((n) => n.dataStructure).filter(Boolean)),
  ].sort();

  const filteredNotes = notes.filter((note) => {
    // Data structure filter
    if (
      dataStructureFilter !== "all" &&
      note.dataStructure !== dataStructureFilter
    ) {
      return false;
    }

    // Search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.noteTitle.toLowerCase().includes(query) ||
      note.noteContent.toLowerCase().includes(query) ||
      (note.tags && note.tags.toLowerCase().includes(query)) ||
      (note.dataStructure && note.dataStructure.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-300">
          <h2 className="text-xl font-serif text-stone-800">Notes</h2>
          <button
            onClick={() => onOpenModal("note")}
            className="bg-stone-800 text-stone-50 px-5 py-2 text-xs flex items-center gap-2 hover:bg-stone-700"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        {/* Search and Filters on Same Line */}
        <div className="flex gap-3 mb-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          {/* Data Structure Filter */}
          <select
            value={dataStructureFilter}
            onChange={(e) => setDataStructureFilter(e.target.value)}
            className="px-4 py-2 border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="all">All Data Structures</option>
            {dataStructures.map((ds) => (
              <option key={ds} value={ds}>
                {ds}
              </option>
            ))}
          </select>

          {/* Clear Filter Button */}
          {dataStructureFilter !== "all" && (
            <button
              onClick={() => setDataStructureFilter("all")}
              className="px-4 py-2 border border-stone-300 bg-white hover:bg-stone-100 text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <p className="text-sm text-stone-600">
          Showing {filteredNotes.length} of {notes.length} notes
        </p>
      </div>

      <div className="text-left space-y-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="border border-stone-200 bg-white hover:bg-stone-50 transition-colors"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3
                  onClick={() => navigate(`/notes/${note.id}`)}
                  className="font-serif text-lg text-stone-800 flex-1 cursor-pointer hover:text-stone-600"
                >
                  {note.noteTitle}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="text-stone-500 hover:text-stone-800"
                    title="View note"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal("note", note);
                    }}
                    className="text-stone-500 hover:text-stone-800"
                    title="Quick edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem("note", note.id);
                    }}
                    className="text-stone-500 hover:text-stone-800"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div
                onClick={() => navigate(`/notes/${note.id}`)}
                className="cursor-pointer"
              >
                <div className="text-sm text-stone-700 mb-3 line-clamp-3 prose prose-stone prose-sm max-w-none">
                  <ReactMarkdown>
                    {note.noteContent || "*No content*"}
                  </ReactMarkdown>
                </div>
              </div>
              {(note.dataStructure || note.tags) && (
                <div className="flex flex-wrap gap-2">
                  {note.dataStructure && (
                    <span className="text-xs px-2 py-1 border border-stone-200 text-stone-700 bg-stone-50">
                      {note.dataStructure}
                    </span>
                  )}
                  {note.tags &&
                    note.tags.split(",").map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 border border-stone-200 text-stone-700"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-stone-500 italic text-center py-16 text-sm">
            {notes.length === 0
              ? "No notes"
              : "No notes found matching your search"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Notes;
