<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParamsLtSlide.svelte';
	import SearchDomain from '$lib/components/SearchDomainRtSlide.svelte';
	import NewsResultsPage from '$lib/components/NewsResultsPage.svelte';
	import { newsResults } from '$lib/stores/searchResultsStore';
	import type { BraveSearchResponse, NewsResult } from '$lib/types/braveInterfaces';
	import { parseSearchResponse } from '$lib/utils/parseSearch';
	import { save } from '@tauri-apps/plugin-dialog';
	import { writeTextFile } from '@tauri-apps/plugin-fs';
	import { searchQueryWritable } from '$lib/stores/searchTabParamsStore';
	import { get } from 'svelte/store';

	const searchType = 'news' as const;

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

	let selectedNewsResults: NewsResult[] = $state([]);

	function leftSidebar() {
		leftOpen = !leftOpen;
	}

	function rightSidebar() {
		rightOpen = !rightOpen;
	}

	// handleSearchResults(results: BraveSearchResponse | string): void
	function handleSearchResults(results: BraveSearchResponse | string) {
		if (typeof results === 'string') return;
		console.log('Raw news response:', results);
		const theResults = parseSearchResponse(results);
		console.log('Parsed news results:', theResults.news);
		newsResults.set(theResults.news);
	}

	// handleLoadingChange(loading: boolean): void
	function handleLoadingChange(loading: boolean): void {
		isLoading = loading;
	}

	function toggleSelection(news: NewsResult) {
		const exists = selectedNewsResults.find((r) => r.url == news.url);
		if (exists) {
			selectedNewsResults = selectedNewsResults.filter((r) => r.url != news.url);
		} else {
			selectedNewsResults = [...selectedNewsResults, news];
		}
	}

	async function downloadResults() {

		const query = get(searchQueryWritable);
		const sanitizedQuery = query.replace(/\s+/g, '-').toLowerCase();

		if (selectedNewsResults.length == 0) {
			return;
		}

		const content = selectedNewsResults
			.map((news, i) => {
				let text = `${i + 1}. ${news.title}\n`;
				text += `   ${news.description}\n`;
				text += `   URL: ${news.url}\n`;
				text += `\n`;
				return text;
			})
			.join('\n');

		// Open save dialog
		const filePath = await save({
			filters: [{ name: 'Text', extensions: ['txt'] }],
			defaultPath: `${sanitizedQuery}-news-results.txt`
		});

		if (filePath) {
			await writeTextFile(filePath, content);
		}
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

			<NewsResultsPage 
				results={$newsResults}
				{selectedNewsResults}
				onToggleSelection={toggleSelection}
				 />
		</div>

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
