// src/lib/utils/parseSearch.ts

import type { BraveSearchResponse, ParsedSearchResults } from "$lib/types/braveInterfaces";

/**
 * parseSearchResponse(raw: BraveSearchResponse): ParsedSearchResults
 * Extracts the relevant data from the Brave API response into a simpler structure
 */
export function parseSearchResponse(raw: BraveSearchResponse): ParsedSearchResults {
	// Handle direct endpoint responses (news/videos/images endpoints return results at top level)
	const directResults = (raw as any).results ?? [];
	
	return {
		query: raw.query?.original ?? "",
		web: raw.web?.results ?? [],
		videos: raw.videos?.results ?? directResults,
		news: raw.news?.results ?? directResults,
		images: raw.images?.results ?? directResults,
		discussions: raw.discussions?.results ?? [],
		faq: raw.faq?.results ?? []
	};
}
