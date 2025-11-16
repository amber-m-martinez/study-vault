import React from "react";
import { Play, RotateCcw } from "lucide-react";

function AlgorithmVisualizer({
  visualizer,
  visualizerStep,
  isAnimating,
  lessonId,
  onStart,
  onReset,
}) {
  return (
    <div className="border border-stone-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif text-stone-800">Visualizer</h3>
        <div className="flex gap-2">
          <button
            onClick={onStart}
            disabled={isAnimating}
            className="bg-stone-800 text-stone-50 px-4 py-2 text-xs flex items-center gap-2 hover:bg-stone-700 disabled:opacity-50"
          >
            <Play className="w-3 h-3" />
            Play
          </button>
          <button
            onClick={onReset}
            className="border border-stone-300 text-stone-700 px-4 py-2 text-xs flex items-center gap-2 hover:bg-stone-100"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>
      <div className="bg-stone-100 p-6">
        <div className="flex justify-center items-end gap-2 mb-4 h-32">
          {visualizer.array.map((val, idx) => {
            const step = visualizer.steps[visualizerStep];
            let bgColor = "bg-stone-300";
            if (lessonId.includes("binary") && step.mid !== undefined) {
              if (idx === step.mid) bgColor = "bg-amber-500";
              else if (idx >= step.left && idx <= step.right)
                bgColor = "bg-stone-400";
            } else if (
              lessonId.includes("pointer") &&
              step.left !== undefined
            ) {
              if (idx === step.left) bgColor = "bg-emerald-500";
              else if (idx === step.right) bgColor = "bg-rose-500";
            } else if (
              lessonId.includes("window") &&
              step.start !== undefined
            ) {
              if (idx >= step.start && idx <= step.end)
                bgColor = "bg-amber-500";
            }
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-12 ${bgColor} text-white flex items-center justify-center font-mono text-sm transition-all duration-500`}
                  style={{
                    height: `${(val / Math.max(...visualizer.array)) * 100}px`,
                  }}
                >
                  {val}
                </div>
                <span className="text-xs text-stone-500 mt-1">{idx}</span>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-stone-700 text-center">
          {visualizer.steps[visualizerStep].description}
        </p>
      </div>
    </div>
  );
}

export default AlgorithmVisualizer;
