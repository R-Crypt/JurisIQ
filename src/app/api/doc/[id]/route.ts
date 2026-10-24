import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const IK_BASE = "https://indiankanoon.org";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
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

  const url = `${IK_BASE}/doc/${id}/`;

  try {
    const response = await fetch(url, { headers: HEADERS });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch document: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract document title
    let rawTitle =
      $(".doc_title").first().text().trim() ||
      $("title").text().trim().replace(" - Indian Kanoon", "");

    rawTitle = rawTitle.replace(/\s*-\s*Indian Kanoon/gi, "").trim();

    // Extract metadata
    const docsource = $(".docsource_main").first().text().trim() || "Supreme Court of India";
    const benchText = $(".doc_bench").text().trim().replace(/^Bench:\s*/i, "");
    const citationsText = $(".doc_citations").text().trim().replace(/^Equivalent citations:\s*/i, "");
    const author = $(".doc_author").text().trim().replace(/^Author:\s*/i, "");

    // Extract Cites and Cited by counts
    let citesCount = 0;
    let citedByCount = 0;
    const bodyText = $("body").text();
    const countsMatch = bodyText.match(/\[\s*Cites\s*(\d+)\s*,\s*Cited by\s*(\d+)\s*\]/i);
    if (countsMatch) {
      citesCount = parseInt(countsMatch[1], 10);
      citedByCount = parseInt(countsMatch[2], 10);
    }

    // Extract top cited precedents and statutory provisions mentioned in the text
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

    // Extract main judgment text
    const judgmentBody = $(".judgments, #maincontent, .expanded_headline").first();

    // Clean up unnecessary elements, ads, and third party mentions
    judgmentBody.find("script, style, .ad_doc, .ad_inline, .ad_bottom, .doc_tools, .doc_options").remove();
    judgmentBody.find("a[href*='premium'], a[href*='prism'], a[href*='ikademy'], a[href*='members']").remove();

    // Transform internal links so they are interactive in our reader
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
    // Clean any remaining third party mentions in the html
    docHtml = docHtml.replace(/Indian Kanoon/gi, "Law Reports Repository");

    // Official Supreme Court digital SCR search link
    const escrSearchUrl = `https://scr.sci.gov.in/`;

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
      escrUrl: escrSearchUrl,
    });
  } catch (error) {
    console.error("Document fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch document. Please try again." },
      { status: 500 }
    );
  }
}
