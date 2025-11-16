import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, Search } from "lucide-react";
import { problemsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import lessonData from "../lesson-data.json";

function Problems({ getDifficultyColor }) {
  const navigate = useNavigate();
  const [allProblems, setAllProblems] = useState([]);
  const [filter, setFilter] = useState("all"); // all, completed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await problemsAPI.getAll();
      setAllProblems(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load problems:", error);
      setError("Backend not running. Please start the backend server.");
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = [...new Set(allProblems.map((p) => p.category))].sort();

  const filteredProblems = allProblems.filter((problem) => {
    // Completion filter
    if (filter === "completed" && problem.completed !== 1) return false;

    // Difficulty filter
    if (difficultyFilter !== "all" && problem.difficulty !== difficultyFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== "all" && problem.category !== categoryFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !problem.title.toLowerCase().includes(query) &&
        !(
          problem.description &&
          problem.description.toLowerCase().includes(query)
        ) &&
        !problem.category.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  const handleProblemClick = (problem) => {
    // Navigate to specific lesson URL
    navigate(`/lessons/${problem.lesson_id}`);
  };

  if (loading) {
    return (
      <div className="bg-stone-50 p-8 min-h-screen">
        <div className="text-center py-16 text-stone-500">
          Loading problems...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-50 p-8 min-h-screen">
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-stone-600 text-sm mb-2">
            Run:{" "}
            <code className="bg-stone-200 px-2 py-1">
              cd backend && python3 app.py
            </code>
          </p>
          <p className="text-stone-500 text-xs">
            Backend should be running on http://localhost:5001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-serif text-stone-800 mb-2">Problems</h2>
          <p className="text-sm text-stone-600 mb-4">
            Track your progress on problems
          </p>

          {/* Completion Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { value: "all", label: "All Problems" },
              { value: "completed", label: "Completed", icon: CheckCircle2 },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 text-sm border transition-colors flex items-center gap-2 ${
                  filter === tab.value
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-white border-stone-300 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Clear Filters Button */}
            {(difficultyFilter !== "all" || categoryFilter !== "all") && (
              <button
                onClick={() => {
                  setDifficultyFilter("all");
                  setCategoryFilter("all");
                }}
                className="px-4 py-2 border border-stone-300 bg-white hover:bg-stone-100 text-sm transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => handleProblemClick(problem)}
              className="p-5 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-serif text-lg text-stone-800">
                      {problem.title}
                    </h3>
                    {problem.completed === 1 && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  {problem.description && (
                    <p className="text-left text-sm text-stone-600 mb-3">
                      {problem.description.substring(0, 200)}
                      {problem.description.length > 200 && "..."}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`text-xs px-2 py-1 border ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 border border-stone-200 text-stone-700">
                      {problem.category}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors" />
              </div>
              {problem.completed_at && (
                <p className="text-xs text-stone-500 italic">
                  Completed on{" "}
                  {new Date(problem.completed_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
          {filteredProblems.length === 0 && (
            <p className="text-stone-500 italic text-center py-16 text-sm">
              No problems found. Make sure the backend is running and seeded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Problems;
