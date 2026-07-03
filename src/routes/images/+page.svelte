<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParamsLtSlide.svelte';
	import ImageResultsPage from '$lib/components/ImageResultsPage.svelte';
	import { imageResults } from '$lib/stores/searchResultsStore';
	//import type {  } from '$lib/types/braveInterfaces';
	import type { ImagesResult } from '$lib/types/imagesResultsInterface';
	import { parseSearchResponse } from '$lib/utils/parseSearch';
	import { save } from '@tauri-apps/plugin-dialog';
	import { open } from '@tauri-apps/plugin-shell';
	import { homeDir, join } from '@tauri-apps/api/path';

	import { writeTextFile, mkdir } from '@tauri-apps/plugin-fs';
	import { searchQueryWritable } from '$lib/stores/searchTabParamsStore';
	import { get } from 'svelte/store';
	import type { Image } from '@tauri-apps/api/image';

	const searchType = 'images' as const;

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

	let selectedImageResults: ImagesResult[] = $state([]);

	function leftSidebar() {
		leftOpen = !leftOpen;
	}

	// handleSearchResults(results: BraveSearchResponse | string): void
	function handleSearchResults(results: ImagesResult[] | string) {
		if (typeof results === 'string') return;
		//console.log('Raw images response:', results);
		//const theResults = parseSearchResponse(results);
		//console.log('Parsed image results:', theResults.image);
		imageResults.set(results);
	}

	function toggleSelection(image: ImagesResult) {
		const exists = selectedImageResults.find((r) => r.url == image.url);
		if (exists) {
			selectedImageResults = selectedImageResults.filter((r) => r.url != image.url);
		} else {
			selectedImageResults = [...selectedImageResults, image];
		}
	}

	async function downloadResults() {
		let query = get(searchQueryWritable);

		if (selectedImageResults.length === 0) return;

		let folderName = '';
		let cleanQuery = query;

		const folderMatch = query.match(/^\*\/([^ ]+)\s*(.*)$/);

		if (folderMatch) {
			folderName = folderMatch[1];
			cleanQuery = folderMatch[2] || 'search-results';
		}

		const sanitizedQuery = cleanQuery.replace(/\s+/g, '-').toLowerCase();

		const content = selectedImageResults
			.map((image, i) => {
				let text = `${i + 1}. ${image.title}\n`;
				text += `   URL: ${image.url}\n`;

				text += `\n`;
				return text;
			})
			.join('\n');

		const home = await homeDir();

		let baseDir = await join(home, 'Media', 'braveSearchApi', 'Images');

		if (folderName) {
			baseDir = await join(baseDir, folderName);
		}

		await mkdir(baseDir, { recursive: true });

		const defaultPath = await join(baseDir, `${sanitizedQuery}-images.txt`);

		const filePath = await save({
			filters: [{ name: 'Text', extensions: ['txt'] }],
			defaultPath
		});

		if (filePath) {
			await writeTextFile(filePath, content);
		}
	}

	// handleLoadingChange(loading: boolean): void
	function handleLoadingChange(loading: boolean): void {
		isLoading = loading;
	}

	function placementVoid() {
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
		onsearchNewsResults={placementVoid}
		onsearchVidsResults={placementVoid}
		onsearchImagesResults={handleSearchResults}
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

			<ImageResultsPage
				results={$imageResults}
				{selectedImageResults}
				onToggleSelection={toggleSelection}
			/>
		</div>

		<!-- Right Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {rightOpen ? 'w-[10%]' : 'w-0'}"></div>
	</div>
</div>
