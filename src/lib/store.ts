import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Freshness, SafeSearch } from '$lib/types/brave';

export const searchQueryWritable: Writable<string> = writable('');
export const previousSearchesWritable = writable<string[]>([]);

// Search params stores
export const countStore = writable<number>(0);
export const extraSnippetsStore = writable<boolean>(false);
export const fetchMetadataStore = writable<boolean>(false);
export const gogglesStore = writable<boolean>(false);
export const safesearchStore = writable<SafeSearch | null>(null);
export const freshnessStore = writable<Freshness | null>(null);
export const countryStore = writable<string>('US');
export const languageStore = writable<string>('en');
