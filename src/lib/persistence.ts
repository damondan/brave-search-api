import { invoke } from '@tauri-apps/api/core';
import { previousSearchesWritable } from './stores/searchTabParamsStore';
import { get } from 'svelte/store';

let saveTimeout: number | null = null;

interface BraveSearchData {
    prevSearchStrings?: string[];

}

// Auto-save with debounce (500ms after last change)
export function scheduleSave() {
	if (saveTimeout !== null) {
		clearTimeout(saveTimeout);
	}
	saveTimeout = window.setTimeout(async () => {
		await saveBraveSearchData();
	}, 500);
}

export async function saveBraveSearchData(): Promise<void> {
	try {
	const data: BraveSearchData = {
		prevSearchStrings: get(previousSearchesWritable)
	};
		await invoke('save_brave_data', { data: JSON.stringify(data) });
		console.log('Brave data saved');
	} catch (error) {
		console.error('Failed to save brave data:', error);
	}
}

// Load todos and commands from disk
export async function loadBraveSearchData(): Promise<void> {
	try {
		const dataStr = await invoke<string>('load_brave_data');
		const data: BraveSearchData = JSON.parse(dataStr);
		
		if (data.prevSearchStrings !== undefined) {
		    previousSearchesWritable.set(data.prevSearchStrings);
	}
	
	console.log('Brave Search data loaded');
	} catch (error) {
		console.error('Failed to load brave data:', error);
	}
}

// Subscribe to store changes and auto-save
export function initPersistence() {
	// Subscribe to todos changes
	previousSearchesWritable.subscribe(() => {
		scheduleSave();
	});
}