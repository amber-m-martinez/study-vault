import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, Code, Star, Check, ChevronRight, Clock } from "lucide-react";
import lessonData from "./lesson-data.json";
import Modal from "./Modal";
import Navbar from "./Navbar";
import LessonsPage from "./Lessons/LessonsPage";
import ProblemsPage from "./Lessons/ProblemsPage";
import ResourcesPage from "./ResourcesPage";
import NotesPage from "./NotesPage";
import { problemsAPI, resourcesAPI, notesAPI, lessonsAPI } from "../services/api";

export default function DSATracker() {
  const [currentPage, setCurrentPage] = useState("home");
  const [problems, setProblems] = useState([]);
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [lastVisitedLesson, setLastVisitedLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    difficulty: "",
    platform: "",
    solution: "",
    timeComplexity: "",
    spaceComplexity: "",
    resourceName: "",
    resourceType: "",
    resourceLink: "",
    dataStructure: "",
    isFavorite: false,
    noteTitle: "",
    noteContent: "",
    tags: "",
  });

  const allLessons = Object.entries(lessonData).flatMap(([category, lessons]) =>
    lessons.map((lesson) => ({ ...lesson, category }))
  );

  const generateActivityData = () => {
    const weeks = 52,
      days = weeks * 7,
      today = new Date(),
      activity = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count =
        problems.filter((p) => {
          const completedDate = p.completed_at || p.completedAt;
          if (!completedDate) return false;
          return new Date(completedDate).toISOString().split("T")[0] === dateStr;
        }).length +
        completedLessons.filter((l) => {
          if (!l.completedAt) return false;
          return new Date(l.completedAt).toISOString().split("T")[0] === dateStr;
        }).length;
      activity.push({ date: dateStr, count });
    }
    return activity;
  };

  // Recalculate activity data when problems or completedLessons change
  const activityData = useMemo(() => generateActivityData(), [problems, completedLessons]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apiProblems, apiResources, apiNotes, apiLessons, lastLesson] = await Promise.all([
        problemsAPI.getAll().catch(() => []),
        resourcesAPI.getAll().catch(() => []),
        notesAPI.getAll().catch(() => []),
        lessonsAPI.getCompleted().catch(() => []),
        window.storage.get("dsa-last-visited-lesson").catch(() => null),
      ]);
      if (apiProblems) setProblems(apiProblems);

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

      if (apiLessons) {
        const formattedLessons = apiLessons.map(l => ({
          lessonId: l.lesson_id,
          completedAt: l.completed_at
        }));
        setCompletedLessons(formattedLessons);
      }

      if (lastLesson?.value) setLastVisitedLesson(JSON.parse(lastLesson.value));
    } catch (error) {
      console.log("First load");
    }
  };

  const saveData = async (type, data) => {
    try {
      await window.storage.set(`dsa-${type}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
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

  const updateLastVisitedLesson = async (lesson) => {
    setLastVisitedLesson(lesson);
    await saveData("last-visited-lesson", lesson);
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
        title: "",
        category: "",
        difficulty: "",
        platform: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
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
    if (modalType === "problem") {
      const newProblem = {
        id: editingId || Date.now(),
        title: formData.title,
        category: formData.category,
        difficulty: formData.difficulty,
        platform: formData.platform,
        solution: formData.solution,
        timeComplexity: formData.timeComplexity,
        spaceComplexity: formData.spaceComplexity,
        completedAt: editingId
          ? problems.find((p) => p.id === editingId)?.completedAt
          : timestamp,
      };
      const updated = editingId
        ? problems.map((p) => (p.id === editingId ? newProblem : p))
        : [...problems, newProblem];
      setProblems(updated);
      await saveData("problems", updated);
    } else if (modalType === "resource") {
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
    if (type === "problem") {
      const updated = problems.filter((p) => p.id !== id);
      setProblems(updated);
      await saveData("problems", updated);
    } else if (type === "resource") {
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

  const getActivityColor = (count) => {
    if (count === 0) return "bg-stone-100";
    if (count === 1) return "bg-emerald-200";
    if (count === 2) return "bg-emerald-400";
    return "bg-emerald-600";
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleContinueLesson = () => {
    setCurrentPage("lessons");
    // The LessonsPage component will need to be enhanced to accept a lesson to open
  };

  // Home Page Content
  const renderHomePage = () => (
    <div className="max-w-6xl mx-auto p-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-px bg-stone-300 border border-stone-300 mb-10">
        {[
          {
            icon: Code,
            label: "Problems",
            count: `${problems.filter(p => p.completed === 1).length}/${problems.length}`
          },
          { icon: BookOpen, label: "Resources", count: resources.length },
          { icon: Star, label: "Notes", count: notes.length },
          {
            icon: Check,
            label: "Lessons",
            count: `${completedLessons.length}/${allLessons.length}`,
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-stone-50 p-6 text-center">
            <stat.icon className="w-6 h-6 text-stone-400 mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-serif mb-1 tracking-wide">
              {stat.label}
            </p>
            <p className="text-3xl font-serif text-stone-800">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Activity Graph */}
      <div className="mb-10 bg-stone-50 border border-stone-300 p-6">
        <h3 className="text-sm font-serif text-stone-700 mb-4">Activity</h3>
        <div className="w-full overflow-x-auto">
          <div
            className="inline-grid gap-1"
            style={{ gridTemplateColumns: "repeat(52, minmax(12px, 1fr))" }}
          >
            {Array.from({ length: 52 }).map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dataIdx = weekIdx * 7 + dayIdx;
                  const dayData = activityData[dataIdx];
                  return (
                    <div
                      key={dayIdx}
                      className={`w-3 h-3 ${
                        dayData
                          ? getActivityColor(dayData.count)
                          : "bg-stone-100"
                      } border border-stone-200`}
                      title={dayData ? `${dayData.date}: ${dayData.count}` : ""}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-stone-600">
          <span>Less</span>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 ${getActivityColor(
                i
              )} border border-stone-200`}
            ></div>
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Pick Up Where You Left Off */}
      {lastVisitedLesson && (
        <div className="mb-10 bg-stone-50 border border-stone-300 p-6">
          <h2 className="text-xl font-serif text-stone-800 mb-5 pb-2 border-b border-stone-300">
            Pick Up Where You Left Off
          </h2>
          <div
            onClick={handleContinueLesson}
            className="border border-stone-200 p-5 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-stone-400" />
                <div>
                  <h3 className="font-serif text-lg text-stone-800 mb-1">
                    {lastVisitedLesson.title}
                  </h3>
                  <p className="text-sm text-stone-600">
                    {lastVisitedLesson.category} ·{" "}
                    {lastVisitedLesson.difficulty}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-serif text-stone-800 mb-5 pb-2 border-b border-stone-300">
            Recent Problems
          </h2>
          <div className="space-y-3">
            {problems
              .slice(-3)
              .reverse()
              .map((problem) => (
                <div
                  key={problem.id}
                  className="border border-stone-200 p-4 hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-stone-800 mb-1">
                        {problem.title}
                      </h3>
                      <p className="text-xs text-stone-600">
                        {problem.category} · {problem.platform}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 border ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            {problems.length === 0 && (
              <p className="text-stone-500 italic text-center py-12 text-sm">
                Begin your journey
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-serif text-stone-800 mb-5 pb-2 border-b border-stone-300">
            Favorite Resources
          </h2>
          <div className="space-y-3">
            {resources
              .filter((r) => r.isFavorite)
              .slice(0, 3)
              .map((resource) => (
                <div
                  key={resource.id}
                  className="border border-stone-200 p-4 hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-amber-700 fill-amber-700" />
                    <div className="flex-1">
                      <h3 className="font-serif text-stone-800 text-sm">
                        {resource.resourceName}
                      </h3>
                      <p className="text-xs text-stone-600">
                        {resource.resourceType}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            {resources.filter((r) => r.isFavorite).length === 0 && (
              <p className="text-stone-500 italic text-center py-12 text-sm">
                Mark favorites
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="min-h-[calc(100vh-4rem)]">
        {currentPage === "home" && renderHomePage()}

        {currentPage === "lessons" && (
          <LessonsPage
            lessonData={lessonData}
            completedLessons={completedLessons}
            onMarkComplete={markLessonComplete}
            getDifficultyColor={getDifficultyColor}
          />
        )}

        {currentPage === "problems" && (
          <ProblemsPage
            problems={problems}
            onOpenModal={openModal}
            onDeleteItem={deleteItem}
            getDifficultyColor={getDifficultyColor}
          />
        )}

        {currentPage === "resources" && (
          <ResourcesPage
            resources={resources}
            onOpenModal={openModal}
            onDeleteItem={deleteItem}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {currentPage === "notes" && (
          <NotesPage
            notes={notes}
            onOpenModal={openModal}
            onDeleteItem={deleteItem}
          />
        )}
      </div>

      {showModal && (
        <Modal
          type={modalType}
          formData={formData}
          onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
