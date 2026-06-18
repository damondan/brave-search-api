<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParamsLtSlide.svelte';
	import SearchDomain from '$lib/components/SearchDomainRtSlide.svelte';
	import VideoResultsPage from '$lib/components/VideoResultsPage.svelte';
	import { videoResults } from '$lib/stores/searchResultsStore';
	import type {  } from '$lib/types/braveInterfaces';
	import type { VideosResult } from '$lib/types/videoResultsInterface';
	import { parseSearchResponse } from '$lib/utils/parseSearch';
	import { save } from '@tauri-apps/plugin-dialog';
	import { writeTextFile } from '@tauri-apps/plugin-fs';
	import { searchQueryWritable } from '$lib/stores/searchTabParamsStore';
	import { get } from 'svelte/store';
	import type { Video } from 'flowbite-svelte';

	const searchType = 'videos' as const;

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

	let selectedVideosResults: VideosResult[] = $state([]);

	function leftSidebar() {
		leftOpen = !leftOpen;
	}

	function rightSidebar() {
		rightOpen = !rightOpen;
	}

	// handleSearchResults(results: BraveSearchResponse | string): void
	function handleSearchResults(results: VideosResult[] | string) {
		if (typeof results === 'string') return;
		//const theResults = parseSearchResponse(results);
		//videoResults.set(theResults.videos);
		videoResults.set(results);
	}

	function toggleSelection(vid: VideosResult) {
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

		function placementVoid(){
		return;
	}

</script>

<div class="flex flex-col">
	<button
		class="download-button self-start text-sm text-purple-300 hover:text-purple-600"
		onclick={downloadResults}
		>Go
	</button>
	<SearchComponent
		{searchType}
		onsearchWebResults={placementVoid}
		onsearchNewsResults={placementVoid}
		onsearchVidsResults={handleSearchResults}
		onsearchImagesResults={placementVoid}
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
			<!-- Right Sidebar + Toggle -->
		<div class="ml-auto flex h-screen">
			<!-- Collapsible content -->
			<div
				class="h-full overflow-hidden bg-gray-200 transition-all duration-300
			{rightOpen ? 'w-68' : 'w-0'}"
			>
				<div class="w-68 p-1">
					<!-- Sidebar content here -->
					<SearchDomain/>
				</div>
			</div>

			<!-- Toggle button (always visible) -->
			<button
				class="flex w-6 cursor-pointer items-center justify-center bg-gray-700 text-white hover:bg-gray-600"
				onclick={rightSidebar}
			>
				{rightOpen ? '▶' : '◀'}
			</button>
		</div>
	</div>
</div>
