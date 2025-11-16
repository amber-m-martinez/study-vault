import "./App.css";
import DSATracker from "./components/DSATracker";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProblemsPage from "./components/Lessons/ProblemsPage";
import ResourcesPage from "./components/ResourcesPage";
import LessonsPage from "./components/Lessons/LessonsPage";
import { useState, useEffect } from "react";
import lessonData from "./components/lesson-data.json";
import NotesPage from "./components/NotesPage";
import NoteView from "./components/NoteView";
import Modal from "./components/Modal";
import { resourcesAPI, notesAPI, lessonsAPI } from "./services/api";

function App() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    resourceName: "",
    resourceType: "",
    resourceLink: "",
    dataStructure: "",
    isFavorite: false,
    noteTitle: "",
    noteContent: "",
    tags: "",
  });

  useEffect(() => {
    loadCompletedLessons();
    loadResourcesAndNotes();
  }, []);

  const loadCompletedLessons = async () => {
    try {
      const data = await lessonsAPI.getCompleted().catch(() => []);
      if (data) {
        // Convert from backend format to frontend format
        const formatted = data.map(l => ({
          lessonId: l.lesson_id,
          completedAt: l.completed_at
        }));
        setCompletedLessons(formatted);
      }
    } catch (error) {
      console.log("First load");
    }
  };

  const loadResourcesAndNotes = async () => {
    try {
      const [apiResources, apiNotes] = await Promise.all([
        resourcesAPI.getAll().catch(() => []),
        notesAPI.getAll().catch(() => []),
      ]);

      // Convert snake_case from backend to camelCase for frontend
      if (apiResources) {
        const formattedResources = apiResources.map(r => ({
          ...r,
          resourceName: r.resource_name || r.resourceName,
          resourceType: r.resource_type || r.resourceType,
          resourceLink: r.resource_link || r.resourceLink,
          dataStructure: r.data_structure || r.dataStructure,
          isFavorite: r.is_favorite === 1 || r.isFavorite,
          addedAt: r.added_at || r.addedAt,
        }));
        setResources(formattedResources);
      }

      if (apiNotes) {
        const formattedNotes = apiNotes.map(n => ({
          ...n,
          noteTitle: n.note_title || n.noteTitle,
          noteContent: n.note_content || n.noteContent,
          dataStructure: n.data_structure || n.dataStructure,
          createdAt: n.created_at || n.createdAt,
        }));
        setNotes(formattedNotes);
      }
    } catch (error) {
      console.log("First load");
    }
  };

  const markLessonComplete = async (lessonId) => {
    if (!completedLessons.find((l) => l.lessonId === lessonId)) {
      try {
        await lessonsAPI.markComplete(lessonId);
        const updated = [
          ...completedLessons,
          { lessonId, completedAt: new Date().toISOString() },
        ];
        setCompletedLessons(updated);
      } catch (error) {
        console.error("Error marking lesson complete:", error);
      }
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setShowModal(true);
    if (item) {
      setEditingId(item.id);
      setFormData({ ...item });
    } else {
      setEditingId(null);
      setFormData({
        resourceName: "",
        resourceType: "",
        resourceLink: "",
        dataStructure: "",
        isFavorite: false,
        noteTitle: "",
        noteContent: "",
        tags: "",
      });
    }
  };

  const handleSubmit = async () => {
    const timestamp = new Date().toISOString();
    if (modalType === "resource") {
      const resourceData = {
        resourceName: formData.resourceName,
        resourceType: formData.resourceType,
        resourceLink: formData.resourceLink,
        dataStructure: formData.dataStructure,
        isFavorite: formData.isFavorite,
      };

      try {
        if (editingId) {
          await resourcesAPI.update(editingId, resourceData);
          const existingResource = resources.find((r) => r.id === editingId);
          setResources(resources.map((r) =>
            r.id === editingId ? { ...resourceData, id: editingId, addedAt: existingResource.addedAt } : r
          ));
        } else {
          const result = await resourcesAPI.create({ ...resourceData, addedAt: timestamp });
          const newResource = { ...resourceData, id: result.id, addedAt: timestamp };
          setResources([newResource, ...resources]);
        }
      } catch (error) {
        console.error("Error saving resource:", error);
      }
    } else if (modalType === "note") {
      const noteData = {
        noteTitle: formData.noteTitle,
        noteContent: formData.noteContent,
        dataStructure: formData.dataStructure,
        tags: formData.tags,
      };

      try {
        if (editingId) {
          await notesAPI.update(editingId, noteData);
          const existingNote = notes.find((n) => n.id === editingId);
          setNotes(notes.map((n) =>
            n.id === editingId ? { ...noteData, id: editingId, createdAt: existingNote.createdAt } : n
          ));
        } else {
          const result = await notesAPI.create({ ...noteData, createdAt: timestamp });
          const newNote = { ...noteData, id: result.id, createdAt: timestamp };
          setNotes([newNote, ...notes]);
        }
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
    setShowModal(false);
  };

  const deleteItem = async (type, id) => {
    if (type === "resource") {
      try {
        await resourcesAPI.delete(id);
        setResources(resources.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    } else if (type === "note") {
      try {
        await notesAPI.delete(id);
        setNotes(notes.filter((n) => n.id !== id));
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const result = await resourcesAPI.toggleFavorite(id);
      setResources(resources.map((r) =>
        r.id === id ? { ...r, isFavorite: result.is_favorite === 1 } : r
      ));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "text-emerald-800 border-emerald-200",
      Medium: "text-amber-800 border-amber-200",
      Hard: "text-rose-800 border-rose-200",
    };
    return colors[difficulty] || "text-stone-700 border-stone-200";
  };

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<DSATracker />}></Route>
        <Route
          exact
          path="/lessons"
          element={
            <>
              <Navbar />
              <LessonsPage
                lessonData={lessonData}
                completedLessons={completedLessons}
                onMarkComplete={markLessonComplete}
                getDifficultyColor={getDifficultyColor}
              />
            </>
          }
        ></Route>
        <Route
          exact
          path="/lessons/:lessonId"
          element={
            <>
              <Navbar />
              <LessonsPage
                lessonData={lessonData}
                completedLessons={completedLessons}
                onMarkComplete={markLessonComplete}
                getDifficultyColor={getDifficultyColor}
              />
            </>
          }
        ></Route>
        <Route
          exact
          path="/problems"
          element={
            <>
              <Navbar />
              <ProblemsPage getDifficultyColor={getDifficultyColor} />
            </>
          }
        ></Route>
        <Route
          exact
          path="/notes"
          element={
            <>
              <Navbar />
              <NotesPage
                notes={notes}
                onOpenModal={openModal}
                onDeleteItem={deleteItem}
              />
            </>
          }
        ></Route>
        <Route exact path="/home" element={<DSATracker />}></Route>
        <Route
          exact
          path="/resources"
          element={
            <>
              <Navbar />
              <ResourcesPage
                resources={resources}
                onOpenModal={openModal}
                onDeleteItem={deleteItem}
                onToggleFavorite={toggleFavorite}
              />
            </>
          }
        ></Route>
        <Route
          exact
          path="/notes/:noteId"
          element={
            <>
              <Navbar />
              <NoteView
                notes={notes}
                onUpdateNote={async (updatedNote) => {
                  try {
                    await notesAPI.update(updatedNote.id, updatedNote);
                    setNotes(notes.map((n) =>
                      n.id === updatedNote.id ? updatedNote : n
                    ));
                  } catch (error) {
                    console.error("Error updating note:", error);
                  }
                }}
                onDeleteNote={async (id) => {
                  await deleteItem("note", id);
                }}
              />
            </>
          }
        ></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modal for adding/editing resources and notes */}
      {showModal && (
        <Modal
          type={modalType}
          formData={formData}
          onChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
