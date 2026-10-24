"use client";

import React, { useState } from "react";
import {
  Calendar,
  Building2,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
  Scale,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResult } from "@/lib/types";

interface SearchResultsProps {
  results: SearchResult[];
  totalFound: number;
  query: string;
  currentPage: number;
  isLoading: boolean;
  onSelectCase: (tid: string) => void;
  onPageChange: (newPage: number) => void;
}

export function SearchResults({
  results,
  totalFound,
  query,
  currentPage,
  isLoading,
  onSelectCase,
  onPageChange,
}: SearchResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 bg-slate-200" />
          <Skeleton className="h-5 w-24 bg-slate-200" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-200 bg-white">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4 bg-slate-200" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-28 bg-slate-200" />
                <Skeleton className="h-4 w-32 bg-slate-200" />
              </div>
              <Skeleton className="h-12 w-full bg-slate-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="size-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3">
          <Scale className="size-6 text-[#710c23]" />
        </div>
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
          No Judgments Found
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Try adjusting your query, widening the year range, or searching by landmark case names like &apos;Kesavananda&apos; or &apos;Puttaswamy&apos;.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Results Header / Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 text-xs text-slate-600">
        <div>
          Showing <span className="font-semibold text-slate-900">{results.length}</span> results{" "}
          {totalFound > 0 && (
            <>
              out of <span className="font-semibold text-slate-900">{totalFound.toLocaleString()}</span> Supreme Court records
            </>
          )}{" "}
          for <span className="font-semibold text-[#710c23]">&ldquo;{query}&rdquo;</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[11px] font-sans border-slate-300 text-slate-700 bg-white">
            Page {currentPage + 1}
          </Badge>
        </div>
      </div>

      {/* Case List */}
      <div className="space-y-3">
        {results.map((item) => (
          <Card
            key={item.tid}
            onClick={() => onSelectCase(item.tid)}
            className="group border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 transition-all cursor-pointer shadow-xs hover:shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Case Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 bg-slate-100 border-slate-200 text-slate-800 font-medium"
                    >
                      <Building2 className="size-3 mr-1 text-[#710c23]" />
                      {item.docsource || "Supreme Court of India"}
                    </Badge>
                    {item.publishdate && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-sans">
                        <Calendar className="size-3" />
                        {item.publishdate}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#710c23] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Headline snippet */}
                  {item.headline && (
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 font-sans leading-relaxed">
                      {item.headline}
                    </p>
                  )}

                  {/* Badges: Cites & Cited by */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                    {(item.numcitedby ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <span>•</span>
                        Cited by {item.numcitedby} cases
                      </span>
                    )}
                    {(item.numcites ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <BookOpen className="size-3 text-slate-400" />
                        Cites {item.numcites} authorities
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Action buttons */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0 shrink-0">
                  <Button
                    size="sm"
                    className="bg-[#710c23] hover:bg-[#850e2a] text-white font-medium text-xs h-8 px-3.5 rounded-md shadow-xs cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(item.tid);
                    }}
                  >
                    <span>Read True Copy</span>
                    <ChevronRight className="size-3.5 ml-1" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer"
                    onClick={(e) => handleCopy(e, item.title, item.tid)}
                    title="Copy Case Title"
                  >
                    {copiedId === item.tid ? (
                      <>
                        <Check className="size-3 mr-1 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 mr-1" />
                        <span>Copy Title</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="text-xs border-slate-300 text-slate-700"
        >
          Previous Page
        </Button>
        <span className="text-xs text-slate-500 font-sans">
          Page {currentPage + 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={results.length < 10}
          onClick={() => onPageChange(currentPage + 1)}
          className="text-xs border-slate-300 text-slate-700"
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}
