import React from "react";
import { Play } from "lucide-react";

function Exercise({
  exercise,
  userCode,
  testResults,
  solution,
  onCodeChange,
  onRunCode,
  getDifficultyColor,
}) {
  return (
    <div className="border border-stone-300 p-6">
      <h3 className="text-lg font-serif text-stone-800 mb-2">
        {exercise.title}
      </h3>
      <span
        className={`text-xs px-2 py-1 border ${getDifficultyColor(
          exercise.difficulty
        )} inline-block mb-4`}
      >
        {exercise.difficulty}
      </span>
      <p className="text-sm text-stone-700 mb-4 leading-relaxed">
        {exercise.description}
      </p>

      {exercise.examples && (
        <div className="mb-4 space-y-3">
          {exercise.examples.map((ex, idx) => (
            <div key={idx} className="bg-stone-100 border border-stone-200 p-4">
              <p className="text-xs font-serif text-stone-700 mb-2">
                Example {idx + 1}:
              </p>
              <p className="text-xs font-mono text-stone-700 mb-1">
                <strong>Input:</strong> {ex.input}
              </p>
              <p className="text-xs font-mono text-stone-700 mb-1">
                <strong>Output:</strong> {ex.output}
              </p>
              <p className="text-xs text-stone-600">
                <strong>Explanation:</strong> {ex.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      {exercise.constraints && (
        <div className="mb-4">
          <p className="text-xs font-serif text-stone-700 mb-2">Constraints:</p>
          <ul className="list-disc list-inside space-y-1">
            {exercise.constraints.map((c, idx) => (
              <li key={idx} className="text-xs text-stone-600 font-mono">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label className="text-sm text-stone-600 mb-2 block">
          Your Solution:
        </label>
        <textarea
          value={userCode}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-64 p-4 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white text-stone-800 font-mono text-xs"
          spellCheck="false"
        />
      </div>

      <button
        onClick={onRunCode}
        className="bg-stone-800 text-stone-50 px-6 py-2 text-sm flex items-center gap-2 hover:bg-stone-700 mb-4"
      >
        <Play className="w-4 h-4" />
        Run Tests
      </button>

      {testResults && (
        <div className="border border-stone-300 p-4">
          <h4 className="text-sm font-serif text-stone-800 mb-3">
            Test Results:
          </h4>
          {testResults.map((result, idx) => (
            <div
              key={idx}
              className={`mb-3 p-3 border ${
                result.passed
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-rose-200 bg-rose-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono">Test {result.case}</span>
                <span
                  className={`text-xs px-2 py-1 ${
                    result.passed
                      ? "bg-emerald-200 text-emerald-800"
                      : "bg-rose-200 text-rose-800"
                  }`}
                >
                  {result.passed ? "PASSED" : "FAILED"}
                </span>
              </div>
              <div className="text-xs font-mono space-y-1">
                <p className="text-stone-600">
                  Input: {JSON.stringify(result.input)}
                </p>
                <p className="text-stone-600">
                  Expected: {JSON.stringify(result.expected)}
                </p>
                <p className="text-stone-600">
                  Actual: {JSON.stringify(result.actual)}
                </p>
              </div>
            </div>
          ))}
          {testResults.every((r) => r.passed) && (
            <p className="text-emerald-700 text-sm font-serif text-center mt-4">
              🎉 All tests passed!
            </p>
          )}
        </div>
      )}

      <details className="mt-6 border border-stone-300 p-4">
        <summary className="cursor-pointer text-sm font-serif text-stone-700 hover:text-stone-900">
          View Solution
        </summary>
        <div className="mt-4 bg-stone-100 border border-stone-200 p-4">
          <pre className="text-xs font-mono text-stone-700 overflow-x-auto whitespace-pre-wrap">
            {solution}
          </pre>
        </div>
      </details>
    </div>
  );
}

export default Exercise;
