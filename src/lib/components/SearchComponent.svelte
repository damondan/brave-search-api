<script lang="ts">
	import { browser } from '$app/environment';
	import { invoke } from '@tauri-apps/api/core';
	import { type BraveSearchResponse } from '$lib/types/braveInterfaces';
	import {
		previousSearchesWritable,
		searchQueryWritable,
		webParamsStore,
		newsParamsStore,
		videosParamsStore,
		imagesParamsStore,
		type SearchType
	} from '$lib/stores/searchTabParamsStore';
	import { get } from 'svelte/store';

	let searchQuery: string = $state('');
	// searchType: SearchType (required), onsearchResults: (results: BraveSearchResponse | string) => void, onloadingChange?: (loading: boolean) => void
	let { searchType, onsearchResults, onloadingChange }: { searchType: SearchType, 
		onsearchResults: (results: BraveSearchResponse | string) => void, onloadingChange?: (loading: boolean) => void } = $props();

	let showDropdown = $state(false);
	let loading: boolean = $state(false);

	// handleSearchDispatch(): Promise<void>
	async function handleSearchDispatch() {
		console.log('**********handleSearchDispatch*************');
		searchQueryWritable.set(searchQuery);
		if (!searchQuery.trim()) {
			console.error('Search Query is Missing');
			onsearchResults?.('noSearchTermAndNoPdfs');
			return;
		}

		updateSearch(searchQuery);
		
		// Build invoke params based on search type
		let invokeParams: Record<string, unknown> = { query: searchQuery };
		
		if (searchType === 'web') {
			const params = get(webParamsStore);
			console.log(`[web] Extra Snippets: ${params.extraSnippets}`);
			invokeParams = {
				...invokeParams,
				count: params.count > 0 ? params.count : null,
				offset: params.offset > 0 ? params.offset : null,
				extraSnippets: params.extraSnippets,
				country: params.country,
				language: params.language,
				safesearch: params.safesearch,
				freshness: params.freshness,
				goggles: params.goggles,
				fetchMetadata: params.fetchMetadata
			};
		} else if (searchType === 'news') {
			const params = get(newsParamsStore);
			console.log(`[news] Extra Snippets: ${params.extraSnippets}`);
			invokeParams = {
				...invokeParams,
				count: params.count > 0 ? params.count : null,
				offset: params.offset > 0 ? params.offset : null,
				extraSnippets: params.extraSnippets,
				country: params.country,
				language: params.language,
				safesearch: params.safesearch,
				freshness: params.freshness,
				goggles: params.goggles
			};
		} else if (searchType === 'videos') {
			const params = get(videosParamsStore);
			invokeParams = {
				...invokeParams,
				count: params.count > 0 ? params.count : null,
				offset: params.offset > 0 ? params.offset : null,
				country: params.country,
				language: params.language,
				safesearch: params.safesearch,
				freshness: params.freshness,
				spellcheck: params.spellcheck
			};
		} else if (searchType === 'images') {
			const params = get(imagesParamsStore);
			invokeParams = {
				...invokeParams,
				count: params.count > 0 ? params.count : null,
				country: params.country,
				language: params.language,
				safesearch: params.safesearch,
				spellcheck: params.spellcheck
			};
		}
		
		try {
			loading = true;
			onloadingChange?.(loading);

			// invoke(command_name, { argument_name: value })
			// Calls search_brave in lib.rs with params specific to search type
			const command = searchType === 'news' ? 'search_news_brave' : null;
			const response = await invoke<string>('search_brave', invokeParams);
			const raw: BraveSearchResponse = JSON.parse(response);

			loading = false;
			onloadingChange?.(loading);
			onsearchResults?.(raw);

			// Clear input and hide dropdown after successful search
			searchQuery = '';
		} catch (error) {
			console.error('Error in handleSearch:', error);
			loading = false;
			onloadingChange?.(loading);
		}
	}

	// Show dropdown if there are previous searches
	const handleInputClick = () => {
		console.log('handleInputClick Fired');
		if ($previousSearchesWritable.length > 0) {
			console.log('previous searches is true');
			showDropdown = true;
		}
	};

	const handleClickOutside = (event: Event) => {
		console.log('handleClickOutside');
		const dropdown = document.getElementById('prevSearchDropDn');
		const inputField = document.getElementById('search');
		const target = event.target as Node;
		if (dropdown && inputField && !dropdown.contains(target) && !inputField.contains(target)) {
			console.log('handleClickOutside and showDropdown is false');
			showDropdown = false;
		}
	};

	function updateSearch(searchWord: string): void {
		previousSearchesWritable.update((searches: string[]) => {
			if (!searches.includes(searchWord)) {
				searches = [searchWord, ...searches].slice(0, 10);
			}
			return searches;
		});
		console.log($previousSearchesWritable);
	}

	// When clicking enter execute handleSearchDispatch
	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			console.log('Enter key pressed');
			handleSearchDispatch();
		}
	}

	const deleteSearchItem = (index: number) => {
		previousSearchesWritable.update((items) => {
			return items.filter((_, i) => i !== index);
		})
	}

	function prevSearchGo(prev:string){
		searchQuery = prev;
		showDropdown = false;
		//handleSearchDispatch();
	}

	// Close dropdown if clicked outside
	$effect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
});
</script>

<div
	class="search-bar shadow-soft relative mx-auto w-[90%] max-w-[600px]
			gap-1"
>
	<!-- Input Field with Click Event -->
	<input
		type="text"
		id="search"
		name="search"
		placeholder="Search..."
		bind:value={searchQuery}
		onclick={handleInputClick}
		onkeydown={handleInputKeydown}
		autocomplete="off"
		class="font-comic w-[80%] rounded border border-gray-300 p-2 text-black"
	/>

	<!-- Search Button -->
	<button
		onclick={handleSearchDispatch}
		class="font-comic shadow-soft cursor-pointer rounded bg-blue-600 px-1 py-1
		text-white hover:bg-blue-800"
		>Search
	</button>
	{#if loading}
		<div class="spinner"></div>
	{/if}

	{#if showDropdown}
		<div id="prevSearchDropDn" class="absolute z-50 w-[80%] rounded border bg-white shadow">
			{#each $previousSearchesWritable as prev, i (i)}
				<div class="w-full border-3 border-amber-500 px-4 py-2 hover:bg-gray-100" onclick={() => prevSearchGo(prev)}>
					<span>{prev}</span>
					<button class="float-right text-white hover:text-red-700 bg-red-500" onclick={(e)=>{e.stopPropagation(); deleteSearchItem(i)}}>
						✕
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
