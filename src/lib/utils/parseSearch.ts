// src/lib/utils/parseSearch.ts

import type { BraveSearchResponse, ParsedSearchResults } from "$lib/types/brave";

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
		discussions: raw.discussions?.results ?? [],
		faq: raw.faq?.results ?? []
	};
}
