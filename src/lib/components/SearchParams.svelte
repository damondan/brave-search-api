<svelte:options runes={true} />

<script lang="ts">
	import {
		type SearchParams,
		type Country,
		countries,
		type Language,
		languages,
		Freshness,
		SafeSearch
	} from '$lib/types/brave';
	import { Dropdown, Button, Radio, Checkbox } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
import {
		countStore,
		offSetStore,
		extraSnippetsStore,
		fetchMetadataStore,
		gogglesStore,
		safesearchStore,
		freshnessStore,
		countryStore,
		languageStore
	} from '$lib/store';
	
	const selectedLabel = $derived(
		countries.find((c) => c.key === $countryStore)?.label ?? 'Countries'
	);
	const selectedLangLabel = $derived(
		languages.find((l) => l.key === $languageStore)?.label ?? 'Languages'
	);
</script>

<div class="mb-1">
	<div class="flex items-center gap-2 mb-4">
		<label class="text-red-600">C</label>
		<input
			type="number"
			min="0"
			max="15"
			value={$countStore}
			onchange={(e) => {
				const val = parseInt(e.currentTarget.value) || 0;
				countStore.set(Math.min(15, Math.max(0, val)));
			}}
			class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1
				[&::-webkit-inner-spin-button]:h-8 [&::-webkit-inner-spin-button]:w-6
				[&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
		/>
		<label class="text-red-600">O</label>
		 <input
			type="number"
			min="0"
			max="15"
			value={$offSetStore}
			onchange={(e) => {
				const val = parseInt(e.currentTarget.value) || 0;
				offSetStore.set(Math.min(9, Math.max(0, val)));
			}}
			class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1
				[&::-webkit-inner-spin-button]:h-8 [&::-webkit-inner-spin-button]:w-6
				[&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:cursor-pointer"
		/>
	</div>
	<div class="flex flex-col gap-2 mb-4">
		<Checkbox checked={$extraSnippetsStore} onchange={() => extraSnippetsStore.update(v => !v)}>
			<span class="text-red-600">Extra Snippets</span>
		</Checkbox>
		<Checkbox checked={$fetchMetadataStore} onchange={() => fetchMetadataStore.update(v => !v)}>
			<span class="text-red-600">Fetch Meta Data</span>
		</Checkbox>
		<Checkbox checked={$gogglesStore} onchange={() => gogglesStore.update(v => !v)}>
			<span class="text-red-600">Goggles</span>
		</Checkbox>
	</div>
	<label class="block font-semibold tracking-widest text-red-600">Safe Search</label>
	<div class="flex flex-col">
		<Radio name="safesearch" bind:group={$safesearchStore} value={SafeSearch.off}>
			<span class="text-white">Off</span>
		</Radio>
		<Radio name="safesearch" bind:group={$safesearchStore} value={SafeSearch.moderate}>
			<span class="text-white">Moderate</span>
		</Radio>
		<Radio name="safesearch" bind:group={$safesearchStore} value={SafeSearch.strict}>
			<span class="text-white">Strict</span>
		</Radio>
	</div>
	<label class="block font-semibold tracking-widest text-red-600">Freshness</label>
	<div class="flex flex-col">
		<Radio name="freshness" bind:group={$freshnessStore} value={Freshness.pd}>
			<span class="text-white">Last 24 hours</span>
		</Radio>
		<Radio name="freshness" bind:group={$freshnessStore} value={Freshness.pw}>
			<span class="text-white">Last 7 days</span>
		</Radio>
		<Radio name="freshness" bind:group={$freshnessStore} value={Freshness.pm}>
			<span class="text-white">Last 31 days</span>
		</Radio>
		<Radio name="freshness" bind:group={$freshnessStore} value={Freshness.py}>
			<span class="text-white">Last 365 days</span>
		</Radio>
	</div>
	<label class="block font-semibold tracking-widest text-red-600">Country</label>
	<div class="flex flex-col">
		<Button class="cursor-pointer">
			{selectedLabel}
			<ChevronDownOutline class="ms-2 h-6 w-6 text-white" />
		</Button>
		<Dropdown simple class="w-44 max-h-64 overflow-y-auto space-y-3 p-3 text-sm">
			{#each countries as country}
				<li>
					<Radio name="country" bind:group={$countryStore} value={country.key}>
						{country.label}
					</Radio>
				</li>
			{/each}
		</Dropdown>
		<label class="block font-semibold tracking-widest text-red-600">Language</label>
	<div class="flex flex-col">
		<Button>
			{selectedLangLabel}
			<ChevronDownOutline class="ms-2 h-6 w-6 text-white" />
		</Button>
		<Dropdown simple class="w-44 max-h-64 overflow-y-auto space-y-3 p-3 text-sm">
			{#each languages as language}
				<li>
					<Radio name="language" bind:group={$languageStore} value={language.key}>
						{language.label}
					</Radio>
				</li>
			{/each}
		</Dropdown>
	</div>
	</div>
</div>
