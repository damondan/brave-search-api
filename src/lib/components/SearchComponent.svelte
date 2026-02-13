<script lang="ts">
	import { browser } from "$app/environment";
	import { invoke } from "@tauri-apps/api/core";
	import {
		previousSearchesWritable,
		searchQueryWritable,
	} from "$lib/store.js";

	let searchQuery: string = $state("");
	let { onsearchResults, onloadingChange } = $props();
	let showDropdown = $state(false);
	let loading: boolean = $state(false);


	// Replace the existing handleSearchDispatch function with this updated version:
	async function handleSearchDispatch() {
		console.log("**********handleSearchDispatch*************");

		searchQueryWritable.set(searchQuery);

		if (!searchQuery.trim()) {
			console.error("Search Query is Missing");
			onsearchResults?.("noSearchTermAndNoPdfs");
			return;
		}

		updateSearch(searchQuery);

		try {
			loading = true;
			onloadingChange?.(loading);

		// invoke(command_name, { argument_name: value })
			// Calls search_brave(query: String) in lib.rs
			const response = await invoke<string>("search_brave", { query: searchQuery });
			const result = JSON.parse(response);

			loading = false;
			onloadingChange?.(loading);
			onsearchResults?.(result);

			// Clear input and hide dropdown after successful search
			searchQuery = "";
		} catch (error) {
			console.error("Error in handleSearch:", error);
			loading = false;
			onloadingChange?.(loading);
		}
	}

	// Show dropdown if there are previous searches
	const handleInputClick = () => {
		if ($previousSearchesWritable.length > 0) {
			showDropdown = true;
		}
	};

	const handleClickOutside = (event: Event) => {
		console.log("nadleCLickOutside");
		const dropdown = document.getElementById("search-dropdn");
		const inputField = document.getElementById("search");
		const target = event.target as Node;
		if (
			dropdown &&
			inputField &&
			!dropdown.contains(target) &&
			!inputField.contains(target)
		) {
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
		if (event.key === "Enter") {
			console.log("Enter key pressed");
			handleSearchDispatch();
		}
	}

	// Close dropdown if clicked outside
	if (browser) {
		window.addEventListener("click", handleClickOutside);
	}

</script>

<div class="search-bar h-10 flex gap-1 relative w-[90%] max-w-[600px] mx-auto 
			shadow-soft">
	<!-- Input Field with Click Event -->
	<input
		type="text"
		id="search"
		name="search"
		placeholder="Search..."
		bind:value={searchQuery}
		on:click={handleInputClick}
		on:keydown={handleInputKeydown}
		autocomplete="off"
	class="flex-grow font-comic text-black p-2 border border-gray-300 rounded"/>

	<!-- Search Button -->
	<button 
		on:click={handleSearchDispatch}
		class="bg-blue-600 hover:bg-blue-800 text-black px-1 py-1 rounded font-comic 
		shadow-soft cursor-pointer">Search
	</button>

	{#if loading}
		<div class="spinner"></div>
	{/if}


</div>

