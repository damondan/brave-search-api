// src/lib/types/brave.ts

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
	discussions: DiscussionResult[];
	faq: FaqResult[];
}

export interface SearchParams {
query: string;
country?: Country;
searchlang?: SearchLanguage;
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

export enum Country {
  AR = "AR", // Argentina
  AU = "AU", // Australia
  AT = "AT", // Austria
  BE = "BE", // Belgium
  BR = "BR", // Brazil
  CA = "CA", // Canada
  CL = "CL", // Chile
  DK = "DK", // Denmark
  FI = "FI", // Finland
  FR = "FR", // France
  DE = "DE", // Germany
  GR = "GR", // Greece
  HK = "HK", // Hong Kong
  IN = "IN", // India
  ID = "ID", // Indonesia
  IT = "IT", // Italy
  JP = "JP", // Japan
  KR = "KR", // South Korea
  MY = "MY", // Malaysia
  MX = "MX", // Mexico
  NL = "NL", // Netherlands
  NZ = "NZ", // New Zealand
  NO = "NO", // Norway
  CN = "CN", // China
  PL = "PL", // Poland
  PT = "PT", // Portugal
  PH = "PH", // Philippines
  RU = "RU", // Russia
  SA = "SA", // Saudi Arabia
  ZA = "ZA", // South Africa
  ES = "ES", // Spain
  SE = "SE", // Sweden
  CH = "CH", // Switzerland
  TW = "TW", // Taiwan
  TR = "TR", // Turkey
  GB = "GB", // United Kingdom
  US = "US", // United States
}

export enum SearchLanguage {
  AR = "ar",        // Arabic
  EU = "eu",        // Basque
  BN = "bn",        // Bengali
  BG = "bg",        // Bulgarian
  CA = "ca",        // Catalan
  ZH_HANS = "zh-hans", // Chinese (Simplified)
  ZH_HANT = "zh-hant", // Chinese (Traditional)
  HR = "hr",        // Croatian
  CS = "cs",        // Czech
  DA = "da",        // Danish
  NL = "nl",        // Dutch
  EN = "en",        // English
  EN_GB = "en-gb",  // English (United Kingdom)
  ET = "et",        // Estonian
  FI = "fi",        // Finnish
  FR = "fr",        // French
  GL = "gl",        // Galician
  DE = "de",        // German
  EL = "el",        // Greek
  GU = "gu",        // Gujarati
  HE = "he",        // Hebrew
  HI = "hi",        // Hindi
  HU = "hu",        // Hungarian
  IS = "is",        // Icelandic
  IT = "it",        // Italian
  JP = "jp",        // Japanese (Note: ISO language code is usually "ja")
  KN = "kn",        // Kannada
  KO = "ko",        // Korean
  LV = "lv",        // Latvian
  LT = "lt",        // Lithuanian
  MS = "ms",        // Malay
  ML = "ml",        // Malayalam
  MR = "mr",        // Marathi
  NB = "nb",        // Norwegian Bokmål
  PL = "pl",        // Polish
  PT_BR = "pt-br",  // Portuguese (Brazil)
  PT_PT = "pt-pt",  // Portuguese (Portugal)
  PA = "pa",        // Punjabi
  RO = "ro",        // Romanian
  RU = "ru",        // Russian
  SR = "sr",        // Serbian
  SK = "sk",        // Slovak
  SL = "sl",        // Slovenian
  ES = "es",        // Spanish
  SV = "sv",        // Swedish
  TA = "ta",        // Tamil
  TE = "te",        // Telugu
  TH = "th",        // Thai
  TR = "tr",        // Turkish
  UK = "uk",        // Ukrainian
  VI = "vi",        // Vietnamese
}