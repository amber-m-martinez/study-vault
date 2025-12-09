import React, { useState, useEffect } from "react";
import { Settings, Plus, X, Save, GripVertical } from "lucide-react";
import { settingsAPI, categoriesAPI } from "../services/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appName: "Study Tracker",
    studySubject: "Data Structures & Algorithms",
    categoryLabel: "Topic",
    categoryLabelPlural: "Topics",
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
    loadCategories();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      if (data) {
        setSettings({
          appName: data.app_name || data.appName || "Study Tracker",
          studySubject: data.study_subject || data.studySubject || "Data Structures & Algorithms",
          categoryLabel: data.category_label || data.categoryLabel || "Topic",
          categoryLabelPlural: data.category_label_plural || data.categoryLabelPlural || "Topics",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await settingsAPI.update(settings);
      alert("Settings saved! Refresh the page to see changes throughout the app.");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const result = await categoriesAPI.create({ name: newCategory.trim() });
      setCategories([...categories, { id: result.id, name: newCategory.trim() }]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category - it may already exist");
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editingName.trim()) return;

    try {
      await categoriesAPI.update(id, { name: editingName.trim() });
      setCategories(categories.map((c) => (c.id === id ? { ...c, name: editingName.trim() } : c)));
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-stone-300">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-stone-800" />
            <h1 className="text-3xl font-serif text-stone-800">Settings</h1>
          </div>
          <p className="text-sm text-stone-600 mt-2">
            Customize your study tracker to match what you're learning
          </p>
        </div>

        {/* General Settings */}
        <div className="bg-white border border-stone-300 p-6 mb-6">
          <h2 className="text-xl font-serif text-stone-800 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-700 mb-2">
                App Name
              </label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
                placeholder="e.g., Study Tracker, Learning Dashboard"
              />
              <p className="text-xs text-stone-500 mt-1">
                This will appear in the navigation and page title
              </p>
            </div>

            <div>
              <label className="block text-sm text-stone-700 mb-2">
                What are you studying?
              </label>
              <input
                type="text"
                value={settings.studySubject}
                onChange={(e) => setSettings({ ...settings, studySubject: e.target.value })}
                className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
                placeholder="e.g., Piano, Spanish, Physics, Web Development"
              />
              <p className="text-xs text-stone-500 mt-1">
                The main subject or skill you're learning
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-stone-700 mb-2">
                  Category Label (Singular)
                </label>
                <input
                  type="text"
                  value={settings.categoryLabel}
                  onChange={(e) => setSettings({ ...settings, categoryLabel: e.target.value })}
                  className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
                  placeholder="e.g., Topic, Module, Unit, Lesson"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-700 mb-2">
                  Category Label (Plural)
                </label>
                <input
                  type="text"
                  value={settings.categoryLabelPlural}
                  onChange={(e) => setSettings({ ...settings, categoryLabelPlural: e.target.value })}
                  className="w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
                  placeholder="e.g., Topics, Modules, Units, Lessons"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full bg-stone-800 text-stone-50 py-3 hover:bg-stone-700 flex items-center justify-center gap-2 font-serif text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save General Settings"}
            </button>
          </div>
        </div>

        {/* Categories Management */}
        <div className="bg-white border border-stone-300 p-6">
          <h2 className="text-xl font-serif text-stone-800 mb-4">
            Manage {settings.categoryLabelPlural}
          </h2>
          <p className="text-sm text-stone-600 mb-4">
            Add custom {settings.categoryLabelPlural.toLowerCase()} for organizing your notes and resources
          </p>

          {/* Add New Category */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              className="flex-1 p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
              placeholder={`Add new ${settings.categoryLabel.toLowerCase()}...`}
            />
            <button
              onClick={handleAddCategory}
              className="bg-stone-800 text-stone-50 px-5 py-3 hover:bg-stone-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 border border-stone-200 bg-stone-50 hover:bg-stone-100"
              >
                <GripVertical className="w-4 h-4 text-stone-400" />
                {editingId === category.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleUpdateCategory(category.id)}
                    onBlur={() => handleUpdateCategory(category.id)}
                    className="flex-1 p-2 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 text-stone-800 cursor-pointer"
                    onClick={() => {
                      setEditingId(category.id);
                      setEditingName(category.name);
                    }}
                  >
                    {category.name}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-stone-500 hover:text-red-600"
                  title="Delete category"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-stone-500 italic text-center py-8 text-sm">
                No {settings.categoryLabelPlural.toLowerCase()} yet. Add your first one above!
              </p>
            )}
          </div>

          <div className="mt-4 p-4 bg-stone-100 border border-stone-200">
            <p className="text-xs text-stone-600">
              <strong>Note:</strong> These {settings.categoryLabelPlural.toLowerCase()} will appear
              in dropdowns when creating notes and resources. You can click to edit or drag to
              reorder them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
