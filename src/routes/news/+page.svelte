<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParamsLtSlide.svelte';
	import SearchDomain from '$lib/components/SearchDomainRtSlide.svelte';
	import NewsResultsPage from '$lib/components/NewsResultsPage.svelte';
	import { newsResults } from '$lib/stores/searchResultsStore';
	import type { NewsResult } from '$lib/types/newsResultsInterface';
	import { save } from '@tauri-apps/plugin-dialog';
	import { homeDir, join } from '@tauri-apps/api/path';
	import { writeTextFile, mkdir } from '@tauri-apps/plugin-fs';
	import { searchQueryWritable } from '$lib/stores/searchTabParamsStore';
	import { get } from 'svelte/store';
	import { newsSelectionState } from '$lib/stores/state.svelte';

	const searchType = 'news' as const;

	type NewsSearchResponse = {
		results?: NewsResult[];
		news?: {
			results?: NewsResult[];
		};
	};

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

	function leftSidebar() {
		leftOpen = !leftOpen;
	}

	function rightSidebar() {
		rightOpen = !rightOpen;
	}

	function handleSearchResults(results: NewsResult[] | NewsSearchResponse | string) {
		if (typeof results === 'string') return;

		const resultList = Array.isArray(results)
			? results
			: (results.results ?? results.news?.results ?? []);

		console.log('Raw news response:', results);
		console.log('News Results are :', resultList.length);
		newsResults.set(resultList);
	}

	// handleLoadingChange(loading: boolean): void
	function handleLoadingChange(loading: boolean): void {
		isLoading = loading;
	}

	function toggleSelection(news: NewsResult) {
		const exists = newsSelectionState.selectedNewsResults.find((r) => r.url == news.url);
		if (exists) {
			newsSelectionState.selectedNewsResults = newsSelectionState.selectedNewsResults.filter((r) => r.url != news.url);
		} else {
			newsSelectionState.selectedNewsResults = [...newsSelectionState.selectedNewsResults, news];
		}
	}

	async function downloadResults() {
	let query = get(searchQueryWritable);

	if (newsSelectionState.selectedNewsResults.length === 0) return;

	let folderName = '';
	let cleanQuery = query;

	const folderMatch = query.match(/^\*\/([^ ]+)\s*(.*)$/);

	if (folderMatch) {
		folderName = folderMatch[1];
		cleanQuery = folderMatch[2] || 'search-results';
	}

	const sanitizedQuery = cleanQuery.replace(/\s+/g, '-').toLowerCase();

	const content = newsSelectionState.selectedNewsResults
		.map((news, i) => {
			let text = `${i + 1}. ${news.title}\n`;
			text += `   ${news.description}\n`;
			text += `   URL: ${news.url}\n`;

			if (news.extra_snippets && news.extra_snippets.length > 0) {
				text += `   Snippets:\n`;
				news.extra_snippets.forEach((snippet:string, j:number) => {
					text += `     ${j + 1}. ${snippet}\n`;
				});
			}

			text += `\n`;
			return text;
		})
		.join('\n');

	const home = await homeDir();

	let baseDir = await join(home, 'Media', 'braveSearchApi', 'News');

	if (folderName) {
		baseDir = await join(baseDir, folderName);
	}

	await mkdir(baseDir, { recursive: true });

	const defaultPath = await join(baseDir, `${sanitizedQuery}-news.txt`);

	const filePath = await save({
		filters: [{ name: 'Text', extensions: ['txt'] }],
		defaultPath
	});

	if (filePath) {
		await writeTextFile(filePath, content);
	}
	newsSelectionState.selectedNewsResults = [];
}

function placementVoid(){
		return;
	}
</script>

<div class="flex flex-col">
	<button
		class="download-button self-start text-lg text-purple-300 hover:text-purple-600"
		onclick={downloadResults}
		>Download
	</button>
	<SearchComponent
		{searchType}
		onsearchWebResults={placementVoid}
		onsearchNewsResults={handleSearchResults}
		onsearchVidsResults={placementVoid}
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

			<NewsResultsPage
				results={$newsResults}
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
					<SearchDomain />
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
