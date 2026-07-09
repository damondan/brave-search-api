<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParamsLtSlide.svelte';
	import { open } from '@tauri-apps/plugin-shell';
	import { save } from '@tauri-apps/plugin-dialog';
	import { writeTextFile, mkdir } from '@tauri-apps/plugin-fs';
	import { homeDir, join } from '@tauri-apps/api/path';
	import { webResults } from '$lib/stores/searchResultsStore';
	import type { SearchMain, WebResult } from '$lib/types/searchWebResultsInterface';
	import { parseSearchResponse } from '$lib/utils/parseSearch';
	import { searchQueryWritable } from '$lib/stores/searchTabParamsStore';
	import { webSelectionState } from '$lib/stores/state.svelte';
	import { get } from 'svelte/store';

	const searchType = 'web' as const;

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

	//let selectedWebResults: WebResult[] = $state([]);

	function leftSidebar() {
		leftOpen = !leftOpen;
	}

	// handleSearchResults(results: BraveSearchResponse): void
	function handleSearchResults(results: SearchMain | string) {
		if (typeof results === 'string') return; // Handle error case
		//const theResults = parseSearchResponse(results);
		console.log('SearchMain raw:', results);

	if (!results.web?.results) {
		console.error('Missing web results:', results);
		webResults.set([]);
		return;
	}
//2026 Iran war - Wikipedia
		webResults.set(results.web.results);
	}

	// handleLoadingChange(loading: boolean): void
	function handleLoadingChange(loading: boolean): void {
		isLoading = loading;
	}

	// openLink(url: string): void
	function openLink(url: string) {
		open(url);
	}

	function toggleSelection(web: WebResult) {
		const exists = webSelectionState.selectedWebResults.find((r) => r.url == web.url);
		if (exists) {
			webSelectionState.selectedWebResults = webSelectionState.selectedWebResults.filter((r) => r.url != web.url);
		} else {
			webSelectionState.selectedWebResults = [...webSelectionState.selectedWebResults, web];
		}
	}

	function placementVoid(){
		return;
	}

	async function downloadResults() {
	let query = get(searchQueryWritable);

	if (webSelectionState.selectedWebResults.length === 0) return;

	let folderName = '';
	let cleanQuery = query;

	const folderMatch = query.match(/^\*\/([^ ]+)\s*(.*)$/);

	if (folderMatch) {
		folderName = folderMatch[1];
		cleanQuery = folderMatch[2] || 'search-results';
	}

	const sanitizedQuery = cleanQuery.replace(/\s+/g, '-').toLowerCase();

	const content = webSelectionState.selectedWebResults
		.map((web, i) => {
			let text = `${i + 1}. ${web.title}\n`;
			text += `   ${web.description}\n`;
			text += `   URL: ${web.url}\n`;

			if (web.extra_snippets && web.extra_snippets.length > 0) {
				text += `   Snippets:\n`;
				web.extra_snippets.forEach((snippet, j) => {
					text += `     ${j + 1}. ${snippet}\n`;
				});
			}

			text += `\n`;
			return text;
		})
		.join('\n');

	const home = await homeDir();

	let baseDir = await join(home, 'Media', 'braveSearchApi', 'Web');

	if (folderName) {
		baseDir = await join(baseDir, folderName);
	}

	await mkdir(baseDir, { recursive: true });

	const defaultPath = await join(baseDir, `${sanitizedQuery}-web.txt`);

	const filePath = await save({
		filters: [{ name: 'Text', extensions: ['txt'] }],
		defaultPath
	});

	if (filePath) {
		await writeTextFile(filePath, content);
	}
	webSelectionState.selectedWebResults = [];
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
		onsearchWebResults={handleSearchResults}
		onsearchNewsResults={placementVoid}
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

			{#each $webResults as web, index}
				<div class="mb-6">
					<div class="flex items-start gap-2">
						<input
							type="checkbox"
							class="mt-2 text-4xl h-6 w-6 ascent-black text-black"
							checked={webSelectionState.selectedWebResults.some((r) => r.url == web.url)}
							onchange={() => toggleSelection(web)}
						/>
						<button
							class="cursor-pointer text-4xl text-red-500 hover:text-red-700"
							onclick={() => webResults.update((results) => results.filter((_, i) => i !== index))}
						>
							✕
						</button>
						<div class="flex-1">
							<div class="text-black text-3xl font-semibold">{@html web.title}</div>
							<div class="text-black text-2xl">{@html web.description}</div>
							{#if web.extra_snippets && web.extra_snippets.length > 0}
								<div class="mt-2 border-l-2 border-gray-300 pl-4">
									<div class="mb-1 text-xl text-gray-500">Additional snippets:</div>
									{#each web.extra_snippets as snippet, i}
										<div class="mb-1 text-lg text-red-700">{i + 1}. {snippet}</div>
									{/each}
								</div>
							{/if}
							<a
								href={web.url}
								class="cursor-pointer text-blue-500 underline"
								onclick={(e) => {
									e.preventDefault();
									openLink(web.url);
								}}
							>
								{web.url}
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Right Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {rightOpen ? 'w-[10%]' : 'w-0'}"></div>
	</div>
</div>
