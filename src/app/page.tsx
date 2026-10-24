"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { SearchHero } from "@/components/SearchHero";
import { SearchResults } from "@/components/SearchResults";
import { JudgmentReader } from "@/components/JudgmentReader";
import { LandmarksGrid } from "@/components/LandmarksGrid";
import { SearchResult, CaseDocument } from "@/lib/types";
import { Scale, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [view, setView] = useState<"home" | "results" | "reader">("home");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Document Reader state
  const [activeDoc, setActiveDoc] = useState<CaseDocument | null>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  // Cached search filter options for pagination
  const [searchFilterParams, setSearchFilterParams] = useState<{
    query: string;
    title?: string;
    citation?: string;
    author?: string;
    bench?: string;
    fromDate?: string;
    toDate?: string;
    doctype?: string;
    scope?: "all" | "title" | "body";
  }>({ query: "" });

  const executeSearch = async (
    params: {
      query: string;
      title?: string;
      citation?: string;
      author?: string;
      bench?: string;
      fromDate?: string;
      toDate?: string;
      doctype?: string;
      scope?: "all" | "title" | "body";
    },
    page = 0
  ) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(page);
    setSearchFilterParams(params);
    setCurrentQuery(params.query || params.title || params.citation || "");

    try {
      const urlParams = new URLSearchParams();
      if (params.query) urlParams.set("q", params.query);
      if (params.title) urlParams.set("title", params.title);
      if (params.citation) urlParams.set("citation", params.citation);
      if (params.author) urlParams.set("author", params.author);
      if (params.bench) urlParams.set("bench", params.bench);
      if (params.fromDate) urlParams.set("fromDate", params.fromDate);
      if (params.toDate) urlParams.set("toDate", params.toDate);
      if (params.doctype) urlParams.set("doctype", params.doctype);
      if (params.scope) urlParams.set("scope", params.scope);
      urlParams.set("page", page.toString());

      const res = await fetch(`/api/search?${urlParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch judgments (${res.status})`);
      }
      const data = await res.json();
      setResults(data.results || []);
      setTotalFound(data.totalFound || 0);
      setView("results");
    } catch (err: unknown) {
      console.error("Search error:", err);
      const msg = err instanceof Error ? err.message : "Failed to load judgments";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCase = async (tid: string) => {
    setIsLoadingDoc(true);
    setError(null);

    try {
      const res = await fetch(`/api/doc/${tid}`);
      if (!res.ok) {
        throw new Error(`Failed to load judgment (${res.status})`);
      }
      const docData: CaseDocument = await res.json();
      setActiveDoc(docData);
      setView("reader");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Doc error:", err);
      const msg = err instanceof Error ? err.message : "Failed to fetch document";
      setError(msg);
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    executeSearch(searchFilterParams, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setView("home");
    setActiveDoc(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Global Navigation */}
      <Header
        onReset={handleReset}
        onSelectLandmarks={() => {
          setView("home");
          const el = document.getElementById("landmarks-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="h-7 text-xs text-red-700 hover:bg-red-100"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Global Loading Overlay for Doc Fetching */}
        {isLoadingDoc && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="size-12 rounded-xl bg-[#710c23] flex items-center justify-center text-white mb-4 shadow-sm">
              <Scale className="size-6" />
            </div>
            <div className="size-5 border-2 border-slate-300 border-t-[#710c23] rounded-full animate-spin mb-3" />
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Retrieving Authenticated Judgment...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Parsing coram composition, reported citations, and statutory cross-references
            </p>
          </div>
        )}

        {/* View 1: Home View (Hero Search + Landmarks Grid) */}
        {view === "home" && (
          <div>
            <SearchHero
              onSearch={(params) => executeSearch(params, 0)}
              isLoading={isLoading}
            />

            <div id="landmarks-section" className="mt-4">
              <LandmarksGrid
                onSelectCase={handleSelectCase}
                onSearchQuery={(q) => executeSearch({ query: q }, 0)}
              />
            </div>

            {/* Coverage & Institutional Reference Banner */}
            <div className="max-w-6xl mx-auto px-4 mt-10">
              <div className="rounded-xl bg-white border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#710c23]">
                    <ShieldCheck className="size-4" />
                    <span>Complete Supreme Court of India Jurisdiction</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    Comprehensive Case Coverage (1950 – Present)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    JurisIQ provides unrestricted access to the entire historical archive of the Supreme Court of India—including Constitutional Benches, 3-judge benches, division benches, review petitions, and orders. Every judgment is linked with its equivalent SCC, AIR, and SCR law report citations.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href="https://scr.sci.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-800 transition-colors"
                  >
                    Supreme Court e-SCR
                  </a>
                  <Button
                    onClick={() => {
                      const el = document.getElementById("landmarks-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-[#710c23] hover:bg-[#850e2a] text-white font-medium text-xs px-4 py-2.5 rounded-lg cursor-pointer"
                  >
                    View Landmark Decisions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Search Results View */}
        {view === "results" && (
          <div>
            <div className="border-b border-slate-200">
              <SearchHero
                onSearch={(params) => executeSearch(params, 0)}
                isLoading={isLoading}
              />
            </div>

            <SearchResults
              results={results}
              totalFound={totalFound}
              query={currentQuery}
              currentPage={currentPage}
              isLoading={isLoading}
              onSelectCase={handleSelectCase}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* View 3: Document Reader View */}
        {view === "reader" && activeDoc && (
          <JudgmentReader
            doc={activeDoc}
            onBack={() => {
              setView(results.length > 0 ? "results" : "home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenPrecedent={handleSelectCase}
          />
        )}
      </main>

      {/* Clean Legal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-sans print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-900">JurisIQ</span>
            <span>— Supreme Court Law Reports & Precedent Research</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Apex Court Case Law (1950 – 2026)</span>
            <span>•</span>
            <a
              href="https://scr.sci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#710c23] transition-colors"
            >
              Supreme Court e-SCR
            </a>
            <span>•</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
