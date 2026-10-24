export interface SearchResult {
  tid: string;
  title: string;
  headline: string;
  docsource: string;
  publishdate?: string;
  numcites?: number;
  numcitedby?: number;
  url: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalFound: number;
  query: string;
  page: number;
}

export interface CitedCase {
  tid: string;
  title: string;
  docsource?: string;
  publishdate?: string;
  url?: string;
}

export interface CaseDocument {
  tid: string;
  title: string;
  doc: string;
  docsource: string;
  publishdate?: string;
  author?: string;
  bench?: string;
  citation?: string;
  headnote?: string;
  citesCount?: number;
  citedByCount?: number;
  citationsInText?: Array<{
    title: string;
    tid: string;
  }>;
  citeList?: CitedCase[];
  citedbyList?: CitedCase[];
  sourceUrl: string;
  escrUrl?: string;
  escrCitation?: string;
}

export interface SearchFilters {
  query: string;
  doctype: string;
  fromDate?: string;
  toDate?: string;
  author?: string;
  bench?: string;
  title?: string;
  citation?: string;
  scope?: "all" | "title" | "body";
}

export interface LandmarkPreset {
  id: string;
  title: string;
  year: string;
  citation: string;
  bench: string;
  query: string;
  summary: string;
  tags: string[];
}
