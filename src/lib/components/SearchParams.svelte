// SearchParams.svelte
<svelte:options runes={true} />

<script lang="ts">
	import {
		countries,
		languages,
		Freshness,
		SafeSearch
	} from '$lib/types/braveInterfaces';
	import { Dropdown, Button, Radio, Checkbox } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { 
		webParamsStore,
		newsParamsStore,
		videosParamsStore,
		imagesParamsStore,
		type SearchType 
	} from '$lib/stores/searchTabParamsStore';

	// searchType: SearchType (required)
	let { searchType }: { searchType: SearchType } = $props();

	// Determine which features are available for this search type
	const hasOffset = searchType !== 'images';
	const hasFreshness = searchType !== 'images';
	const hasExtraSnippets = searchType === 'web' || searchType === 'news';
	const hasGoggles = searchType === 'web' || searchType === 'news';
	const hasFetchMetadata = searchType === 'web';
	const hasSpellcheck = searchType === 'videos' || searchType === 'images';

	// Get country/language for derived labels (all types have these)
	const selectedLabel = $derived(() => {
		if (searchType === 'web') return countries.find((c) => c.key === $webParamsStore.country)?.label ?? 'Countries';
		if (searchType === 'news') return countries.find((c) => c.key === $newsParamsStore.country)?.label ?? 'Countries';
		if (searchType === 'videos') return countries.find((c) => c.key === $videosParamsStore.country)?.label ?? 'Countries';
		return countries.find((c) => c.key === $imagesParamsStore.country)?.label ?? 'Countries';
	});
	const selectedLangLabel = $derived(() => {
		if (searchType === 'web') return languages.find((l) => l.key === $webParamsStore.language)?.label ?? 'Languages';
		if (searchType === 'news') return languages.find((l) => l.key === $newsParamsStore.language)?.label ?? 'Languages';
		if (searchType === 'videos') return languages.find((l) => l.key === $videosParamsStore.language)?.label ?? 'Languages';
		return languages.find((l) => l.key === $imagesParamsStore.language)?.label ?? 'Languages';
	});
</script>

