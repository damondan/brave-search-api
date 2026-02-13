// src/lib/stores/searchResults.ts
import { writable } from "svelte/store";
import type { WebResult, VideoResult, NewsResult, DiscussionResult, FaqResult } from "$lib/types/brave";

export const webResults = writable<WebResult[]>([]);
export const videoResults = writable<VideoResult[]>([]);
export const newsResults = writable<NewsResult[]>([]);
export const discussionResults = writable<DiscussionResult[]>([]);
export const faqResults = writable<FaqResult[]>([]);