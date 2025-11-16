import React from "react";
import Problems from "./Problems";

export default function ProblemsPage({
  problems,
  onOpenModal,
  onDeleteItem,
  getDifficultyColor,
}) {
  return (
    <div className="bg-stone-50 p-8 min-h-screen">
      <Problems
        problems={problems}
        onOpenModal={onOpenModal}
        onDeleteItem={onDeleteItem}
        getDifficultyColor={getDifficultyColor}
      />
    </div>
  );
}
