"use client";

import React, { useState } from "react";
import FeedTab from "../_components/FeedTab";
import BooksTab from "../_components/BooksTab";
import ExploreTab from "../_components/ExploreTab";
import CreateBookTab from "../_components/CreateBookTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "feed" | "books" | "explore" | "create"
  >("feed");

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <div className="w-64 border-r bg-white p-6 space-y-4">
          <button
            onClick={() => setActiveTab("feed")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "feed" ? "bg-orange-100 font-semibold" : ""
            }`}
          >
            Feed
          </button>

          <button
            onClick={() => setActiveTab("books")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "books" ? "bg-orange-100 font-semibold" : ""
            }`}
          >
            My Books
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "explore" ? "bg-orange-100 font-semibold" : ""
            }`}
          >
            Explore Books
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "create" ? "bg-orange-100 font-semibold" : ""
            }`}
          >
            Create Book
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === "feed" && <FeedTab />}
          {activeTab === "books" && <BooksTab />}
          {activeTab === "explore" && <ExploreTab />}
          {activeTab === "create" && <CreateBookTab />}
        </div>
      </div>
    </main>
  );
}