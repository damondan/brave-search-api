<script lang="ts">
	import { v2aprevSearchesWritable } from '$lib/stores/state.svelte';

	$effect(() => {
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	});

	type Props = {
		searchQuery: string;
		loading: boolean;
		handleSearch: () => void;
	};

	let { searchQuery = $bindable(), loading = $bindable(), handleSearch }: Props = $props();

	let showDropdown = $state(false);

	function prevSearchGo(prev: string) {
		searchQuery = prev;
		showDropdown = false;
		//handleSearchDispatch();
	}

	const deleteSearchItem = (index: number) => {
		v2aprevSearchesWritable.splice(index, 1);
	};

	const handleInputClick = () => {
		console.log('handleInputClick Fired');
		if (v2aprevSearchesWritable.length > 0) {
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

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			console.log('Enter key pressed');
			handleSearch();
		}
	}
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
		onclick={handleSearch}
		class="font-comic shadow-soft cursor-pointer rounded bg-blue-600 px-1 py-1
		text-white hover:bg-blue-800"
		>Search
	</button>
	{#if loading}
		<div class="flex justify-center py-4">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 !border-t-blue-500"
			></div>
		</div>
	{/if}

	{#if showDropdown}
		<div
			id="prevSearchDropDn"
			class="absolute z-50 w-[80%] rounded border bg-white text-black shadow"
		>
			{#each v2aprevSearchesWritable as prev, i (i)}
				<div
					class="w-full border-3 border-amber-500 px-4 py-2 hover:bg-gray-100"
					onclick={() => prevSearchGo(prev)}
				>
					<span>{prev}</span>
					<button
						class="float-right bg-red-500 text-white hover:text-red-700"
						onclick={(e) => {
							e.stopPropagation();
							deleteSearchItem(i);
						}}
					>
						✕
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
