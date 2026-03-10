// src/lib/stores/searchResults.ts
import { writable } from "svelte/store";
import type { WebResult, VideoResult, NewsResult, DiscussionResult, 
    FaqResult, ImagesResult } from "$lib/types/braveInterfaces";

export const webResults = writable<WebResult[]>([]);
export const videoResults = writable<VideoResult[]>([]);
export const newsResults = writable<NewsResult[]>([]);
export const imageResults = writable<ImagesResult[]>([]);
export const discussionResults = writable<DiscussionResult[]>([]);
export const faqResults = writable<FaqResult[]>([]);