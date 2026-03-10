// searchTabParamsStore.ts
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { 
	WebParams, 
	NewsParams, 
	VideoParams, 
	ImageParams
} from '$lib/types/braveInterfaces';

// Search type
export type SearchType = 'web' | 'news' | 'videos' | 'images';

// Previous searches (shared)
export const searchQueryWritable: Writable<string> = writable('');
export const previousSearchesWritable = writable<string[]>([]);

// Default params for each search type
const defaultWebParams: WebParams = {
	count: 0,
	offset: 0,
	country: 'US',
	language: 'en',
	safesearch: null,
	freshness: null,
	extraSnippets: false,
	goggles: false,
	fetchMetadata: false
};

const defaultNewsParams: NewsParams = {
	count: 0,
	offset: 0,
	country: 'US',
	language: 'en',
	safesearch: null,
	freshness: null,
	extraSnippets: false,
	goggles: false,
	includeMetaData:false
};

const defaultVideoParams: VideoParams = {
	count: 0,
	offset: 0,
	country: 'US',
	language: 'en',
	safesearch: null,
	freshness: null,
	spellcheck: true
};

const defaultImageParams: ImageParams = {
	count: 0,
	country: 'US',
	language: 'en',
	safesearch: null,
	spellcheck: true
};

// Per-tab param stores with correct types
export const webParamsStore = writable<WebParams>({ ...defaultWebParams });
export const newsParamsStore = writable<NewsParams>({ ...defaultNewsParams });
export const videosParamsStore = writable<VideoParams>({ ...defaultVideoParams });
export const imagesParamsStore = writable<ImageParams>({ ...defaultImageParams });
