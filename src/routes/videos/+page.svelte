<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParamsLtSlide.svelte';
	import VideoResultsPage from '$lib/components/VideoResultsPage.svelte';
	import { videoResults } from '$lib/stores/searchResultsStore';
	import type { BraveSearchResponse, VideoResult } from '$lib/types/braveInterfaces';
	import { parseSearchResponse } from '$lib/utils/parseSearch';
	import { save } from '@tauri-apps/plugin-dialog';
	import { writeTextFile } from '@tauri-apps/plugin-fs';
	import { searchQueryWritable } from '$lib/stores/searchTabParamsStore';
	import { get } from 'svelte/store';

	const searchType = 'videos' as const;

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

	let selectedVideosResults: VideoResult[] = $state([]);

	function leftSidebar() {
		leftOpen = !leftOpen;
	}

	// handleSearchResults(results: BraveSearchResponse | string): void
	function handleSearchResults(results: BraveSearchResponse | string) {
		if (typeof results === 'string') return;
		const theResults = parseSearchResponse(results);
		videoResults.set(theResults.videos);
	}

	function toggleSelection(vid: VideoResult) {
		const exists = selectedVideosResults.find((r) => r.url == vid.url);
		if (exists) {
			selectedVideosResults = selectedVideosResults.filter((r) => r.url != vid.url);
		} else {
			selectedVideosResults = [...selectedVideosResults, vid];
		}
	}

	async function downloadResults() {

		const query = get(searchQueryWritable);
		const sanitizedQuery = query.replace(/\s+/g, '-').toLowerCase();

		if (selectedVideosResults.length == 0) {
			return;
		}

		const content = selectedVideosResults
			.map((vid, i) => {
				let text = `${i + 1}. ${vid.title}\n`;
				text += `   ${vid.description}\n`;
				text += `   URL: ${vid.url}\n`;
				text += `\n`;
				return text;
			})
			.join('\n');

		// Open save dialog
		const filePath = await save({
			filters: [{ name: 'Text', extensions: ['txt'] }],
			defaultPath: `${sanitizedQuery}-vid-results.txt`
		});

		if (filePath) {
			await writeTextFile(filePath, content);
		}
	}

	// handleLoadingChange(loading: boolean): void
	function handleLoadingChange(loading: boolean): void {
		isLoading = loading;
	}
</script>

<div class="flex flex-col">
	<button
		class="download-button self-start text-sm text-purple-300 hover:text-purple-600"
		onclick={downloadResults}
		>Download
	</button>
	<SearchComponent
		{searchType}
		onsearchResults={handleSearchResults}
		onloadingChange={handleLoadingChange}
	/>

	<div class="flex flex-1">
		<!-- Left Sidebar + Toggle -->
		<div class="mr-1 flex h-screen">
			<!-- Collapsible content -->
			<div
				class="h-full overflow-hidden bg-gray-800 transition-all duration-300
			{leftOpen ? 'w-48' : 'w-0'}"
			>
				<div class="w-48 p-1">
					<!-- Sidebar content here -->
					<SearchParams {searchType} />
				</div>
			</div>

			<!-- Toggle button (always visible) -->
			<button
				class="flex w-6 cursor-pointer items-center justify-center bg-gray-700 text-white hover:bg-gray-600"
				onclick={leftSidebar}
			>
				{leftOpen ? '◀' : '▶'}
			</button>
		</div>

		<!-- Main Content -->
		<div class="flex-1 overflow-y-auto">
			{#if isLoading}
				<div class="spinner-overlay tw-spinner-overlay">
					<div class="spinner custom-spinner"></div>
				</div>
			{/if}

			<VideoResultsPage
				results={$videoResults}
				{selectedVideosResults}
				onToggleSelection={toggleSelection} />
		</div>

		<!-- Right Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {rightOpen ? 'w-[10%]' : 'w-0'}"></div>
	</div>
</div>
