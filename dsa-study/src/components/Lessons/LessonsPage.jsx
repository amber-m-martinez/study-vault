import React, { useState, useEffect } from "react";
import { Check, ChevronRight, Search } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Lesson from "./Lesson";

export default function LessonsPage({
  lessonData,
  completedLessons,
  onMarkComplete,
  getDifficultyColor,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [dataStructureFilter, setDataStructureFilter] = useState("all");

  const allLessons = Object.entries(lessonData).flatMap(([category, lessons]) =>
    lessons.map((lesson) => ({ ...lesson, category }))
  );

  // Get all unique data structures
  const allDataStructures = [
    ...new Set(allLessons.flatMap((lesson) => lesson.dataStructures || [])),
  ].sort();

  // Handle URL parameter for lesson
  useEffect(() => {
    if (lessonId) {
      const lesson = allLessons.find((l) => l.id === lessonId);
      if (lesson) {
        setSelectedLesson(lesson);
        setUserCode(lesson.exercise.starterCode);
        setTestResults(null);
      }
    }
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle opening a specific lesson from Problems page (legacy support)
  useEffect(() => {
    if (location.state?.openLessonId && !lessonId) {
      const lesson = allLessons.find(
        (l) => l.id === location.state.openLessonId
      );
      if (lesson) {
        navigate(`/lessons/${lesson.id}`, { replace: true });
      }
    }
  }, [location.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredLessons = allLessons.filter((lesson) => {
    // Difficulty filter
    if (difficultyFilter !== "all" && lesson.difficulty !== difficultyFilter) {
      return false;
    }
    // Data structure filter
    if (dataStructureFilter !== "all") {
      if (
        !lesson.dataStructures ||
        !lesson.dataStructures.includes(dataStructureFilter)
      ) {
        return false;
      }
    }
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lesson.title.toLowerCase().includes(query) ||
        lesson.explanation.toLowerCase().includes(query) ||
        lesson.category.toLowerCase().includes(query) ||
        (lesson.dataStructures &&
          lesson.dataStructures.some((ds) => ds.toLowerCase().includes(query)))
      );
    }
    return true;
  });

  // Group lessons by data structure for organized display
  const lessonsByDataStructure = {};
  filteredLessons.forEach((lesson) => {
    if (lesson.dataStructures && lesson.dataStructures.length > 0) {
      lesson.dataStructures.forEach((ds) => {
        if (!lessonsByDataStructure[ds]) {
          lessonsByDataStructure[ds] = [];
        }
        if (!lessonsByDataStructure[ds].some((l) => l.id === lesson.id)) {
          lessonsByDataStructure[ds].push(lesson);
        }
      });
    } else {
      if (!lessonsByDataStructure["Other"]) {
        lessonsByDataStructure["Other"] = [];
      }
      lessonsByDataStructure["Other"].push(lesson);
    }
  });

  const runCode = async () => {
    if (!selectedLesson) return;
    try {
      const results = selectedLesson.exercise.testCases.map((testCase, idx) => {
        try {
          // eslint-disable-next-line no-new-func
          const func = new Function("return " + userCode)();
          const inputs = Object.values(testCase.input);
          const result = func(...inputs);
          const passed =
            JSON.stringify(result) === JSON.stringify(testCase.expected);
          return {
            case: idx + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: result,
            passed,
          };
        } catch (error) {
          return {
            case: idx + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: error.message,
            passed: false,
          };
        }
      });
      setTestResults(results);

      // If all tests pass, mark as complete and update backend
      if (results.every((r) => r.passed)) {
        onMarkComplete(selectedLesson.id);

        // Update backend progress
        try {
          const { progressAPI } = await import("../../services/api");
          const problemId = `${selectedLesson.id}-exercise`;
          await progressAPI.update(problemId, {
            user_code: userCode,
            completed: 1,
            completed_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Failed to update backend progress:", error);
        }
      }
    } catch (error) {
      setTestResults([{ case: "Error", passed: false, actual: error.message }]);
    }
  };

  const openLesson = (lesson) => {
    navigate(`/lessons/${lesson.id}`);
  };

  const closeLesson = () => {
    navigate("/lessons");
    setSelectedLesson(null);
    setUserCode("");
    setTestResults(null);
  };

  const navigateToLesson = (lessonId) => {
    const lesson = allLessons.find((l) => l.id === lessonId);
    if (lesson) {
      navigate(`/lessons/${lessonId}`);
    }
  };

  if (selectedLesson) {
    const currentIndex = allLessons.findIndex(
      (l) => l.id === selectedLesson.id
    );
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < allLessons.length - 1;
    const prevLesson = hasPrev ? allLessons[currentIndex - 1] : null;
    const nextLesson = hasNext ? allLessons[currentIndex + 1] : null;
    const isCompleted = completedLessons.some(
      (l) => l.lessonId === selectedLesson.id
    );

    return (
      <Lesson
        lesson={selectedLesson}
        onBack={closeLesson}
        userCode={userCode}
        testResults={testResults}
        onCodeChange={setUserCode}
        onRunCode={runCode}
        getDifficultyColor={getDifficultyColor}
        onMarkComplete={onMarkComplete}
        isCompleted={isCompleted}
        onNavigatePrev={() => prevLesson && navigateToLesson(prevLesson.id)}
        onNavigateNext={() => nextLesson && navigateToLesson(nextLesson.id)}
        hasPrev={hasPrev}
        hasNext={hasNext}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-300 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-serif text-stone-800 mb-4">
            Algorithm Lessons
          </h2>

          {/* Search and Filters on Same Line */}
          <div className="flex gap-3 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search lessons..."
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
              {allDataStructures.map((ds) => (
                <option key={ds} value={ds}>
                  {ds}
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
            {(difficultyFilter !== "all" || dataStructureFilter !== "all") && (
              <button
                onClick={() => {
                  setDifficultyFilter("all");
                  setDataStructureFilter("all");
                }}
                className="px-4 py-2 border border-stone-300 bg-white hover:bg-stone-100 text-sm transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-sm text-stone-600">
            Showing {filteredLessons.length} of {allLessons.length} lessons
          </p>
        </div>
        <div className="space-y-6">
          {Object.keys(lessonsByDataStructure)
            .sort()
            .map((dataStructure) => (
              <div key={dataStructure}>
                <h3 className="text-left text-lg font-serif text-stone-800 mb-3 pb-2 border-b border-stone-300">
                  {dataStructure}
                </h3>
                <div className="space-y-3">
                  {lessonsByDataStructure[dataStructure].map((lesson) => {
                    const isCompleted = completedLessons.some(
                      (l) => l.lessonId === lesson.id
                    );
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => openLesson(lesson)}
                        className="bg-white border border-stone-200 p-4 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-serif text-base text-stone-800">
                                {lesson.title}
                              </h4>
                              {isCompleted && (
                                <Check className="w-4 h-4 text-emerald-600" />
                              )}
                            </div>
                            <p className="text-left text-sm text-stone-600 mb-3">
                              {lesson.explanation.substring(0, 120)}...
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`text-xs px-2 py-1 border ${getDifficultyColor(
                                  lesson.difficulty
                                )}`}
                              >
                                {lesson.difficulty}
                              </span>
                              {lesson.dataStructures && lesson.dataStructures.map((ds, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 border border-blue-200 text-blue-800 bg-blue-50"
                                >
                                  {ds}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-stone-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
