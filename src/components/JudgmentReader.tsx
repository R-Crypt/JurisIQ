"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Printer,
  Copy,
  Check,
  BookOpen,
  Scale,
  Users,
  Quote,
  FileCheck2,
  Building2,
  ExternalLink,
} from "lucide-react";
import { CaseDocument } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrueCopyModal } from "@/components/TrueCopyModal";

interface JudgmentReaderProps {
  doc: CaseDocument;
  onBack: () => void;
  onOpenPrecedent: (tid: string) => void;
}

export function JudgmentReader({
  doc,
  onBack,
  onOpenPrecedent,
}: JudgmentReaderProps) {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [activeTab, setActiveTab] = useState("judgment");
  const [showTrueCopy, setShowTrueCopy] = useState(false);

  const handleCopyCitation = () => {
    const textToCopy = doc.citation || doc.title;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(doc.title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const fontSizeClasses = {
    sm: "text-sm leading-relaxed",
    md: "text-base leading-relaxed",
    lg: "text-lg leading-loose",
    xl: "text-xl leading-loose",
  };

  return (
    <>
      <div
        className={`max-w-5xl mx-auto px-4 py-6 print:p-0 print:max-w-none ${
          showTrueCopy ? "print:hidden" : ""
        }`}
      >
        {/* Top Toolbar (Hidden when printing) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-slate-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer -ml-2"
        >
          <ArrowLeft className="size-4 mr-1.5" />
          <span>Back to Search</span>
        </Button>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Font switcher */}
          <div className="flex items-center rounded-md bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setFontFamily("serif")}
              className={`px-2.5 py-1 text-xs rounded-sm font-serif transition-colors ${
                fontFamily === "serif"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Serif Law Report Font"
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily("sans")}
              className={`px-2.5 py-1 text-xs rounded-sm font-sans transition-colors ${
                fontFamily === "sans"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Sans Modern Font"
            >
              Sans
            </button>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center rounded-md bg-slate-100 p-0.5 border border-slate-200">
            {(["sm", "md", "lg", "xl"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-0.5 text-xs rounded-sm uppercase font-sans transition-colors ${
                  fontSize === size
                    ? "bg-white text-[#710c23] shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Download True Copy Button */}
          <Button
            size="sm"
            onClick={() => setShowTrueCopy(true)}
            className="bg-[#710c23] hover:bg-[#850e2a] text-white text-xs h-8 px-3 rounded-md font-medium cursor-pointer shadow-xs flex items-center gap-1.5"
            title="Download certified court copy with official seal and order QR code"
          >
            <FileCheck2 className="size-3.5" />
            <span>Download True Copy</span>
          </Button>

          {/* Print Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs h-8 border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="size-3.5 mr-1.5 text-slate-600" />
            <span>Print / PDF</span>
          </Button>

          {/* Copy Citation */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCitation}
            className="text-xs h-8 border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {copiedCitation ? (
              <>
                <Check className="size-3.5 mr-1.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 mr-1.5 text-slate-500" />
                <span>Copy Citation</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Case Header Card — Designed like an authentic law report */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 mb-6 shadow-xs relative overflow-hidden print:border-none print:shadow-none print:p-0">
        <div className="text-center pb-5 mb-5 border-b border-slate-200">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 font-sans mb-1">
            IN THE SUPREME COURT OF INDIA
          </p>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge
              variant="outline"
              className="text-[11px] px-2.5 py-0.5 bg-slate-100 border-slate-200 text-slate-800 font-medium font-sans"
            >
              <Building2 className="size-3 mr-1 text-[#710c23]" />
              {doc.docsource || "Supreme Court of India"}
            </Badge>
            <button
              onClick={() => setShowTrueCopy(true)}
              className="inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors font-sans"
              title="Click to view and download official court certified True Copy"
            >
              <FileCheck2 className="size-3 mr-1 text-emerald-600" />
              <span>Certified True Copy Available</span>
            </button>
          </div>

          {/* Case Title */}
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug max-w-3xl mx-auto">
            {doc.title}
          </h1>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Equivalent Citations */}
          {doc.citation ? (
            <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
              <Quote className="size-4 text-[#710c23] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold font-sans">
                  Equivalent Citations (SCC / AIR / SCR)
                </span>
                <span className="font-mono text-slate-900 font-semibold select-all text-xs sm:text-sm">
                  {doc.citation}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
              <Quote className="size-4 text-[#710c23] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold font-sans">
                  Court Record Number
                </span>
                <span className="font-mono text-slate-900 font-medium">
                  Apex Court Record #{doc.tid}
                </span>
              </div>
            </div>
          )}

          {/* Bench / Coram */}
          {doc.bench && (
            <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
              <Users className="size-4 text-[#710c23] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold font-sans">
                  Coram / Bench Composition
                </span>
                <span className="text-slate-900 font-medium text-xs sm:text-sm">
                  {doc.bench}
                </span>
              </div>
            </div>
          )}

          {/* Cites & Cited By Stats */}
          <div className="flex items-center gap-3 pt-1 md:col-span-2 text-xs font-sans">
            {doc.citedByCount !== undefined && doc.citedByCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                Cited by {doc.citedByCount} subsequent judgments
              </span>
            )}
            {doc.citesCount !== undefined && doc.citesCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                <BookOpen className="size-3 text-slate-500" />
                Cites {doc.citesCount} legal authorities
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs (Hidden in print) */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full print:hidden"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 mb-6">
          <TabsList className="bg-slate-100 p-1 rounded-lg">
            <TabsTrigger
              value="judgment"
              className="text-xs sm:text-sm flex items-center gap-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-[#710c23] data-[state=active]:shadow-xs data-[state=active]:font-semibold"
            >
              <Scale className="size-4" />
              <span>Full Judgment Text</span>
            </TabsTrigger>
            <TabsTrigger
              value="precedents"
              className="text-xs sm:text-sm flex items-center gap-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-[#710c23] data-[state=active]:shadow-xs data-[state=active]:font-semibold"
            >
              <BookOpen className="size-4" />
              <span>
                Cited Authorities (
                {doc.citationsInText?.length || 0})
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="intelligence"
              className="text-xs sm:text-sm flex items-center gap-2 cursor-pointer data-[state=active]:bg-white data-[state=active]:text-[#710c23] data-[state=active]:shadow-xs data-[state=active]:font-semibold"
            >
              <span>Case Summary & Brief</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Full Judgment Text */}
        <TabsContent value="judgment" className="outline-none focus:ring-0">
          <div
            className={`rounded-xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs ${
              fontFamily === "serif" ? "font-serif" : "font-sans"
            }`}
          >
            {/* Notice Bar */}
            <div className="mb-6 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-sans">
              <div>
                <span className="font-semibold text-slate-900 mr-1.5">
                  Precedent Cross-References:
                </span>
                Click any hyperlinked statutory section or cited precedent to inspect that reference.
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyTitle}
                className="text-[11px] h-7 px-2 text-slate-600 hover:text-slate-900"
              >
                {copiedTitle ? "Copied!" : "Copy Title"}
              </Button>
            </div>

            {/* In-Judgment Text Rendering */}
            <div
              className={`judgment-content ${fontSizeClasses[fontSize]}`}
              dangerouslySetInnerHTML={{ __html: doc.doc }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                const link = target.closest("a[data-juris-tid]");
                if (link) {
                  e.preventDefault();
                  const tid = link.getAttribute("data-juris-tid");
                  if (tid) {
                    onOpenPrecedent(tid);
                  }
                }
              }}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Cited Authorities & Precedents */}
        <TabsContent value="precedents" className="outline-none focus:ring-0">
          <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
                Statutes & Precedents Cited in this Judgment
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Statutory sections, constitutional articles, and prior rulings cited by the bench during adjudication.
              </p>
            </div>

            {doc.citationsInText && doc.citationsInText.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doc.citationsInText.map((cit) => (
                  <button
                    key={cit.tid}
                    onClick={() => onOpenPrecedent(cit.tid)}
                    className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-left transition-all cursor-pointer group flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-[#710c23] transition-colors block">
                        {cit.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Record ID #{cit.tid}
                      </span>
                    </div>
                    <ExternalLink className="size-3.5 text-slate-400 group-hover:text-[#710c23] shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 font-sans">
                No external citation links extracted. Refer to the Full Judgment Text tab.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Case Intelligence & Research Notes */}
        <TabsContent value="intelligence" className="outline-none focus:ring-0">
          <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
                Case Summary & Research Brief
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Essential reference data for advocates, legal clerks, and judicial research.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Bench Composition
                </span>
                <p className="text-xs text-slate-900 leading-relaxed font-medium">
                  {doc.bench || "Supreme Court of India"}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Reported Citations
                </span>
                <p className="text-xs font-mono text-slate-900 select-all leading-relaxed font-semibold">
                  {doc.citation || "Direct Supreme Court Record"}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Binding Effect
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Binding on all courts and tribunals in India pursuant to Article 141 of the Constitution of India.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-950 block">
                    Supreme Court e-SCR Repository
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-xs font-bold">
                    Official Source
                  </span>
                </div>
                {doc.escrCitation && (
                  <p className="text-xs font-mono font-bold text-[#710c23] mb-1">
                    e-SCR Citation: {doc.escrCitation}
                  </p>
                )}
                <p className="text-[11px] text-emerald-800/90 mb-2.5">
                  Access digitized case records directly from the official Supreme Court Reports portal.
                </p>
                <a
                  href={doc.escrUrl || "https://scr.sci.gov.in/scrsearch/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white bg-[#710c23] hover:bg-[#850e2a] px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <span>Source from scr.sci.gov.in</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Print-only layout */}
      <div className="hidden print:block font-serif text-black leading-relaxed">
        <div className="text-center border-b pb-4 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            IN THE SUPREME COURT OF INDIA
          </h2>
          <h1 className="text-lg font-bold mt-2">{doc.title}</h1>
          {doc.citation && (
            <p className="text-xs italic mt-1 font-mono">{doc.citation}</p>
          )}
          {doc.bench && <p className="text-xs mt-1">Bench: {doc.bench}</p>}
        </div>
        <div
          className="judgment-print text-xs leading-relaxed"
          dangerouslySetInnerHTML={{ __html: doc.doc }}
        />
      </div>
    </div>

    {/* Certified True Copy Modal */}
    <TrueCopyModal
      doc={doc}
      isOpen={showTrueCopy}
      onClose={() => setShowTrueCopy(false)}
    />
  </>
);
}
