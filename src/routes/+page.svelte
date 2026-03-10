<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import SearchParams from '$lib/components/SearchParams.svelte';
	import { open } from '@tauri-apps/plugin-shell';
	import { webResults } from '$lib/stores/searchResultsStore';
	import type { BraveSearchResponse } from '$lib/types/braveInterfaces';
	import { parseSearchResponse } from '$lib/utils/parseSearch';

	const searchType = 'web' as const;

	let leftOpen = $state(false);
	let isLoading = $state(false);
	let rightOpen = $state(false);

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
</script>

<div class="flex flex-col">
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

			{#each $webResults as web}
				<div class="mb-6">
					<div class="text-3xl font-semibold">{@html web.title}</div>
					<div class="text-2xl">{@html web.description}</div>
					{#if web.extra_snippets && web.extra_snippets.length > 0}
						<div class="mt-2 border-l-2 border-gray-300 pl-4">
							<div class="mb-1 text-xl text-gray-500">Additional snippets:</div>
							{#each web.extra_snippets as snippet, i}
								<div class="mb-1 text-lg text-red-700">{i + 1}. {snippet}</div>
							{/each}
						</div>
						<!-- {:else}
							<div class="text-gray-400 text-xs inline-block">No extra snippets</div> -->
					{/if}
					<a
						href={web.url}
						class="cursor-pointer text-blue-500 underline"
						onclick={(e) => {
							e.preventDefault(); // Prevent default <a> navigation
							openLink(web.url); // Open via Tauri shell
						}}
					>
						{web.url}
					</a>
				</div>
			{/each}
		</div>

		<!-- Right Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {rightOpen ? 'w-[10%]' : 'w-0'}"></div>
	</div>
</div>
