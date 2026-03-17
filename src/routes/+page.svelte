<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParamsLtSlide.svelte';
	import { open } from '@tauri-apps/plugin-shell';
	import { save } from '@tauri-apps/plugin-dialog';
	import { writeTextFile } from '@tauri-apps/plugin-fs';
	import { webResults } from '$lib/stores/searchResultsStore';
	import type { BraveSearchResponse, WebResult } from '$lib/types/braveInterfaces';
	import { parseSearchResponse } from '$lib/utils/parseSearch';
	import { searchQueryWritable } from '$lib/stores/searchTabParamsStore';
	import { get } from 'svelte/store';

	const searchType = 'web' as const;

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

	let selectedWebResults: WebResult[] = $state([]);

	function leftSidebar() {
		leftOpen = !leftOpen;
	}

	// handleSearchResults(results: BraveSearchResponse): void
	function handleSearchResults(results: BraveSearchResponse | string) {
		if (typeof results === 'string') return; // Handle error case
		const theResults = parseSearchResponse(results);
		webResults.set(theResults.web);
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
		const exists = selectedWebResults.find((r) => r.url == web.url);
		if (exists) {
			selectedWebResults = selectedWebResults.filter((r) => r.url != web.url);
		} else {
			selectedWebResults = [...selectedWebResults, web];
		}
	}

	async function downloadResults() {
		const query = get(searchQueryWritable);
		const sanitizedQuery = query.replace(/\s+/g, '-').toLowerCase();

		if (selectedWebResults.length == 0) {
			return;
		}

		const content = selectedWebResults
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

		// Open save dialog
		const filePath = await save({
			filters: [{ name: 'Text', extensions: ['txt'] }],
			defaultPath: `${sanitizedQuery}-web-results.txt`
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

			{#each $webResults as web, index}
				<div class="mb-6">
					<div class="flex items-start gap-2">
						<input
							type="checkbox"
							class="mt-2"
							checked={selectedWebResults.some((r) => r.url == web.url)}
							onchange={() => toggleSelection(web)}
						/>
						<button
							class="cursor-pointer text-2xl text-red-500 hover:text-red-700"
							onclick={() => webResults.update((results) => results.filter((_, i) => i !== index))}
						>
							✕
						</button>
						<div class="flex-1">
							<div class="text-3xl font-semibold">{@html web.title}</div>
							<div class="text-2xl">{@html web.description}</div>
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
