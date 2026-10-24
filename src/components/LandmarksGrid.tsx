"use client";

import React from "react";
import { ChevronRight, Quote, Users } from "lucide-react";
import { LANDMARK_CASES } from "@/lib/landmarks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LandmarksGridProps {
  onSelectCase: (tid: string) => void;
  onSearchQuery?: (query: string) => void;
}

export function LandmarksGrid({ onSelectCase }: LandmarksGridProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#710c23] mb-1 font-sans">
            Constitutional Jurisprudence
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Landmark Supreme Court Judgments
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Foundational precedents shaping Indian Constitutional law, fundamental rights, and civil liberties.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LANDMARK_CASES.map((landmark) => (
          <Card
            key={landmark.id}
            onClick={() => onSelectCase(landmark.id)}
            className="group bg-white hover:bg-slate-50/70 border-slate-200 hover:border-slate-300 transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-sm"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-2.5">
                {/* Year & Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-sans px-2 py-0.5 border-slate-300 text-slate-700 bg-slate-50 font-semibold"
                  >
                    {landmark.year}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Record #{landmark.id}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#710c23] transition-colors line-clamp-2 leading-snug">
                  {landmark.title}
                </h3>

                {/* Citation */}
                <div className="flex items-center gap-1.5 text-xs text-[#710c23] font-mono font-medium">
                  <Quote className="size-3 text-[#710c23] shrink-0" />
                  <span className="truncate">{landmark.citation}</span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                  {landmark.summary}
                </p>

                {/* Bench */}
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 font-sans">
                  <Users className="size-3 text-slate-400 shrink-0" />
                  <span className="truncate">{landmark.bench}</span>
                </div>
              </div>

              {/* Bottom Tags & Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {landmark.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-xs font-semibold text-[#710c23] group-hover:translate-x-0.5 transition-transform font-sans">
                  <span>Read True Copy</span>
                  <ChevronRight className="size-3.5 ml-0.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
