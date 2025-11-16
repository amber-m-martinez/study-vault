// Lesson.jsx - Single lesson detail view
import React from "react";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";

export default function LessonDetails({
  lesson,
  onBack,
  visualizerStep,
  isAnimating,
  userCode,
  testResults,
  onStartAnimation,
  onResetAnimation,
  onCodeChange,
  onRunCode,
  getDifficultyColor,
}) {
  return (
    <div className="bg-stone-50 border border-stone-300 p-8 min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6"
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

      <div className="prose max-w-none mb-8">
        <p className="text-stone-700">{lesson.explanation}</p>
      </div>

      {/* Visualizer */}
      {lesson.visualizer && (
        <div className="border border-stone-300 p-6 mb-8 bg-white">
          <h3 className="font-serif text-xl mb-4">Visual Demonstration</h3>
          <div className="mb-4 p-4 bg-stone-100 min-h-[200px] flex items-center justify-center">
            <p className="text-stone-600">
              {lesson.visualizer.steps[visualizerStep]}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onStartAnimation}
              disabled={isAnimating}
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white hover:bg-stone-700 disabled:bg-stone-400"
            >
              <Play className="w-4 h-4" />
              {isAnimating ? "Playing..." : "Play"}
            </button>
            <button
              onClick={onResetAnimation}
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 hover:bg-stone-100"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Code Exercise */}
      <div className="border border-stone-300 p-6 bg-white">
        <h3 className="font-serif text-xl mb-4">Practice Exercise</h3>
        <p className="text-sm text-stone-600 mb-4">{lesson.exercise.prompt}</p>

        <textarea
          value={userCode}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full p-4 border border-stone-300 font-mono text-sm mb-4 min-h-[200px]"
          placeholder="Write your code here..."
        />

        <button
          onClick={onRunCode}
          className="px-4 py-2 bg-stone-800 text-white hover:bg-stone-700 mb-4"
        >
          Run Tests
        </button>

        {/* Test Results */}
        {testResults && (
          <div className="mt-4 space-y-2">
            {testResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-3 border ${
                  result.passed
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    Test Case {result.case}
                  </span>
                  <span
                    className={`text-xs ${
                      result.passed ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {result.passed ? "✓ Passed" : "✗ Failed"}
                  </span>
                </div>
                {!result.passed && (
                  <div className="text-xs text-stone-600">
                    <div>Input: {JSON.stringify(result.input)}</div>
                    <div>Expected: {JSON.stringify(result.expected)}</div>
                    <div>Got: {JSON.stringify(result.actual)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
