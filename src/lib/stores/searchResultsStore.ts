// src/lib/stores/searchResults.ts
import { writable } from "svelte/store";

import { type SearchMain, type WebResult, type FAQ } from "$lib/types/searchWebResultsInterface";
import { type NewsResult } from "$lib/types/newsResultsInterface";
import { type VideosResult } from "$lib/types/videoResultsInterface";
import { type ImagesResult } from "$lib/types/imagesResultsInterface";

export const webResults = writable<WebResult[]>([]);
export const videoResults = writable<VideosResult[]>([]);
export const newsResults = writable<NewsResult[]>([]);
export const imageResults = writable<ImagesResult[]>([]);
export const faqResults = writable<FAQ[]>([]);