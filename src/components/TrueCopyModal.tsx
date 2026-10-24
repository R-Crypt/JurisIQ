"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CaseDocument } from "@/lib/types";
import { Printer, Download, X, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrueCopyModalProps {
  doc: CaseDocument;
  isOpen: boolean;
  onClose: () => void;
}

export function TrueCopyModal({ doc, isOpen, onClose }: TrueCopyModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      // Generate QR code pointing to official court verification record
      const verificationUrl = doc.escrUrl || `https://www.sci.gov.in/judgments?case=${encodeURIComponent(doc.tid)}`;
      QRCode.toDataURL(verificationUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [isOpen, doc]);

  if (!isOpen) return null;

  // Split title into petitioner and respondent if "v." or "vs" present
  let petitioner = doc.title;
  let respondent = "State / Union of India";
  const vsMatch = doc.title.match(/(.+?)\s+(?:v\.|vs|versus)\s+(.+)/i);
  if (vsMatch) {
    petitioner = vsMatch[1].trim();
    respondent = vsMatch[2].trim();
  }

  // Parse reserved and pronounced dates or publication date
  let decisionDate = doc.publishdate || "N/A";
  const dateMatch = doc.title.match(/on\s+(\d+\s+[A-Za-z]+,\s+\d{4})/i);
  if (dateMatch) {
    decisionDate = dateMatch[1];
  }

  // Clean bench string to remove markdown links or URLs
  const cleanBench = (doc.bench || "THE HONOURABLE CHIEF JUSTICE & JUSTICES OF THE APEX COURT")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/Indian\s*Kanoon/gi, "")
    .trim();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex justify-center p-2 sm:p-6 print:p-0 print:bg-white print:static">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="sticky top-0 z-30 bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-emerald-400" />
            <span className="font-serif font-bold text-sm tracking-wide">
              Official Certified Web Copy (True Copy)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-[#710c23] hover:bg-[#8e0f2c] text-white text-xs h-8 px-4 rounded-md font-medium cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Download className="size-3.5" />
              <span>Download True Copy (PDF)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white text-xs h-8 px-3 rounded-md cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">Print Copy</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
              title="Close viewer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Certified True Copy Sheet (Mirrors authentic Indian High Court / Supreme Court web copy) */}
        <div className="p-8 sm:p-14 bg-white text-slate-900 font-serif leading-relaxed relative print:p-8">
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.035] overflow-hidden">
            <div className="text-[130px] font-bold uppercase tracking-widest text-slate-900 -rotate-45 font-sans whitespace-nowrap">
              TRUE COPY • WEB COPY
            </div>
          </div>

          {/* Top Court Header Block with Emblem Seal & QR Code */}
          <div className="flex items-start justify-between border-b-2 border-slate-900/80 pb-6 mb-6">
            {/* Left: Official WEB COPY Stamp & Record Verification (No Logo) */}
            <div className="flex flex-col items-start gap-1">
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest uppercase text-slate-700/90 block">
                  WEB COPY
                </span>
                <span className="text-[10px] font-sans font-semibold text-slate-600 uppercase tracking-wider block mt-0.5">
                  DIGITALLY VERIFIED RECORD • TRUE COPY
                </span>
                <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                  Reference: SC-{doc.tid}
                </span>
              </div>
            </div>

            {/* Right: Order QR Code & Case Record No */}
            <div className="text-right flex flex-col items-end">
              <div className="flex flex-col items-center border border-slate-300 p-1 rounded-sm bg-white shadow-2xs mb-1.5">
                <span className="text-[9px] font-sans font-bold text-slate-700 uppercase tracking-wider">
                  Order QR
                </span>
                {qrDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={qrDataUrl}
                    alt="Order Verification QR"
                    className="size-16 object-contain"
                  />
                ) : (
                  <div className="size-16 bg-slate-100 animate-pulse" />
                )}
              </div>
              <span className="text-xs italic text-slate-700 font-serif font-medium">
                Record No. {doc.tid} of {decisionDate.split(",")[1]?.trim() || "Supreme Court"}
              </span>
            </div>
          </div>

          {/* Heading: In the Supreme Court of India */}
          <div className="text-center space-y-1 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-900">
              IN THE SUPREME COURT OF INDIA
            </h2>
            <p className="text-xs font-sans tracking-widest text-slate-600 uppercase font-semibold">
              ORIGINAL / APPELLATE JURISDICTION
            </p>
            <div className="text-xs pt-2 space-y-0.5 text-slate-700 font-sans">
              <p>
                <span className="font-semibold">PRONOUNCED ON :</span> {decisionDate}
              </p>
            </div>
          </div>

          {/* CORAM Block */}
          <div className="text-center mb-8 border-y border-slate-200 py-3 bg-slate-50/50 print:bg-transparent">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-1">
              CORAM
            </p>
            <p className="text-sm font-bold uppercase text-slate-900 leading-snug">
              {cleanBench}
            </p>
          </div>

          {/* Citations Reference */}
          {doc.citation && (
            <div className="mb-6 p-2.5 rounded-sm bg-slate-50 border border-slate-200 text-xs font-mono text-center text-slate-800">
              <span className="font-sans font-bold text-slate-600 mr-1 uppercase">
                Law Report Citations:
              </span>
              {doc.citation}
            </div>
          )}

          {/* Parties Layout (Applicant / Petitioner vs Respondent) */}
          <div className="space-y-4 mb-8 text-sm text-slate-900">
            <div>
              <p className="font-bold">{petitioner}</p>
              <p className="text-right text-xs italic font-semibold text-slate-600">
                ....Petitioner(s) / Appellant(s)
              </p>
            </div>

            <div className="text-center font-bold text-sm my-2 italic">
              Vs
            </div>

            <div>
              <p className="font-bold">{respondent}</p>
              <p className="text-right text-xs italic font-semibold text-slate-600">
                ....Respondent(s)
              </p>
            </div>
          </div>

          {/* Prayer Section */}
          <div className="mb-8 text-xs sm:text-sm text-slate-800 border-l-2 border-slate-800 pl-4 py-1 italic bg-slate-50/40 print:bg-transparent">
            <span className="font-bold not-italic font-sans text-xs uppercase tracking-wider block text-slate-900 mb-1">
              Subject & Prayer:
            </span>
            Petition under Article 32 / Article 136 of the Constitution of India challenging judgment and order for constitutional determination and legal relief.
          </div>

          {/* Judgment Body */}
          <div className="pt-4 border-t border-slate-300">
            <h3 className="text-center font-bold text-base uppercase tracking-wider text-slate-900 mb-6">
              JUDGMENT
            </h3>

            {/* Parsed verbatim judgment content */}
            <div
              className="judgment-content text-justify text-sm sm:text-base leading-relaxed text-slate-900 space-y-4"
              dangerouslySetInnerHTML={{ __html: doc.doc }}
            />
          </div>

          {/* Certified Footer */}
          <div className="mt-14 pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-sans">
            <div>
              <span>https://www.sci.gov.in/judgments</span>
              <span className="ml-2">( Authenticated Court True Copy )</span>
            </div>
            <div>
              <span>Digitally Certified Record</span>
              <span className="ml-2">•</span>
              <span className="ml-2 font-mono">SC ID #{doc.tid}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
