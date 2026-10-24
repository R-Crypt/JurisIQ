"use client";

import React, { useState } from "react";
import {
  Search,
  BookMarked,
  Filter,
  SlidersHorizontal,
  Calendar,
  User,
  Quote,
  X,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LANDMARK_CASES } from "@/lib/landmarks";

interface SearchHeroProps {
  onSearch: (params: {
    query: string;
    title?: string;
    citation?: string;
    author?: string;
    bench?: string;
    fromDate?: string;
    toDate?: string;
    doctype?: string;
  }) => void;
  isLoading: boolean;
}

export function SearchHero({ onSearch, isLoading }: SearchHeroProps) {
  const [activeTab, setActiveTab] = useState<"general" | "title" | "citation">("general");
  const [query, setQuery] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [citation, setCitation] = useState("");

  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bench, setBench] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [doctype, setDoctype] = useState("supremecourt");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch();
  };

  const triggerSearch = () => {
    let q = "";
    let t = undefined;
    let c = undefined;

    if (activeTab === "general") {
      q = query.trim();
    } else if (activeTab === "title") {
      t = caseTitle.trim();
      q = t;
    } else if (activeTab === "citation") {
      c = citation.trim();
      q = c;
    }

    if (!q && !t && !c) return;

    onSearch({
      query: q,
      title: activeTab === "title" ? t : undefined,
      citation: activeTab === "citation" ? c : undefined,
      bench: bench.trim() || undefined,
      fromDate: fromYear ? `1-1-${fromYear}` : undefined,
      toDate: toYear ? `31-12-${toYear}` : undefined,
      doctype,
    });
  };

  const handleLandmarkClick = (presetQuery: string) => {
    setQuery(presetQuery);
    setActiveTab("general");
    onSearch({
      query: presetQuery,
      doctype: "supremecourt",
    });
  };

  const clearFilters = () => {
    setBench("");
    setFromYear("");
    setToYear("");
    setDoctype("supremecourt");
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 py-10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Institutional Subtitle */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 mb-3">
          <span>Official Apex Court Judgments & Case Intelligence System</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-2">
          Supreme Court Judgment & Citation Search
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          Search the entire Supreme Court of India repository (1950–Present). Access full authenticated judgments, equivalent SCC, AIR & SCR citations, coram records, and precedent analysis.
        </p>

        {/* Search Mode Tabs */}
        <div className="flex items-center justify-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 w-fit mx-auto mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-white text-[#710c23] shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="size-3.5" />
            <span>Topic / Keywords</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("title")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === "title"
                ? "bg-white text-[#710c23] shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Party / Case Name</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("citation")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === "citation"
                ? "bg-white text-[#710c23] shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Quote className="size-3.5" />
            <span>Citation (SCC / AIR / SCR)</span>
          </button>
        </div>

        {/* Main Search Bar Form */}
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <div className="flex items-center p-1.5 rounded-xl bg-white border border-slate-300 shadow-sm focus-within:border-[#710c23] focus-within:ring-2 focus-within:ring-[#710c23]/10 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              {activeTab === "general" && <Search className="size-5 text-[#710c23]" />}
              {activeTab === "title" && <FileText className="size-5 text-[#710c23]" />}
              {activeTab === "citation" && <Quote className="size-5 text-[#710c23]" />}
            </div>

            {/* Dynamic Input based on tab */}
            {activeTab === "general" && (
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subject or proposition (e.g., 'Right to Privacy', 'Anticipatory bail PMLA', 'Arbitration Section 11')..."
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-slate-400 text-slate-900 py-2"
              />
            )}

            {activeTab === "title" && (
              <Input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="Enter party names or case title (e.g., 'Kesavananda Bharati', 'Navtej Singh Johar')..."
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-slate-400 text-slate-900 py-2"
              />
            )}

            {activeTab === "citation" && (
              <Input
                type="text"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
                placeholder="Enter official citation (e.g., '1973 4 SCC 225', 'AIR 2017 SC 4161', '(2018) 10 SCC 1')..."
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-slate-400 text-slate-900 py-2"
              />
            )}

            {/* Advanced Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer mr-1 ${
                showAdvanced || bench || fromYear || toYear
                  ? "bg-[#710c23]/10 text-[#710c23] border border-[#710c23]/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Filters & Bench options"
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#710c23] hover:bg-[#850e2a] text-white font-medium px-5 sm:px-6 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>Search</span>
                </div>
              )}
            </Button>
          </div>

          {/* Advanced Filter Drawer */}
          {showAdvanced && (
            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm text-left grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <User className="size-3 text-[#710c23]" />
                  Judge / Bench Name
                </label>
                <Input
                  type="text"
                  value={bench}
                  onChange={(e) => setBench(e.target.value)}
                  placeholder="e.g. Chandrachud, Khanna"
                  className="bg-white text-xs h-9 border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Calendar className="size-3 text-[#710c23]" />
                  Decision Year (From - To)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="1950"
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                    className="bg-white text-xs h-9 border-slate-300"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <Input
                    type="number"
                    placeholder="2026"
                    value={toYear}
                    onChange={(e) => setToYear(e.target.value)}
                    className="bg-white text-xs h-9 border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Filter className="size-3 text-[#710c23]" />
                  Court Jurisdiction
                </label>
                <div className="flex items-center gap-2 h-9">
                  <select
                    value={doctype}
                    onChange={(e) => setDoctype(e.target.value)}
                    className="w-full h-full px-2.5 rounded-md bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#710c23]"
                  >
                    <option value="supremecourt">Supreme Court of India</option>
                    <option value="judgments">Supreme Court & High Courts</option>
                    <option value="all">All Law Reports</option>
                  </select>
                  {(bench || fromYear || toYear) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-9 px-2 text-xs text-slate-500 hover:text-slate-900"
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Preset Landmark Cases */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
            <BookMarked className="size-3 text-[#710c23]" />
            Landmark Cases:
          </span>
          {LANDMARK_CASES.slice(0, 5).map((landmark) => (
            <button
              key={landmark.id}
              onClick={() => handleLandmarkClick(landmark.query)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-[#710c23] transition-colors cursor-pointer"
            >
              {landmark.title.split(" v. ")[0]} ({landmark.year})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