<div class="mb-1">
	<!-- Count (all types) -->
	<div class="flex items-center gap-2 mb-4">
		<label class="text-red-600">C</label>
		{#if searchType === 'web'}
			<input type="number" min="0" max="20" value={$webParamsStore.count}
				onchange={(e) => { const val = parseInt(e.currentTarget.value) || 0; webParamsStore.update(p => ({ ...p, count: Math.min(20, Math.max(0, val)) })); }}
				class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1" />
		{:else if searchType === 'news'}
			<input type="number" min="0" max="50" value={$newsParamsStore.count}
				onchange={(e) => { const val = parseInt(e.currentTarget.value) || 0; newsParamsStore.update(p => ({ ...p, count: Math.min(50, Math.max(0, val)) })); }}
				class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1" />
		{:else if searchType === 'videos'}
			<input type="number" min="0" max="50" value={$videosParamsStore.count}
				onchange={(e) => { const val = parseInt(e.currentTarget.value) || 0; videosParamsStore.update(p => ({ ...p, count: Math.min(50, Math.max(0, val)) })); }}
				class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1" />
		{:else}
			<input type="number" min="0" max="200" value={$imagesParamsStore.count}
				onchange={(e) => { const val = parseInt(e.currentTarget.value) || 0; imagesParamsStore.update(p => ({ ...p, count: Math.min(200, Math.max(0, val)) })); }}
				class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1" />
		{/if}

		<!-- Offset (web, news, videos only) -->
		{#if hasOffset}
			<label class="text-red-600">O</label>
			{#if searchType === 'web'}
				<input type="number" min="0" max="9" value={$webParamsStore.offset}
					onchange={(e) => { const val = parseInt(e.currentTarget.value) || 0; webParamsStore.update(p => ({ ...p, offset: Math.min(9, Math.max(0, val)) })); }}
					class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1" />
			{:else if searchType === 'news'}
				<input type="number" min="0" max="9" value={$newsParamsStore.offset}
					onchange={(e) => { const val = parseInt(e.currentTarget.value) || 0; newsParamsStore.update(p => ({ ...p, offset: Math.min(9, Math.max(0, val)) })); }}
					class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1" />
			{:else}
				<input type="number" min="0" max="9" value={$videosParamsStore.offset}
					onchange={(e) => { const val = parseInt(e.currentTarget.value) || 0; videosParamsStore.update(p => ({ ...p, offset: Math.min(9, Math.max(0, val)) })); }}
					class="w-16 h-10 text-center text-lg text-black rounded border border-gray-300 p-1" />
			{/if}
		{/if}
	</div>

	<!-- Checkboxes for web/news specific params -->
	<div class="flex flex-col gap-2 mb-4">
		{#if hasExtraSnippets}
			{#if searchType === 'web'}
				<Checkbox checked={$webParamsStore.extraSnippets} onchange={() => webParamsStore.update(p => ({ ...p, extraSnippets: !p.extraSnippets }))}>
					<span class="text-red-600">Extra Snippets</span>
				</Checkbox>
			{:else}
				<Checkbox checked={$newsParamsStore.extraSnippets} onchange={() => newsParamsStore.update(p => ({ ...p, extraSnippets: !p.extraSnippets }))}>
					<span class="text-red-600">Extra Snippets</span>
				</Checkbox>
			{/if}
		{/if}
		{#if hasFetchMetadata}
			<Checkbox checked={$webParamsStore.fetchMetadata} onchange={() => webParamsStore.update(p => ({ ...p, fetchMetadata: !p.fetchMetadata }))}>
				<span class="text-red-600">Fetch Meta Data</span>
			</Checkbox>
		{/if}
		{#if hasGoggles}
			{#if searchType === 'web'}
				<Checkbox checked={$webParamsStore.goggles} onchange={() => webParamsStore.update(p => ({ ...p, goggles: !p.goggles }))}>
					<span class="text-red-600">Goggles</span>
				</Checkbox>
			{:else}
				<Checkbox checked={$newsParamsStore.goggles} onchange={() => newsParamsStore.update(p => ({ ...p, goggles: !p.goggles }))}>
					<span class="text-red-600">Goggles</span>
				</Checkbox>
			{/if}
		{/if}
		{#if hasSpellcheck}
			{#if searchType === 'videos'}
				<Checkbox checked={$videosParamsStore.spellcheck} onchange={() => videosParamsStore.update(p => ({ ...p, spellcheck: !p.spellcheck }))}>
					<span class="text-red-600">Spellcheck</span>
				</Checkbox>
			{:else}
				<Checkbox checked={$imagesParamsStore.spellcheck} onchange={() => imagesParamsStore.update(p => ({ ...p, spellcheck: !p.spellcheck }))}>
					<span class="text-red-600">Spellcheck</span>
				</Checkbox>
			{/if}
		{/if}
	</div>

	<!-- Safe Search (all types) -->
	<label class="block font-semibold tracking-widest text-red-600">Safe Search</label>
	<div class="flex flex-col">
		{#if searchType === 'web'}
			<Radio name="{searchType}-safesearch" checked={$webParamsStore.safesearch === SafeSearch.off} onchange={() => webParamsStore.update(p => ({ ...p, safesearch: SafeSearch.off }))} value={SafeSearch.off}><span class="text-white">Off</span></Radio>
			<Radio name="{searchType}-safesearch" checked={$webParamsStore.safesearch === SafeSearch.moderate} onchange={() => webParamsStore.update(p => ({ ...p, safesearch: SafeSearch.moderate }))} value={SafeSearch.moderate}><span class="text-white">Moderate</span></Radio>
			<Radio name="{searchType}-safesearch" checked={$webParamsStore.safesearch === SafeSearch.strict} onchange={() => webParamsStore.update(p => ({ ...p, safesearch: SafeSearch.strict }))} value={SafeSearch.strict}><span class="text-white">Strict</span></Radio>
		{:else if searchType === 'news'}
			<Radio name="{searchType}-safesearch" checked={$newsParamsStore.safesearch === SafeSearch.off} onchange={() => newsParamsStore.update(p => ({ ...p, safesearch: SafeSearch.off }))} value={SafeSearch.off}><span class="text-white">Off</span></Radio>
			<Radio name="{searchType}-safesearch" checked={$newsParamsStore.safesearch === SafeSearch.moderate} onchange={() => newsParamsStore.update(p => ({ ...p, safesearch: SafeSearch.moderate }))} value={SafeSearch.moderate}><span class="text-white">Moderate</span></Radio>
			<Radio name="{searchType}-safesearch" checked={$newsParamsStore.safesearch === SafeSearch.strict} onchange={() => newsParamsStore.update(p => ({ ...p, safesearch: SafeSearch.strict }))} value={SafeSearch.strict}><span class="text-white">Strict</span></Radio>
		{:else if searchType === 'videos'}
			<Radio name="{searchType}-safesearch" checked={$videosParamsStore.safesearch === SafeSearch.off} onchange={() => videosParamsStore.update(p => ({ ...p, safesearch: SafeSearch.off }))} value={SafeSearch.off}><span class="text-white">Off</span></Radio>
			<Radio name="{searchType}-safesearch" checked={$videosParamsStore.safesearch === SafeSearch.moderate} onchange={() => videosParamsStore.update(p => ({ ...p, safesearch: SafeSearch.moderate }))} value={SafeSearch.moderate}><span class="text-white">Moderate</span></Radio>
			<Radio name="{searchType}-safesearch" checked={$videosParamsStore.safesearch === SafeSearch.strict} onchange={() => videosParamsStore.update(p => ({ ...p, safesearch: SafeSearch.strict }))} value={SafeSearch.strict}><span class="text-white">Strict</span></Radio>
		{:else}
			<!-- Images only has off/strict -->
			<Radio name="{searchType}-safesearch" checked={$imagesParamsStore.safesearch === SafeSearch.off} onchange={() => imagesParamsStore.update(p => ({ ...p, safesearch: SafeSearch.off }))} value={SafeSearch.off}><span class="text-white">Off</span></Radio>
			<Radio name="{searchType}-safesearch" checked={$imagesParamsStore.safesearch === SafeSearch.strict} onchange={() => imagesParamsStore.update(p => ({ ...p, safesearch: SafeSearch.strict }))} value={SafeSearch.strict}><span class="text-white">Strict</span></Radio>
		{/if}
	</div>

	<!-- Freshness (web, news, videos only) -->
	{#if hasFreshness}
		<label class="block font-semibold tracking-widest text-red-600">Freshness</label>
		<div class="flex flex-col">
			{#if searchType === 'web'}
				<Radio name="{searchType}-freshness" checked={$webParamsStore.freshness === Freshness.pd} onchange={() => webParamsStore.update(p => ({ ...p, freshness: Freshness.pd }))} value={Freshness.pd}><span class="text-white">Last 24 hours</span></Radio>
				<Radio name="{searchType}-freshness" checked={$webParamsStore.freshness === Freshness.pw} onchange={() => webParamsStore.update(p => ({ ...p, freshness: Freshness.pw }))} value={Freshness.pw}><span class="text-white">Last 7 days</span></Radio>
				<Radio name="{searchType}-freshness" checked={$webParamsStore.freshness === Freshness.pm} onchange={() => webParamsStore.update(p => ({ ...p, freshness: Freshness.pm }))} value={Freshness.pm}><span class="text-white">Last 31 days</span></Radio>
				<Radio name="{searchType}-freshness" checked={$webParamsStore.freshness === Freshness.py} onchange={() => webParamsStore.update(p => ({ ...p, freshness: Freshness.py }))} value={Freshness.py}><span class="text-white">Last 365 days</span></Radio>
			{:else if searchType === 'news'}
				<Radio name="{searchType}-freshness" checked={$newsParamsStore.freshness === Freshness.pd} onchange={() => newsParamsStore.update(p => ({ ...p, freshness: Freshness.pd }))} value={Freshness.pd}><span class="text-white">Last 24 hours</span></Radio>
				<Radio name="{searchType}-freshness" checked={$newsParamsStore.freshness === Freshness.pw} onchange={() => newsParamsStore.update(p => ({ ...p, freshness: Freshness.pw }))} value={Freshness.pw}><span class="text-white">Last 7 days</span></Radio>
				<Radio name="{searchType}-freshness" checked={$newsParamsStore.freshness === Freshness.pm} onchange={() => newsParamsStore.update(p => ({ ...p, freshness: Freshness.pm }))} value={Freshness.pm}><span class="text-white">Last 31 days</span></Radio>
				<Radio name="{searchType}-freshness" checked={$newsParamsStore.freshness === Freshness.py} onchange={() => newsParamsStore.update(p => ({ ...p, freshness: Freshness.py }))} value={Freshness.py}><span class="text-white">Last 365 days</span></Radio>
			{:else}
				<Radio name="{searchType}-freshness" checked={$videosParamsStore.freshness === Freshness.pd} onchange={() => videosParamsStore.update(p => ({ ...p, freshness: Freshness.pd }))} value={Freshness.pd}><span class="text-white">Last 24 hours</span></Radio>
				<Radio name="{searchType}-freshness" checked={$videosParamsStore.freshness === Freshness.pw} onchange={() => videosParamsStore.update(p => ({ ...p, freshness: Freshness.pw }))} value={Freshness.pw}><span class="text-white">Last 7 days</span></Radio>
				<Radio name="{searchType}-freshness" checked={$videosParamsStore.freshness === Freshness.pm} onchange={() => videosParamsStore.update(p => ({ ...p, freshness: Freshness.pm }))} value={Freshness.pm}><span class="text-white">Last 31 days</span></Radio>
				<Radio name="{searchType}-freshness" checked={$videosParamsStore.freshness === Freshness.py} onchange={() => videosParamsStore.update(p => ({ ...p, freshness: Freshness.py }))} value={Freshness.py}><span class="text-white">Last 365 days</span></Radio>
			{/if}
		</div>
	{/if}
	<!-- Country (all types) -->
	<label class="block font-semibold tracking-widest text-red-600">Country</label>
	<div class="flex flex-col">
		<Button class="cursor-pointer">
			{selectedLabel()}
			<ChevronDownOutline class="ms-2 h-6 w-6 text-white" />
		</Button>
		<Dropdown simple class="w-44 max-h-64 overflow-y-auto space-y-3 p-3 text-sm">
			{#each countries as country}
				<li>
					{#if searchType === 'web'}
						<Radio name="{searchType}-country" checked={$webParamsStore.country === country.key} onchange={() => webParamsStore.update(p => ({ ...p, country: country.key }))} value={country.key}>{country.label}</Radio>
					{:else if searchType === 'news'}
						<Radio name="{searchType}-country" checked={$newsParamsStore.country === country.key} onchange={() => newsParamsStore.update(p => ({ ...p, country: country.key }))} value={country.key}>{country.label}</Radio>
					{:else if searchType === 'videos'}
						<Radio name="{searchType}-country" checked={$videosParamsStore.country === country.key} onchange={() => videosParamsStore.update(p => ({ ...p, country: country.key }))} value={country.key}>{country.label}</Radio>
					{:else}
						<Radio name="{searchType}-country" checked={$imagesParamsStore.country === country.key} onchange={() => imagesParamsStore.update(p => ({ ...p, country: country.key }))} value={country.key}>{country.label}</Radio>
					{/if}
				</li>
			{/each}
		</Dropdown>

		<!-- Language (all types) -->
		<label class="block font-semibold tracking-widest text-red-600">Language</label>
		<div class="flex flex-col">
			<Button>
				{selectedLangLabel()}
				<ChevronDownOutline class="ms-2 h-6 w-6 text-white" />
			</Button>
			<Dropdown simple class="w-44 max-h-64 overflow-y-auto space-y-3 p-3 text-sm">
				{#each languages as language}
					<li>
						{#if searchType === 'web'}
							<Radio name="{searchType}-language" checked={$webParamsStore.language === language.key} onchange={() => webParamsStore.update(p => ({ ...p, language: language.key }))} value={language.key}>{language.label}</Radio>
						{:else if searchType === 'news'}
							<Radio name="{searchType}-language" checked={$newsParamsStore.language === language.key} onchange={() => newsParamsStore.update(p => ({ ...p, language: language.key }))} value={language.key}>{language.label}</Radio>
						{:else if searchType === 'videos'}
							<Radio name="{searchType}-language" checked={$videosParamsStore.language === language.key} onchange={() => videosParamsStore.update(p => ({ ...p, language: language.key }))} value={language.key}>{language.label}</Radio>
						{:else}
							<Radio name="{searchType}-language" checked={$imagesParamsStore.language === language.key} onchange={() => imagesParamsStore.update(p => ({ ...p, language: language.key }))} value={language.key}>{language.label}</Radio>
						{/if}
					</li>
				{/each}
			</Dropdown>
		</div>
	</div>
</div>
