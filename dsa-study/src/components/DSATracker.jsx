import React, { useState, useEffect } from "react";
import { BookOpen, Code, Star, Check, ChevronRight, Clock } from "lucide-react";
import lessonData from "./lesson-data.json";
import Modal from "./Modal";
import Navbar from "./Navbar";
import LessonsPage from "./Lessons/LessonsPage";
import ProblemsPage from "./Lessons/ProblemsPage";
import ResourcesPage from "./ResourcesPage";
import NotesPage from "./NotesPage";
import { problemsAPI } from "../services/api";

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
        problems.filter(
          (p) => new Date(p.completedAt).toISOString().split("T")[0] === dateStr
        ).length +
        completedLessons.filter(
          (l) => new Date(l.completedAt).toISOString().split("T")[0] === dateStr
        ).length;
      activity.push({ date: dateStr, count });
    }
    return activity;
  };

  const activityData = generateActivityData();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apiProblems, r, n, l, lastLesson] = await Promise.all([
        problemsAPI.getAll().catch(() => []),
        window.storage.get("dsa-resources").catch(() => null),
        window.storage.get("dsa-notes").catch(() => null),
        window.storage.get("dsa-completed-lessons").catch(() => null),
        window.storage.get("dsa-last-visited-lesson").catch(() => null),
      ]);
      if (apiProblems) setProblems(apiProblems);
      if (r?.value) setResources(JSON.parse(r.value));
      if (n?.value) setNotes(JSON.parse(n.value));
      if (l?.value) setCompletedLessons(JSON.parse(l.value));
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
      const updated = [
        ...completedLessons,
        { lessonId, completedAt: new Date().toISOString() },
      ];
      setCompletedLessons(updated);
      await saveData("completed-lessons", updated);
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
      const newResource = {
        id: editingId || Date.now(),
        resourceName: formData.resourceName,
        resourceType: formData.resourceType,
        resourceLink: formData.resourceLink,
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
    if (type === "problem") {
      const updated = problems.filter((p) => p.id !== id);
      setProblems(updated);
      await saveData("problems", updated);
    } else if (type === "resource") {
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
          modalType={modalType}
          editingId={editingId}
          formData={formData}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          onFormChange={setFormData}
        />
      )}
    </div>
  );
}
