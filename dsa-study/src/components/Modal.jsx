import React from "react";
import { X, Check } from "lucide-react";

function Modal({
  type,
  formData,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-stone-50 border-2 border-stone-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-300">
          <h2 className="text-2xl font-serif text-stone-800">
            {formData.id ? "Edit" : "Add"}{" "}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {type === "problem" && (
            <>
              <input
                type="text"
                placeholder="Problem Title"
                value={formData.title || ""}
                onChange={(e) => onChange("title", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category || ""}
                onChange={(e) => onChange("category", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              />
              <select
                value={formData.difficulty || ""}
                onChange={(e) => onChange("difficulty", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              >
                <option value="">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <input
                type="text"
                placeholder="Platform"
                value={formData.platform || ""}
                onChange={(e) => onChange("platform", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              />
              <textarea
                placeholder="Solution"
                value={formData.solution || ""}
                onChange={(e) => onChange("solution", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 font-mono text-sm bg-white"
                rows="6"
              />
            </>
          )}
          {type === "resource" && (
            <>
              <input
                type="text"
                placeholder="Resource Name"
                value={formData.resourceName || ""}
                onChange={(e) => onChange("resourceName", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              />
              <select
                value={formData.resourceType || ""}
                onChange={(e) => onChange("resourceType", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              >
                <option value="">Type</option>
                <option value="Book">Book</option>
                <option value="YouTube">YouTube</option>
                <option value="Course">Course</option>
              </select>
              <select
                value={formData.dataStructure || ""}
                onChange={(e) => onChange("dataStructure", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              >
                <option value="">Data Structure</option>
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
                type="url"
                placeholder="Link"
                value={formData.resourceLink || ""}
                onChange={(e) => onChange("resourceLink", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFavorite || false}
                  onChange={(e) => onChange("isFavorite", e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-stone-700 text-sm">Favorite</span>
              </label>
            </>
          )}
          {type === "note" && (
            <>
              <input
                type="text"
                placeholder="Title"
                value={formData.noteTitle || ""}
                onChange={(e) => onChange("noteTitle", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              />
              <textarea
                placeholder="Content"
                value={formData.noteContent || ""}
                onChange={(e) => onChange("noteContent", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
                rows="8"
              />
              <select
                value={formData.dataStructure || ""}
                onChange={(e) => onChange("dataStructure", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              >
                <option value="">Data Structure</option>
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
                placeholder="Tags (comma-separated)"
                value={formData.tags || ""}
                onChange={(e) => onChange("tags", e.target.value)}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              />
            </>
          )}
          <button
            onClick={onSubmit}
            className="w-full bg-stone-800 text-stone-50 py-3 hover:bg-stone-700 flex items-center justify-center gap-2 font-serif text-sm"
          >
            <Check className="w-4 h-4" />
            {formData.id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
