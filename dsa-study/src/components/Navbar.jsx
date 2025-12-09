import React from "react";
import { BookOpen, Code, FileText, Home, Star, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ currentPage, onNavigate }) {
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "lessons", label: "Lessons", icon: BookOpen, path: "/lessons" },
    { id: "problems", label: "Problems", icon: Code, path: "/problems" },
    { id: "resources", label: "Resources", icon: Star, path: "/resources" },
    { id: "notes", label: "Notes", icon: FileText, path: "/notes" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <nav className="bg-stone-800 border-b-2 border-stone-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - Clickable to Home */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 border-2 border-stone-300 flex items-center justify-center">
              <Code className="w-5 h-5 text-stone-300" />
            </div>
            <span className="text-stone-100 font-serif text-lg tracking-wide">
              DSA Journal
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                              (item.path === "/lessons" && location.pathname.startsWith("/lessons/")) ||
                              currentPage === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-serif tracking-wide transition-colors ${
                    isActive
                      ? "bg-stone-700 text-stone-50"
                      : "text-stone-300 hover:bg-stone-700 hover:text-stone-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
