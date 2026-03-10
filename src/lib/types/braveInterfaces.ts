// src/lib/types/braveInterfaces.ts

export interface WebResult {
	title: string;
	url: string;
	description: string;
	page_age?: string;
	profile?: {
		name: string;
		url: string;
		long_name: string;
		img: string;
	};
	thumbnail?: {
		src: string;
		original: string;
	};
	extra_snippets?: string[];  // Additional snippets when extra_snippets=true
}

export interface VideoResult {
	type: string;
	url: string;
	title: string;
	description: string;
	age?: string;
	page_age?: string;
	video?: {
		duration: string;
		views?: number;
		creator?: string;
		publisher?: string;
	};
	thumbnail?: {
		src: string;
		original: string;
	};
}

export interface ImagesResult {
	type: string;
	url: string;
	title: string;
	source: string;
	page_age?: string;
	thumbnail?: {
		src: string;
		original: string;
		height?: number;
		width?: number;
	};
	properties?: {
		url: string;
		height?: number;
		width?: number;
		format?: string;
	};
	meta_url?: {
		scheme: string;
		netloc: string;
		hostname: string;
		favicon: string;
		path: string;
	};
}

export interface NewsResult {
	title: string;
	url: string;
	description: string;
	page_age?: string;
	profile?: {
		name: string;
		img: string;
	};
	thumbnail?: {
		src: string;
	};
}

export interface DiscussionResult {
	title: string;
	url: string;
	description: string;
	page_age?: string;
	profile?: {
		name: string;
		url: string;
		img: string;
	};
}

export interface FaqResult {
	question: string;
	answer: string;
	title: string;
	url: string;
}

export interface MixedItem {
	type: string;
	index?: number;
	all: boolean;
}

export interface BraveSearchResponse {
	type: string;
	query: {
		original: string;
		country: string;
		more_results_available: boolean;
	};
	web?: {
		type: string;
		results: WebResult[];
		family_friendly: boolean;
	};
	videos?: {
		type: string;
		results: VideoResult[];
	};
	news?: {
		type: string;
		results: NewsResult[];
	};
	images?: {
		type: string;
		results: ImagesResult[];
	};
	discussions?: {
		type: string;
		results: DiscussionResult[];
	};
	faq?: {
		type: string;
		results: FaqResult[];
	};
	mixed: {
		type: string;
		main: MixedItem[];
		top: MixedItem[];
		side: MixedItem[];
	};
}

// Parsed/simplified structure for your UI
export interface ParsedSearchResults {
	query: string;
	web: WebResult[];
	videos: VideoResult[];
	news: NewsResult[];
	images: ImagesResult[];
	discussions: DiscussionResult[];
	faq: FaqResult[];
}

export interface SearchParams {
	query: string;
	country?: string;
	searchlang?: string;
	safesearch?: SafeSearch;
	count?: string; //1-50
	offset?: string; //0 - 9
	freshness?: Freshness;
	xtraSnippets?: XtraSnippets;
	goggles?: Goggles;
	fetchMetaData?: FetchMetaData;
}

export enum FetchMetaData {
	fetchmetadata = "include_fetch_metadata"
}

export enum XtraSnippets {
	extrasnippets = "extra_snippets"
}

export enum Goggles {
	goggles = "goggles"
}

export enum Freshness {
	pd = "pd", //last 24hrs
	pw = "pw", //last 7 days
	pm = "pm", //last 31 days
	py = "py", //last 365 days                                                                                                               
}

export enum SafeSearch {
	off = "off",
	moderate = "moderate",
	strict = "strict"
}

export const countries = [
  { key: "AR", label: "Argentina" },
  { key: "AU", label: "Australia" },
  { key: "AT", label: "Austria" },
  { key: "BE", label: "Belgium" },
  { key: "BR", label: "Brazil" },
  { key: "CA", label: "Canada" },
  { key: "CL", label: "Chile" },
  { key: "DK", label: "Denmark" },
  { key: "FI", label: "Finland" },
  { key: "FR", label: "France" },
  { key: "DE", label: "Germany" },
  { key: "GR", label: "Greece" },
  { key: "HK", label: "Hong Kong" },
  { key: "IN", label: "India" },
  { key: "ID", label: "Indonesia" },
  { key: "IT", label: "Italy" },
  { key: "JP", label: "Japan" },
  { key: "KR", label: "South Korea" },
  { key: "MY", label: "Malaysia" },
  { key: "MX", label: "Mexico" },
  { key: "NL", label: "Netherlands" },
  { key: "NZ", label: "New Zealand" },
  { key: "NO", label: "Norway" },
  { key: "CN", label: "China" },
  { key: "PL", label: "Poland" },
  { key: "PT", label: "Portugal" },
  { key: "PH", label: "Philippines" },
  { key: "RU", label: "Russia" },
  { key: "SA", label: "Saudi Arabia" },
  { key: "ZA", label: "South Africa" },
  { key: "ES", label: "Spain" },
  { key: "SE", label: "Sweden" },
  { key: "CH", label: "Switzerland" },
  { key: "TW", label: "Taiwan" },
  { key: "TR", label: "Turkey" },
  { key: "GB", label: "United Kingdom" },
  { key: "US", label: "United States" },
] as const;

