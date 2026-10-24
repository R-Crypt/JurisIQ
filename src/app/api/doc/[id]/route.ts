import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const IK_BASE = "https://indiankanoon.org";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Document ID is required" },
      { status: 400 }
    );
  }

  const directUrl = `${IK_BASE}/doc/${id}/`;

  try {
    let html = "";
    let isFromProxy = false;

    // Try direct fetch first
    let response: Response | null = null;
    try {
      response = await fetch(directUrl, { headers: HEADERS });
    } catch {
      response = null;
    }

    if (response && response.ok) {
      html = await response.text();
    } else {
      // Cloudflare 403 fallback: Fetch via Reader Proxy
      isFromProxy = true;
      const proxyUrl = `https://r.jina.ai/${directUrl}`;
      const proxyResponse = await fetch(proxyUrl, {
        headers: {
          Accept: "text/plain",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });

      if (!proxyResponse.ok) {
        return NextResponse.json(
          { error: `Failed to fetch judgment: ${proxyResponse.status}` },
          { status: proxyResponse.status }
        );
      }

      html = await proxyResponse.text();
    }

    // Process Direct HTML response
    if (!isFromProxy) {
      const $ = cheerio.load(html);

      let rawTitle =
        $(".doc_title").first().text().trim() ||
        $("title").text().trim().replace(" - Indian Kanoon", "");
      rawTitle = rawTitle.replace(/\s*-\s*Indian Kanoon/gi, "").trim();

      const docsource = $(".docsource_main").first().text().trim() || "Supreme Court of India";
      const benchText = $(".doc_bench").text().trim().replace(/^Bench:\s*/i, "");
      const citationsText = $(".doc_citations").text().trim().replace(/^Equivalent citations:\s*/i, "");
      const author = $(".doc_author").text().trim().replace(/^Author:\s*/i, "");

      let citesCount = 0;
      let citedByCount = 0;
      const bodyText = $("body").text();
      const countsMatch = bodyText.match(/\[\s*Cites\s*(\d+)\s*,\s*Cited by\s*(\d+)\s*\]/i);
      if (countsMatch) {
        citesCount = parseInt(countsMatch[1], 10);
        citedByCount = parseInt(countsMatch[2], 10);
      }

      const citationsMap = new Map<string, string>();
      $(".judgments a[href*='/doc/']").each((_i, el) => {
        const $el = $(el);
        const href = $el.attr("href") || "";
        const match = href.match(/\/doc\/(\d+)/);
        const text = $el.text().trim();
        if (match && text && text.length > 2 && !citationsMap.has(match[1])) {
          citationsMap.set(match[1], text);
        }
      });

      const citationsInText = Array.from(citationsMap.entries())
        .slice(0, 30)
        .map(([tid, title]) => ({ tid, title }));

      const judgmentBody = $(".judgments, #maincontent, .expanded_headline").first();
      judgmentBody.find("script, style, .ad_doc, .ad_inline, .ad_bottom, .doc_tools, .doc_options").remove();
      judgmentBody.find("a[href*='premium'], a[href*='prism'], a[href*='ikademy'], a[href*='members']").remove();

      judgmentBody.find("a[href*='/doc/']").each((_, a) => {
        const $a = $(a);
        const href = $a.attr("href") || "";
        const match = href.match(/\/doc\/(\d+)/);
        if (match) {
          $a.attr("data-juris-tid", match[1]);
          $a.attr("href", `#doc-${match[1]}`);
          $a.addClass(
            "juris-internal-doc text-[#710c23] font-medium hover:underline hover:text-[#991b1b] transition-colors"
          );
        }
      });

      let docHtml = judgmentBody.html()?.trim() ?? "";
      docHtml = docHtml.replace(/Indian Kanoon/gi, "Law Reports Repository");

      return NextResponse.json({
        tid: id,
        title: rawTitle,
        doc: docHtml,
        docsource,
        author,
        bench: benchText,
        citation: citationsText,
        citesCount,
        citedByCount,
        citationsInText,
        sourceUrl: `/doc/${id}`,
        escrUrl: "https://scr.sci.gov.in/",
      });
    }

    // Process Proxy (Markdown) response
    const markdown = html;

    // Extract title
    const titleMatch = markdown.match(/Title:\s*(.+)/i);
    let rawTitle = titleMatch ? titleMatch[1].trim() : `Supreme Court Judgment #${id}`;
    rawTitle = rawTitle.replace(/\s*-\s*Indian Kanoon/gi, "").trim();

    // Extract Bench & clean markdown links / source URLs
    const benchMatch = markdown.match(/Bench:\s*(.+)/i);
    let benchText = benchMatch ? benchMatch[1].trim() : "";
    benchText = benchText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/\S+/gi, "")
      .replace(/Indian\s*Kanoon/gi, "")
      .trim();

    // Extract Citations
    const citationMatch = markdown.match(/Equivalent citations:\s*(.+)/i);
    const citationsText = citationMatch ? citationMatch[1].trim() : "";

    // Extract Cites & Cited by
    let citesCount = 0;
    let citedByCount = 0;
    const citesMatch = markdown.match(/Cites\D+(\d+)/i);
    const citedByMatch = markdown.match(/Cited\s+by\D+(\d+)/i);
    if (citesMatch) citesCount = parseInt(citesMatch[1], 10);
    if (citedByMatch) citedByCount = parseInt(citedByMatch[1], 10);

    // Extract citations and links in text
    const citationsMap = new Map<string, string>();
    const linkRegex = /\[([^\]]+)\]\(https:\/\/indiankanoon\.org\/doc\/(\d+)\/?\)/g;
    let match;
    while ((match = linkRegex.exec(markdown)) !== null) {
      const text = match[1].trim();
      const tid = match[2];
      if (text && text.length > 2 && !citationsMap.has(tid)) {
        citationsMap.set(tid, text);
      }
    }

    const citationsInText = Array.from(citationsMap.entries())
      .slice(0, 30)
      .map(([tid, title]) => ({ tid, title }));

    // Find main judgment body (skip navigation and header fluff)
    let bodyContent = markdown;
    const marker = "Markdown Content:";
    const markerIdx = bodyContent.indexOf(marker);
    if (markerIdx !== -1) {
      bodyContent = bodyContent.substring(markerIdx + marker.length);
    }

    // Skip all top-level portal navigation down to [Cites ..., Cited by ...]
    const citesMatchIndex = bodyContent.search(/\[?\s*Cites\b/i);
    if (citesMatchIndex !== -1) {
      const newlineAfterCites = bodyContent.indexOf("\n", citesMatchIndex);
      if (newlineAfterCites !== -1) {
        bodyContent = bodyContent.substring(newlineAfterCites + 1);
      }
    }

    // Strip bottom footer fluff (tags, disclaimer, ads)
    const footerIndex = bodyContent.search(/(?:Related AI tags|RELATED USER QUERIES|About\s+Disclaimer\s+Privacy)/i);
    if (footerIndex !== -1) {
      bodyContent = bodyContent.substring(0, footerIndex);
    }

    // Remove remaining navigation lines and source references
    bodyContent = bodyContent.replace(/^.*(?:Indian Kanoon|Skip to main content|Prism AI|IKademy|Premium|Legal Document View|Select the following parts|\[\s*Cites\b|Cited by\b).*$/gim, "");
    bodyContent = bodyContent.replace(/\[\s*Cites[\s\S]*?Cited\s+by[\s\S]*?\]/gi, "");

    // Convert doc links to internal interactive reader tags, and strip other external links
    bodyContent = bodyContent.replace(
      /\[([^\]]+)\]\(https:\/\/indiankanoon\.org\/doc\/(\d+)\/?\)/g,
      '<a href="#doc-$2" data-juris-tid="$2" class="juris-internal-doc text-[#710c23] font-medium hover:underline hover:text-[#991b1b] transition-colors cursor-pointer">$1</a>'
    );
    // Strip any remaining search links or domain mentions
    bodyContent = bodyContent.replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1");
    bodyContent = bodyContent.replace(/https?:\/\/\S+/gi, "");
    bodyContent = bodyContent.replace(/Indian\s*Kanoon/gi, "Official Law Reports");

    // Convert Markdown paragraphs into HTML
    const paragraphs = bodyContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && !p.startsWith("---") && !p.startsWith("==="));

    const docHtml = paragraphs
      .map((p) => {
        if (p.startsWith("###")) {
          return `<h3 class="font-bold text-lg text-slate-900 mt-6 mb-2 font-serif">${p.replace(/^#+\s*/, "")}</h3>`;
        }
        if (p.startsWith("##")) {
          return `<h2 class="font-bold text-xl text-slate-900 mt-8 mb-3 font-serif">${p.replace(/^#+\s*/, "")}</h2>`;
        }
        if (p.startsWith("#")) {
          return `<h1 class="font-bold text-2xl text-slate-900 mt-8 mb-4 font-serif">${p.replace(/^#+\s*/, "")}</h1>`;
        }
        return `<p class="mb-4 leading-relaxed text-justify">${p.replace(/\n/g, " ")}</p>`;
      })
      .join("\n");

    return NextResponse.json({
      tid: id,
      title: rawTitle,
      doc: docHtml,
      docsource: "Supreme Court of India",
      author: "",
      bench: benchText,
      citation: citationsText,
      citesCount,
      citedByCount,
      citationsInText,
      sourceUrl: `/doc/${id}`,
      escrUrl: "https://scr.sci.gov.in/",
    });
  } catch (error) {
    console.error("Document fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch document. Please try again." },
      { status: 500 }
    );
  }
}
