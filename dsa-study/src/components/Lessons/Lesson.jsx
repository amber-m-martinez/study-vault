import React from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from "lucide-react";
import CodeEditor from "../CodeEditor";

export default function Lesson({
  lesson,
  onBack,
  userCode,
  testResults,
  onCodeChange,
  onRunCode,
  getDifficultyColor,
  onMarkComplete,
  isCompleted,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
  prevLesson,
  nextLesson,
}) {
  return (
    <div className="text-left bg-stone-50 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to lessons
        </button>

        <h2 className="text-3xl font-serif text-stone-800 mb-4">
          {lesson.title}
        </h2>

        <div className="flex gap-2 mb-6">
          <span
            className={`text-xs px-2 py-1 border ${getDifficultyColor(
              lesson.difficulty
            )}`}
          >
            {lesson.difficulty}
          </span>
          <span className="text-xs px-2 py-1 border border-stone-200 text-stone-700">
            {lesson.category}
          </span>
        </div>

        {/* Data Structures Used */}
        {lesson.dataStructures && (
          <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
            <h3 className="font-serif text-lg text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🗂️</span> Data Structures Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson.dataStructures.map((ds, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 border border-blue-300 text-blue-800 text-sm"
                >
                  {ds}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-6 mb-8">
          {/* What Is It */}
          <div className="bg-white border border-stone-300 p-6">
            <h3 className="font-serif text-lg text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📚</span> What Is It?
            </h3>
            <p className="text-stone-700 leading-relaxed">
              {lesson.explanation}
            </p>
          </div>

          {/* When To Use */}
          {lesson.whenToUse && (
            <div className="bg-white border border-stone-300 p-6">
              <h3 className="font-serif text-lg text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span> When To Use This Algorithm
              </h3>
              <ul className="space-y-2">
                {lesson.whenToUse.map((use, idx) => (
                  <li
                    key={idx}
                    className="text-stone-700 flex items-start gap-2"
                  >
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How It Works */}
          {lesson.howItWorks && (
            <div className="bg-white border border-stone-300 p-6">
              <h3 className="font-serif text-lg text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚙️</span> How It Works
              </h3>
              <pre className="text-stone-700 leading-relaxed whitespace-pre-wrap font-sans">
                {lesson.howItWorks}
              </pre>
            </div>
          )}

          {/* Key Insights */}
          {lesson.keyInsights && (
            <div className="bg-amber-50 border border-amber-200 p-6">
              <h3 className="font-serif text-lg text-amber-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">💡</span> Key Insights
              </h3>
              <ul className="space-y-2">
                {lesson.keyInsights.map((insight, idx) => (
                  <li
                    key={idx}
                    className="text-amber-900 flex items-start gap-2"
                  >
                    <span className="text-amber-600 mt-1">→</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Patterns */}
          {lesson.commonPatterns && (
            <div className="bg-white border border-stone-300 p-6">
              <h3 className="font-serif text-lg text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔄</span> Common Patterns
              </h3>
              <div className="space-y-3">
                {lesson.commonPatterns.map((pattern, idx) => (
                  <div key={idx} className="text-stone-700 leading-relaxed">
                    {pattern}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real World Applications */}
          {lesson.realWorldUse && (
            <div className="bg-emerald-50 border border-emerald-200 p-6">
              <h3 className="font-serif text-lg text-emerald-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🌍</span> Real-World Applications
              </h3>
              <p className="text-emerald-900 leading-relaxed">
                {lesson.realWorldUse}
              </p>
            </div>
          )}

          {/* Complexity */}
          <div className="bg-white border border-stone-300 p-6">
            <h3 className="font-serif text-lg text-stone-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">⏱️</span> Complexity Analysis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-stone-600 mb-1">Time Complexity</p>
                <p className="font-mono text-lg text-stone-800">
                  {lesson.timeComplexity}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-600 mb-1">Space Complexity</p>
                <p className="font-mono text-lg text-stone-800">
                  {lesson.spaceComplexity}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Learning */}
          {lesson.videoUrl && (
            <div className="border border-stone-300 p-6 bg-white">
              <h3 className="font-serif text-lg text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎥</span> Visual Demonstration
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Watch this tutorial to see {lesson.title} in action
              </p>
              <div className="aspect-video w-full">
                <iframe
                  src={
                    lesson.videoUrl.includes("youtube.com") ||
                    lesson.videoUrl.includes("youtu.be")
                      ? lesson.videoUrl
                          .replace("watch?v=", "embed/")
                          .replace("youtu.be/", "youtube.com/embed/")
                      : lesson.videoUrl
                  }
                  title={`${lesson.title} video tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border border-stone-200"
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Code Exercise */}
        <div className="border border-stone-300 p-6 bg-white">
          <h3 className="font-serif text-xl mb-4 text-stone-800">
            Practice Exercise
          </h3>
          <p className="text-sm text-stone-600 mb-4 leading-relaxed">
            {lesson.exercise.prompt}
          </p>

          <div className="mb-4">
            <CodeEditor
              value={userCode}
              onChange={onCodeChange}
              placeholder="// Write your code here..."
            />
          </div>

          <button
            onClick={onRunCode}
            className="px-6 py-2 bg-stone-800 text-white hover:bg-stone-700 transition-colors mb-4"
          >
            Run Tests
          </button>

          {/* Test Results */}
          {testResults && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-stone-800 mb-2">Test Results:</h4>
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 border rounded ${
                    result.passed
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">
                      Test Case {result.case}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        result.passed ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {result.passed ? "✓ Passed" : "✗ Failed"}
                    </span>
                  </div>
                  {!result.passed && (
                    <div className="text-xs text-stone-600 space-y-1 font-mono">
                      <div>
                        <span className="font-semibold">Input:</span>{" "}
                        {JSON.stringify(result.input)}
                      </div>
                      <div>
                        <span className="font-semibold">Expected:</span>{" "}
                        {JSON.stringify(result.expected)}
                      </div>
                      <div>
                        <span className="font-semibold">Got:</span>{" "}
                        {JSON.stringify(result.actual)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {testResults.every((r) => r.passed) && (
                <div className="mt-4 p-4 bg-emerald-100 border border-emerald-300 rounded">
                  <p className="text-emerald-800 font-medium">
                    🎉 Congratulations! All tests passed!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mark as Complete and Navigation */}
        <div className="mt-8 pt-6 border-t border-stone-300">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <button
              onClick={onNavigatePrev}
              disabled={!hasPrev}
              className={`flex flex-col items-start px-4 py-2 border transition-colors max-w-xs ${
                hasPrev
                  ? "border-stone-300 text-stone-700 hover:bg-stone-100"
                  : "border-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Previous</span>
              </div>
              {prevLesson && (
                <span className="text-xs text-stone-600 truncate max-w-full text-left">
                  {prevLesson.title}
                </span>
              )}
            </button>

            {/* Mark as Complete Button */}
            <button
              onClick={() => onMarkComplete(lesson.id)}
              className={`flex items-center gap-2 px-6 py-2 transition-colors whitespace-nowrap ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-stone-800 text-white hover:bg-stone-700"
              }`}
            >
              <Check className="w-4 h-4" />
              {isCompleted ? "Completed" : "Mark as Complete"}
            </button>

            {/* Next Button */}
            <button
              onClick={onNavigateNext}
              disabled={!hasNext}
              className={`flex flex-col items-end px-4 py-2 border transition-colors max-w-xs ${
                hasNext
                  ? "border-stone-300 text-stone-700 hover:bg-stone-100"
                  : "border-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Next</span>
                <ChevronRight className="w-4 h-4" />
              </div>
              {nextLesson && (
                <span className="text-xs text-stone-600 truncate max-w-full text-right">
                  {nextLesson.title}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
