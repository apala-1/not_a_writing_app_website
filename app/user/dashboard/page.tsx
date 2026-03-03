"use client";

import React, { useState } from "react";
import FeedTab from "../_components/FeedTab";
import BooksTab from "../_components/BooksTab";
import ExploreTab from "../_components/ExploreTab";
import CreateBookTab from "../_components/CreateBookTab";
import { LayoutDashboard, BookOpen, Compass, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "feed" | "books" | "explore" | "create"
  >("feed");

  const tabs = [
    { id: "feed", label: "Feed", icon: LayoutDashboard },
    { id: "books", label: "My Books", icon: BookOpen },
    { id: "explore", label: "Explore Books", icon: Compass },
    { id: "create", label: "Create Book", icon: PlusCircle },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200/60 p-6 flex flex-col gap-8 sticky top-0 h-screen">
          <div className="px-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              Library
            </h2>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-medium">Main Menu</p>
          </div>

          <nav className="space-y-2 flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? "text-white shadow-lg shadow-orange-200" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {/* Background Layer for Active State */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl -z-10" />
                  )}
                  
                  <Icon 
                    size={20} 
                    className={`transition-colors ${isActive ? "text-white" : "group-hover:text-orange-500"}`} 
                  />
                  <span className="font-medium">{tab.label}</span>
                  
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Optional: User / Upgrade Prompt in Sidebar */}
          <div className="mt-auto p-4 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl border border-orange-100/50">
            <p className="text-sm font-semibold text-orange-800">New Feature!</p>
            <p className="text-xs text-orange-700/70 mt-1">Try our AI-powered book recommendations.</p>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto bg-gradient-to-r from-orange-300 to-rose-400">

          <div className="backdrop-blur-sm rounded-3xl min-h-[calc(100vh-200px)]">
            {activeTab === "feed" && <FeedTab />}
            {activeTab === "books" && <BooksTab />}
            {activeTab === "explore" && <ExploreTab />}
            {activeTab === "create" && <CreateBookTab />}
          </div>
        </div>
      </div>
    </main>
  );
}
