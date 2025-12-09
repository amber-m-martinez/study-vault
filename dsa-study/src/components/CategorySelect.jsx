import React, { useState, useEffect } from "react";
import { categoriesAPI } from "../services/api";

export default function CategorySelect({ value, onChange, label = "Category", className = "" }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback to defaults if API fails
      setCategories([
        { id: 1, name: "Arrays" },
        { id: 2, name: "Strings" },
        { id: 3, name: "Linked Lists" },
        { id: 4, name: "Stacks" },
        { id: 5, name: "Queues" },
        { id: 6, name: "Hash Maps" },
        { id: 7, name: "Trees" },
        { id: 8, name: "Graphs" },
        { id: 9, name: "Heaps" },
        { id: 10, name: "Tries" },
        { id: 11, name: "Other" },
      ]);
    }
  };

  return (
    <select
      value={value || ""}
      onChange={onChange}
      className={className || "w-full p-3 border border-stone-300 focus:outline-none focus:border-stone-800 bg-white"}
    >
      <option value="">{label}</option>
      {categories.map((category) => (
        <option key={category.id} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
