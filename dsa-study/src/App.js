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
import Modal from "./components/Modal";

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
      const data = await window.storage
        .get("dsa-completed-lessons")
        .catch(() => null);
      if (data?.value) setCompletedLessons(JSON.parse(data.value));
    } catch (error) {
      console.log("First load");
    }
  };

  const loadResourcesAndNotes = async () => {
    try {
      const [r, n] = await Promise.all([
        window.storage.get("dsa-resources").catch(() => null),
        window.storage.get("dsa-notes").catch(() => null),
      ]);
      if (r?.value) setResources(JSON.parse(r.value));
      if (n?.value) setNotes(JSON.parse(n.value));
    } catch (error) {
      console.log("First load");
    }
  };

  const saveData = async (type, data) => {
    try {
      await window.storage.set(`dsa-${type}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const markLessonComplete = async (lessonId) => {
    if (!completedLessons.find((l) => l.lessonId === lessonId)) {
      const updated = [
        ...completedLessons,
        { lessonId, completedAt: new Date().toISOString() },
      ];
      setCompletedLessons(updated);
      try {
        await window.storage.set(
          "dsa-completed-lessons",
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Error saving:", error);
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
      const newResource = {
        id: editingId || Date.now(),
        resourceName: formData.resourceName,
        resourceType: formData.resourceType,
        resourceLink: formData.resourceLink,
        dataStructure: formData.dataStructure,
        isFavorite: formData.isFavorite,
        addedAt: editingId
          ? resources.find((r) => r.id === editingId)?.addedAt
          : timestamp,
      };
      const updated = editingId
        ? resources.map((r) => (r.id === editingId ? newResource : r))
        : [...resources, newResource];
      setResources(updated);
      await saveData("resources", updated);
    } else if (modalType === "note") {
      const newNote = {
        id: editingId || Date.now(),
        noteTitle: formData.noteTitle,
        noteContent: formData.noteContent,
        tags: formData.tags,
        dataStructure: formData.dataStructure,
        createdAt: editingId
          ? notes.find((n) => n.id === editingId)?.createdAt
          : timestamp,
      };
      const updated = editingId
        ? notes.map((n) => (n.id === editingId ? newNote : n))
        : [...notes, newNote];
      setNotes(updated);
      await saveData("notes", updated);
    }
    setShowModal(false);
  };

  const deleteItem = async (type, id) => {
    if (type === "resource") {
      const updated = resources.filter((r) => r.id !== id);
      setResources(updated);
      await saveData("resources", updated);
    } else if (type === "note") {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      await saveData("notes", updated);
    }
  };

  const toggleFavorite = async (id) => {
    const updated = resources.map((r) =>
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    );
    setResources(updated);
    await saveData("resources", updated);
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
