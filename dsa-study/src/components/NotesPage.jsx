import React from "react";
import Notes from "./Notes";

export default function NotesPage({ notes, onOpenModal, onDeleteItem }) {
  return (
    <div className="bg-stone-50 border border-stone-300 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Notes
          notes={notes}
          onOpenModal={onOpenModal}
          onDeleteItem={onDeleteItem}
        />
      </div>
    </div>
  );
}
