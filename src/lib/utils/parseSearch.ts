// src/lib/utils/parseSearch.ts

import type { BraveSearchResponse, ParsedSearchResults } from "$lib/types/braveInterfaces";

/**
 * parseSearchResponse(raw: BraveSearchResponse): ParsedSearchResults
 * Extracts the relevant data from the Brave API response into a simpler structure
 */
export function parseSearchResponse(raw: BraveSearchResponse): ParsedSearchResults {
	return {
		query: raw.query?.original ?? "",
		web: raw.web?.results ?? [],
		videos: raw.videos?.results ?? [],
		news: raw.news?.results ?? [],
		images: raw.images?.results ?? [],
		discussions: raw.discussions?.results ?? [],
		faq: raw.faq?.results ?? []
	};
}
