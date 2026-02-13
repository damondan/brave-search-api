<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';
	import {
		 webResults, 
		 videoResults, 
		 newsResults, 
		 discussionResults, 
		 faqResults }
	 from "$lib/stores/searchResults";
	import type { BraveSearchResponse } from '$lib/types/brave';
	import { parseSearchResponse } from "$lib/utils/parseSearch";

	let leftOpen = $state(false);
	let rightOpen = $state(false);
	let isLoading = $state(false);

	function handleLoadBraveWebSearch(results:BraveSearchResponse){
		const theResults = parseSearchResponse(results);
		webResults.set(theResults.web);
		videoResults.set(theResults.videos);
		newsResults.set(theResults.news);
		discussionResults.set(theResults.discussions);
		faqResults.set(theResults.faq);
	}

	function handleLoadingChange(loading: boolean): void {
    	isLoading = loading;
    }

</script>

<div class="flex flex-col">
	<SearchComponent
	 onsearchResults={handleLoadBraveWebSearch}
     onloadingChange={handleLoadingChange}
	/>

	<div class="flex flex-1">
		<!-- Left Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {leftOpen ? 'w-[10%]' : 'w-0'}"></div>

		<!-- Main Content -->
		<div class="flex-1 overflow-y-auto border border-amber-600">
			 {#if isLoading}
				<div class="spinner-overlay tw-spinner-overlay">
					<div class="spinner custom-spinner"></div>
				</div>
    		{/if}

			{#each $webResults as web }
				 <div class="mb-6">
					<div class="font-semibold">{web.title}</div>
					<div>{web.description}</div>
					<div class="text-blue-500">{web.url}</div>
				</div>
			{/each}

		</div>

		<!-- Right Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {rightOpen ? 'w-[10%]' : 'w-0'}"></div>
	</div>
</div>
