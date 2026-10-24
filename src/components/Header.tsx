"use client";

import React from "react";
import { Scale, BookOpen, ExternalLink, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onReset?: () => void;
  onSelectLandmarks?: () => void;
}

export function Header({ onReset, onSelectLandmarks }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="size-9 rounded-lg bg-[#710c23] flex items-center justify-center text-white shadow-xs">
            <Scale className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900 group-hover:text-[#710c23] transition-colors">
                Juris<span className="text-[#710c23]">IQ</span>
              </span>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 border-slate-300 text-slate-700 bg-slate-100 font-sans tracking-wide uppercase font-semibold"
              >
                SC Reports
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-sans">
              Supreme Court of India • Legal Research & Judgment System
            </p>
          </div>
        </div>

        {/* Right Nav & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectLandmarks}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#710c23] transition-colors px-3 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <BookOpen className="size-3.5 text-slate-500" />
            <span className="hidden md:inline">Landmark Benches</span>
          </button>

          <a
            href="https://scr.sci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
            title="Supreme Court Electronic Reports Portal"
          >
            <ExternalLink className="size-3.5 text-slate-500" />
            <span className="hidden md:inline">e-SCR Portal</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
            <Shield className="size-3 text-[#710c23]" />
            <span>1950 – 2026 Archive</span>
          </div>
        </div>
      </div>
    </header>
  );
}
