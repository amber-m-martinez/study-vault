import React from "react";
import Resources from "./Resources";

export default function ResourcesPage({
  resources,
  onOpenModal,
  onDeleteItem,
  onToggleFavorite,
}) {
  return (
    <div className="bg-stone-50 border border-stone-300 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Resources
          resources={resources}
          onOpenModal={onOpenModal}
          onDeleteItem={onDeleteItem}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
}
