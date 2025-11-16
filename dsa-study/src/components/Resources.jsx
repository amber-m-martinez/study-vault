import React, { useState } from "react";
import { Star, Plus, X, Edit2, Search } from "lucide-react";

function Resources({
  resources = [],
  onOpenModal,
  onDeleteItem,
  onToggleFavorite,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataStructureFilter, setDataStructureFilter] = useState("all");

  // Get unique data structures
  const dataStructures = [
    ...new Set(resources.map((r) => r.dataStructure).filter(Boolean)),
  ].sort();

  const filteredResources = resources.filter((resource) => {
    // Data structure filter
    if (
      dataStructureFilter !== "all" &&
      resource.dataStructure !== dataStructureFilter
    ) {
      return false;
    }

    // Search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      resource.resourceName.toLowerCase().includes(query) ||
      resource.resourceType.toLowerCase().includes(query) ||
      (resource.resourceLink &&
        resource.resourceLink.toLowerCase().includes(query)) ||
      (resource.dataStructure &&
        resource.dataStructure.toLowerCase().includes(query))
    );
  });

  return (
    <div className="text-left">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-300">
          <h2 className="text-xl font-serif text-stone-800">Resources</h2>
          <button
            onClick={() => onOpenModal("resource")}
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
              placeholder="Search resources..."
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
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="border border-stone-200 p-5 hover:bg-stone-100 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-serif text-stone-800">
                    {resource.resourceName}
                  </h3>
                  <button onClick={() => onToggleFavorite(resource.id)}>
                    <Star
                      className={`w-4 h-4 ${
                        resource.isFavorite
                          ? "text-amber-700 fill-amber-700"
                          : "text-stone-300"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 border border-stone-200 text-stone-700">
                    {resource.resourceType}
                  </span>
                  {resource.dataStructure && (
                    <span className="text-xs px-2 py-1 border border-stone-200 text-stone-700">
                      {resource.dataStructure}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenModal("resource", resource)}
                  className="text-stone-500 hover:text-stone-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteItem("resource", resource.id)}
                  className="text-stone-500 hover:text-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {resource.resourceLink && (
              <a
                href={resource.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-600 hover:text-stone-800 underline"
              >
                View →
              </a>
            )}
          </div>
        ))}
        {filteredResources.length === 0 && (
          <div className="col-span-2">
            <p className="text-stone-500 italic text-center py-16 text-sm">
              {resources.length === 0
                ? "No resources"
                : "No resources found matching your search"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;
