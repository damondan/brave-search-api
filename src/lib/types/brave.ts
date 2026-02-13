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