export type Country = typeof countries[number]["key"];

export const languages = [
  { key: "ar", label: "Arabic" },
  { key: "eu", label: "Basque" },
  { key: "bn", label: "Bengali" },
  { key: "bg", label: "Bulgarian" },
  { key: "ca", label: "Catalan" },
  { key: "zh-hans", label: "Chinese (Simplified)" },
  { key: "zh-hant", label: "Chinese (Traditional)" },
  { key: "hr", label: "Croatian" },
  { key: "cs", label: "Czech" },
  { key: "da", label: "Danish" },
  { key: "nl", label: "Dutch" },
  { key: "en", label: "English" },
  { key: "en-gb", label: "English (United Kingdom)" },
  { key: "et", label: "Estonian" },
  { key: "fi", label: "Finnish" },
  { key: "fr", label: "French" },
  { key: "gl", label: "Galician" },
  { key: "de", label: "German" },
  { key: "el", label: "Greek" },
  { key: "gu", label: "Gujarati" },
  { key: "he", label: "Hebrew" },
  { key: "hi", label: "Hindi" },
  { key: "hu", label: "Hungarian" },
  { key: "is", label: "Icelandic" },
  { key: "it", label: "Italian" },
  { key: "ja", label: "Japanese" },          // corrected from "jp"
  { key: "kn", label: "Kannada" },
  { key: "ko", label: "Korean" },
  { key: "lv", label: "Latvian" },
  { key: "lt", label: "Lithuanian" },
  { key: "ms", label: "Malay" },
  { key: "ml", label: "Malayalam" },
  { key: "mr", label: "Marathi" },
  { key: "nb", label: "Norwegian Bokmål" },
  { key: "pl", label: "Polish" },
  { key: "pt-br", label: "Portuguese (Brazil)" },
  { key: "pt-pt", label: "Portuguese (Portugal)" },
  { key: "pa", label: "Punjabi" },
  { key: "ro", label: "Romanian" },
  { key: "ru", label: "Russian" },
  { key: "sr", label: "Serbian" },
  { key: "sk", label: "Slovak" },
  { key: "sl", label: "Slovenian" },
  { key: "es", label: "Spanish" },
  { key: "sv", label: "Swedish" },
  { key: "ta", label: "Tamil" },
  { key: "te", label: "Telugu" },
  { key: "th", label: "Thai" },
  { key: "tr", label: "Turkish" },
  { key: "uk", label: "Ukrainian" },
  { key: "vi", label: "Vietnamese" },
] as const;

export type Language = typeof languages[number]["key"];

// =============================================================================
// Tab-specific search params for UI stores
// Based on Brave Search API documentation for each endpoint
// =============================================================================

// Base params shared by all search types
export interface BaseParams {
	count: number;       // max varies: web=20, news/videos=50, images=200
	country: string;
	language: string;
	safesearch: SafeSearch | null;
}

// Web Search params (supports all features)
export interface WebParams extends BaseParams {
	offset: number;          // 0-9
	freshness: Freshness | null;
	extraSnippets: boolean;
	goggles: boolean;
	fetchMetadata: boolean;
}

// News Search params (similar to web, no fetchMetadata)
export interface NewsParams extends BaseParams {
	offset: number;          // 0-9
	freshness: Freshness | null;
	extraSnippets: boolean;
	goggles: boolean;
	includeMetaData: boolean;
}

// Video Search params (no extra_snippets, no goggles, has spellcheck)
export interface VideoParams extends BaseParams {
	offset: number;          // 0-9
	freshness: Freshness | null;
	spellcheck: boolean;
}

// Image Search params (no offset, no freshness, no extra_snippets, no goggles)
export interface ImageParams extends BaseParams {
	spellcheck: boolean;
}

// Union type for all tab params
export type TabParams = WebParams | NewsParams | VideoParams | ImageParams;
