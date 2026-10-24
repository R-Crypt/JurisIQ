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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const doctype = searchParams.get("doctype") ?? "supremecourt";
  const fromDate = searchParams.get("fromDate") ?? "";
  const toDate = searchParams.get("toDate") ?? "";
  const author = searchParams.get("author") ?? "";
  const bench = searchParams.get("bench") ?? "";
  const title = searchParams.get("title") ?? "";
  const citation = searchParams.get("citation") ?? "";

  if (!query && !title && !citation) {
    return NextResponse.json(
      { error: "Query, title, or citation is required" },
      { status: 400 }
    );
  }

  // Build formInput with filters
  let formInput = query.trim();
  if (doctype && doctype !== "all") formInput += ` doctypes:${doctype}`;
  if (fromDate) formInput += ` fromdate:${fromDate}`;
  if (toDate) formInput += ` todate:${toDate}`;
  if (author) formInput += ` author:${author}`;
  if (bench) formInput += ` bench:${bench}`;
  if (title) formInput += ` title:${title}`;
  if (citation) formInput += ` cite:${citation}`;

  const directUrl = `${IK_BASE}/search/?formInput=${encodeURIComponent(formInput.trim())}&pagenum=${page}`;

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
          { error: `Failed to fetch search results: ${proxyResponse.status}` },
          { status: proxyResponse.status }
        );
      }

      html = await proxyResponse.text();
    }

    // Process Direct HTML
    if (!isFromProxy) {
      const $ = cheerio.load(html);

      const resultCountText = $(".result_count").first().text().trim();
      const totalMatch = resultCountText.match(/([\d,]+)\s+Results?/i);
      const totalFound = totalMatch
        ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
        : 0;

      const results: Array<{
        tid: string;
        title: string;
        headline: string;
        docsource: string;
        publishdate: string;
        numcites: number;
        numcitedby: number;
        url: string;
      }> = [];

      $(".result").each((_i, el) => {
        const $el = $(el);
        const titleLink = $el.find(".result_title a").first();
        const href = titleLink.attr("href") ?? "";
        const tidMatch = href.match(/\/doc(?:fragment)?\/(\d+)/);
        const tid = tidMatch ? tidMatch[1] : "";

        const resultTitle = titleLink.text().trim();
        const headline = $el.find(".result_text, .headline").text().trim();
        const docsource = $el.find(".docsource").text().trim();
        const publishdate = $el.find(".doc_date, .result_date").text().trim();

        let numcites = 0;
        let numcitedby = 0;
        const fullItemText = $el.text();
        const citesMatch = fullItemText.match(/Cites\s*(\d+)/i);
        const citedbyMatch = fullItemText.match(/Cited by\s*(\d+)/i);
        if (citesMatch) numcites = parseInt(citesMatch[1], 10);
        if (citedbyMatch) numcitedby = parseInt(citedbyMatch[1], 10);

        if (tid && resultTitle) {
          results.push({
            tid,
            title: resultTitle,
            headline: headline.substring(0, 500),
            docsource: docsource || "Supreme Court of India",
            publishdate,
            numcites,
            numcitedby,
            url: `/doc/${tid}`,
          });
        }
      });

      return NextResponse.json({
        results,
        totalFound: totalFound || results.length,
        query: formInput.trim(),
        page,
      });
    }

    // Process Proxy Markdown
    const markdown = html;
    const results: Array<{
      tid: string;
      title: string;
      headline: string;
      docsource: string;
      publishdate: string;
      numcites: number;
      numcitedby: number;
      url: string;
    }> = [];

    // Parse blocks matching: #### [Title](link)\n\nHeadline snippet...
    const blockRegex = /####\s+\[\*\*?(.+?)\*\*?\]\(https:\/\/indiankanoon\.org\/doc(?:fragment)?\/(\d+)[^)]*\)\s*\n+([\s\S]*?)(?=(?:####|\n\n---\n\n|$))/g;
    let match;
    while ((match = blockRegex.exec(markdown)) !== null) {
      const rawTitle = match[1].replace(/\*\*/g, "").trim();
      const tid = match[2];
      const snippet = match[3].replace(/\*\*/g, "").trim().slice(0, 450);

      let publishdate = "";
      const dateMatch = rawTitle.match(/on\s+(\d+\s+[A-Za-z]+,\s+\d{4})/i) || snippet.match(/on\s+(\d+\s+[A-Za-z]+,\s+\d{4})/i);
      if (dateMatch) {
        publishdate = dateMatch[1];
      }

      results.push({
        tid,
        title: rawTitle,
        headline: snippet,
        docsource: "Supreme Court of India",
        publishdate,
        numcites: 0,
        numcitedby: 0,
        url: `/doc/${tid}`,
      });
    }

    return NextResponse.json({
      results,
      totalFound: results.length,
      query: formInput.trim(),
      page,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results. Please try again." },
      { status: 500 }
    );
  }
}
