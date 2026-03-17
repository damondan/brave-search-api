<svelte:options runes={true} />

<script lang="ts">
	import { countries, languages, Freshness, SafeSearch } from '$lib/types/braveInterfaces';
	import { Dropdown, Button, Radio, Checkbox, search } from 'flowbite-svelte';
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

	// Toggle state for search operators popup
	let showOperators = $state(false);

	// Determine which features are available for this search type
	const hasOffset = searchType !== 'images';
	const hasFreshness = searchType !== 'images';
	const hasExtraSnippets = searchType === 'web' || searchType === 'news';
	const hasGoggles = searchType === 'web' || searchType === 'news';
	const hasFetchMetadata = searchType === 'web';
	const hasSpellcheck = searchType === 'videos' || searchType === 'images';

	// Get country/language for derived labels (all types have these)
	const selectedLabel = $derived(() => {
		if (searchType === 'web')
			return countries.find((c) => c.key === $webParamsStore.country)?.label ?? 'Countries';
		if (searchType === 'news')
			return countries.find((c) => c.key === $newsParamsStore.country)?.label ?? 'Countries';
		if (searchType === 'videos')
			return countries.find((c) => c.key === $videosParamsStore.country)?.label ?? 'Countries';
		return countries.find((c) => c.key === $imagesParamsStore.country)?.label ?? 'Countries';
	});
	const selectedLangLabel = $derived(() => {
		if (searchType === 'web')
			return languages.find((l) => l.key === $webParamsStore.language)?.label ?? 'Languages';
		if (searchType === 'news')
			return languages.find((l) => l.key === $newsParamsStore.language)?.label ?? 'Languages';
		if (searchType === 'videos')
			return languages.find((l) => l.key === $videosParamsStore.language)?.label ?? 'Languages';
		return languages.find((l) => l.key === $imagesParamsStore.language)?.label ?? 'Languages';
	});
</script>

<div class="mb-1">
	<!-- Count (all types) -->
	<div class="mb-4 flex items-center gap-2">
		<label class="text-red-600">C</label>
		{#if searchType === 'web'}
			<input
				type="number"
				min="0"
				max="20"
				value={$webParamsStore.count}
				onchange={(e) => {
					const val = parseInt(e.currentTarget.value) || 0;
					webParamsStore.update((p) => ({ ...p, count: Math.min(20, Math.max(0, val)) }));
				}}
				class="h-10 w-16 rounded border border-gray-300 p-1 text-center text-lg text-black"
			/>
		{:else if searchType === 'news'}
			<input
				type="number"
				min="0"
				max="50"
				value={$newsParamsStore.count}
				onchange={(e) => {
					const val = parseInt(e.currentTarget.value) || 0;
					newsParamsStore.update((p) => ({ ...p, count: Math.min(50, Math.max(0, val)) }));
				}}
				class="h-10 w-16 rounded border border-gray-300 p-1 text-center text-lg text-black"
			/>
		{:else if searchType === 'videos'}
			<input
				type="number"
				min="0"
				max="50"
				value={$videosParamsStore.count}
				onchange={(e) => {
					const val = parseInt(e.currentTarget.value) || 0;
					videosParamsStore.update((p) => ({ ...p, count: Math.min(50, Math.max(0, val)) }));
				}}
				class="h-10 w-16 rounded border border-gray-300 p-1 text-center text-lg text-black"
			/>
		{:else}
			<input
				type="number"
				min="0"
				max="200"
				value={$imagesParamsStore.count}
				onchange={(e) => {
					const val = parseInt(e.currentTarget.value) || 0;
					imagesParamsStore.update((p) => ({ ...p, count: Math.min(200, Math.max(0, val)) }));
				}}
				class="h-10 w-16 rounded border border-gray-300 p-1 text-center text-lg text-black"
			/>
		{/if}

		<!-- Offset (web, news, videos only) -->
		{#if hasOffset}
			<label class="text-red-600">O</label>
			{#if searchType === 'web'}
				<input
					type="number"
					min="0"
					max="9"
					value={$webParamsStore.offset}
					onchange={(e) => {
						const val = parseInt(e.currentTarget.value) || 0;
						webParamsStore.update((p) => ({ ...p, offset: Math.min(9, Math.max(0, val)) }));
					}}
					class="h-10 w-16 rounded border border-gray-300 p-1 text-center text-lg text-black"
				/>
			{:else if searchType === 'news'}
				<input
					type="number"
					min="0"
					max="9"
					value={$newsParamsStore.offset}
					onchange={(e) => {
						const val = parseInt(e.currentTarget.value) || 0;
						newsParamsStore.update((p) => ({ ...p, offset: Math.min(9, Math.max(0, val)) }));
					}}
					class="h-10 w-16 rounded border border-gray-300 p-1 text-center text-lg text-black"
				/>
			{:else}
				<input
					type="number"
					min="0"
					max="9"
					value={$videosParamsStore.offset}
					onchange={(e) => {
						const val = parseInt(e.currentTarget.value) || 0;
						videosParamsStore.update((p) => ({ ...p, offset: Math.min(9, Math.max(0, val)) }));
					}}
					class="h-10 w-16 rounded border border-gray-300 p-1 text-center text-lg text-black"
				/>
			{/if}
		{/if}
	</div>

	<!-- Checkboxes for web/news specific params -->
	<div class="mb-4 flex flex-col gap-2">
		{#if hasExtraSnippets}
			{#if searchType === 'web'}
				<Checkbox
					checked={$webParamsStore.extraSnippets}
					onchange={() => webParamsStore.update((p) => ({ ...p, extraSnippets: !p.extraSnippets }))}
				>
					<span class="text-red-600">Extra Snippets</span>
				</Checkbox>
			{:else}
				<Checkbox
					checked={$newsParamsStore.extraSnippets}
					onchange={() =>
						newsParamsStore.update((p) => ({ ...p, extraSnippets: !p.extraSnippets }))}
				>
					<span class="text-red-600">Extra Snippets</span>
				</Checkbox>
			{/if}
		{/if}
		{#if hasFetchMetadata}
			<Checkbox
				checked={$webParamsStore.fetchMetadata}
				onchange={() => webParamsStore.update((p) => ({ ...p, fetchMetadata: !p.fetchMetadata }))}
			>
				<span class="text-red-600">Fetch Meta Data</span>
			</Checkbox>
		{/if}
		{#if hasGoggles}
			{#if searchType === 'web'}
				<Checkbox
					checked={$webParamsStore.goggles}
					onchange={() => webParamsStore.update((p) => ({ ...p, goggles: !p.goggles }))}
				>
					<span class="text-red-600">Goggles</span>
				</Checkbox>
			{:else}
				<Checkbox
					checked={$newsParamsStore.goggles}
					onchange={() => newsParamsStore.update((p) => ({ ...p, goggles: !p.goggles }))}
				>
					<span class="text-red-600">Goggles</span>
				</Checkbox>
			{/if}
		{/if}
		{#if hasSpellcheck}
			{#if searchType === 'videos'}
				<Checkbox
					checked={$videosParamsStore.spellcheck}
					onchange={() => videosParamsStore.update((p) => ({ ...p, spellcheck: !p.spellcheck }))}
				>
					<span class="text-red-600">Spellcheck</span>
				</Checkbox>
			{:else}
				<Checkbox
					checked={$imagesParamsStore.spellcheck}
					onchange={() => imagesParamsStore.update((p) => ({ ...p, spellcheck: !p.spellcheck }))}
				>
					<span class="text-red-600">Spellcheck</span>
				</Checkbox>
			{/if}
		{/if}
	</div>

	<!-- Safe Search (all types) -->
	<label class="block font-semibold tracking-widest text-red-600">Safe Search</label>
	<div class="flex flex-col">
		{#if searchType === 'web'}
			<Radio
				name="{searchType}-safesearch"
				checked={$webParamsStore.safesearch === SafeSearch.off}
				onchange={() => webParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.off }))}
				value={SafeSearch.off}><span class="text-white">Off</span></Radio
			>
			<Radio
				name="{searchType}-safesearch"
				checked={$webParamsStore.safesearch === SafeSearch.moderate}
				onchange={() => webParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.moderate }))}
				value={SafeSearch.moderate}><span class="text-white">Moderate</span></Radio
			>
			<Radio
				name="{searchType}-safesearch"
				checked={$webParamsStore.safesearch === SafeSearch.strict}
				onchange={() => webParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.strict }))}
				value={SafeSearch.strict}><span class="text-white">Strict</span></Radio
			>
		{:else if searchType === 'news'}
			<Radio
				name="{searchType}-safesearch"
				checked={$newsParamsStore.safesearch === SafeSearch.off}
				onchange={() => newsParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.off }))}
				value={SafeSearch.off}><span class="text-white">Off</span></Radio
			>
			<Radio
				name="{searchType}-safesearch"
				checked={$newsParamsStore.safesearch === SafeSearch.moderate}
				onchange={() => newsParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.moderate }))}
				value={SafeSearch.moderate}><span class="text-white">Moderate</span></Radio
			>
			<Radio
				name="{searchType}-safesearch"
				checked={$newsParamsStore.safesearch === SafeSearch.strict}
				onchange={() => newsParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.strict }))}
				value={SafeSearch.strict}><span class="text-white">Strict</span></Radio
			>
		{:else if searchType === 'videos'}
			<Radio
				name="{searchType}-safesearch"
				checked={$videosParamsStore.safesearch === SafeSearch.off}
				onchange={() => videosParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.off }))}
				value={SafeSearch.off}><span class="text-white">Off</span></Radio
			>
			<Radio
				name="{searchType}-safesearch"
				checked={$videosParamsStore.safesearch === SafeSearch.moderate}
				onchange={() =>
					videosParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.moderate }))}
				value={SafeSearch.moderate}><span class="text-white">Moderate</span></Radio
			>
			<Radio
				name="{searchType}-safesearch"
				checked={$videosParamsStore.safesearch === SafeSearch.strict}
				onchange={() => videosParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.strict }))}
				value={SafeSearch.strict}><span class="text-white">Strict</span></Radio
			>
		{:else}
			<!-- Images only has off/strict -->
			<Radio
				name="{searchType}-safesearch"
				checked={$imagesParamsStore.safesearch === SafeSearch.off}
				onchange={() => imagesParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.off }))}
				value={SafeSearch.off}><span class="text-white">Off</span></Radio
			>
			<Radio
				name="{searchType}-safesearch"
				checked={$imagesParamsStore.safesearch === SafeSearch.strict}
				onchange={() => imagesParamsStore.update((p) => ({ ...p, safesearch: SafeSearch.strict }))}
				value={SafeSearch.strict}><span class="text-white">Strict</span></Radio
			>
		{/if}
	</div>

	<!-- Freshness (web, news, videos only) -->
	{#if hasFreshness}
		<label class="block font-semibold tracking-widest text-red-600">Freshness</label>
		<div class="flex flex-col">
			{#if searchType === 'web'}
				<Radio
					name="{searchType}-freshness"
					checked={$webParamsStore.freshness === Freshness.pd}
					onchange={() => webParamsStore.update((p) => ({ ...p, freshness: Freshness.pd }))}
					value={Freshness.pd}><span class="text-white">Last 24 hours</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$webParamsStore.freshness === Freshness.pw}
					onchange={() => webParamsStore.update((p) => ({ ...p, freshness: Freshness.pw }))}
					value={Freshness.pw}><span class="text-white">Last 7 days</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$webParamsStore.freshness === Freshness.pm}
					onchange={() => webParamsStore.update((p) => ({ ...p, freshness: Freshness.pm }))}
					value={Freshness.pm}><span class="text-white">Last 31 days</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$webParamsStore.freshness === Freshness.py}
					onchange={() => webParamsStore.update((p) => ({ ...p, freshness: Freshness.py }))}
					value={Freshness.py}><span class="text-white">Last 365 days</span></Radio
				>
			{:else if searchType === 'news'}
				<Radio
					name="{searchType}-freshness"
					checked={$newsParamsStore.freshness === Freshness.pd}
					onchange={() => newsParamsStore.update((p) => ({ ...p, freshness: Freshness.pd }))}
					value={Freshness.pd}><span class="text-white">Last 24 hours</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$newsParamsStore.freshness === Freshness.pw}
					onchange={() => newsParamsStore.update((p) => ({ ...p, freshness: Freshness.pw }))}
					value={Freshness.pw}><span class="text-white">Last 7 days</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$newsParamsStore.freshness === Freshness.pm}
					onchange={() => newsParamsStore.update((p) => ({ ...p, freshness: Freshness.pm }))}
					value={Freshness.pm}><span class="text-white">Last 31 days</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$newsParamsStore.freshness === Freshness.py}
					onchange={() => newsParamsStore.update((p) => ({ ...p, freshness: Freshness.py }))}
					value={Freshness.py}><span class="text-white">Last 365 days</span></Radio
				>
			{:else}
				<Radio
					name="{searchType}-freshness"
					checked={$videosParamsStore.freshness === Freshness.pd}
					onchange={() => videosParamsStore.update((p) => ({ ...p, freshness: Freshness.pd }))}
					value={Freshness.pd}><span class="text-white">Last 24 hours</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$videosParamsStore.freshness === Freshness.pw}
					onchange={() => videosParamsStore.update((p) => ({ ...p, freshness: Freshness.pw }))}
					value={Freshness.pw}><span class="text-white">Last 7 days</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$videosParamsStore.freshness === Freshness.pm}
					onchange={() => videosParamsStore.update((p) => ({ ...p, freshness: Freshness.pm }))}
					value={Freshness.pm}><span class="text-white">Last 31 days</span></Radio
				>
				<Radio
					name="{searchType}-freshness"
					checked={$videosParamsStore.freshness === Freshness.py}
					onchange={() => videosParamsStore.update((p) => ({ ...p, freshness: Freshness.py }))}
					value={Freshness.py}><span class="text-white">Last 365 days</span></Radio
				>
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
		<Dropdown simple class="max-h-64 w-44 space-y-3 overflow-y-auto p-3 text-sm">
			{#each countries as country}
				<li>
					{#if searchType === 'web'}
						<Radio
							name="{searchType}-country"
							checked={$webParamsStore.country === country.key}
							onchange={() => webParamsStore.update((p) => ({ ...p, country: country.key }))}
							value={country.key}>{country.label}</Radio
						>
					{:else if searchType === 'news'}
						<Radio
							name="{searchType}-country"
							checked={$newsParamsStore.country === country.key}
							onchange={() => newsParamsStore.update((p) => ({ ...p, country: country.key }))}
							value={country.key}>{country.label}</Radio
						>
					{:else if searchType === 'videos'}
						<Radio
							name="{searchType}-country"
							checked={$videosParamsStore.country === country.key}
							onchange={() => videosParamsStore.update((p) => ({ ...p, country: country.key }))}
							value={country.key}>{country.label}</Radio
						>
					{:else}
						<Radio
							name="{searchType}-country"
							checked={$imagesParamsStore.country === country.key}
							onchange={() => imagesParamsStore.update((p) => ({ ...p, country: country.key }))}
							value={country.key}>{country.label}</Radio
						>
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
			<Dropdown simple class="max-h-64 w-44 space-y-3 overflow-y-auto p-3 text-sm">
				{#each languages as language}
					<li>
						{#if searchType === 'web'}
							<Radio
								name="{searchType}-language"
								checked={$webParamsStore.language === language.key}
								onchange={() => webParamsStore.update((p) => ({ ...p, language: language.key }))}
								value={language.key}>{language.label}</Radio
							>
						{:else if searchType === 'news'}
							<Radio
								name="{searchType}-language"
								checked={$newsParamsStore.language === language.key}
								onchange={() => newsParamsStore.update((p) => ({ ...p, language: language.key }))}
								value={language.key}>{language.label}</Radio
							>
						{:else if searchType === 'videos'}
							<Radio
								name="{searchType}-language"
								checked={$videosParamsStore.language === language.key}
								onchange={() => videosParamsStore.update((p) => ({ ...p, language: language.key }))}
								value={language.key}>{language.label}</Radio
							>
						{:else}
							<Radio
								name="{searchType}-language"
								checked={$imagesParamsStore.language === language.key}
								onchange={() => imagesParamsStore.update((p) => ({ ...p, language: language.key }))}
								value={language.key}>{language.label}</Radio
							>
						{/if}
					</li>
				{/each}
			</Dropdown>
		</div>
	</div>

	<!-- More Button - 300px below Language label (approximately 18.75rem) -->
	{#if searchType == 'web' || 'news' || 'videos' || 'images'}
		<div class="mt-[18.75rem] flex justify-center">
			<button
				class="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
				onclick={() => (showOperators = !showOperators)}
			>
				More
			</button>
		</div>
	{/if}

	<!-- Search Operators Popup -->
	{#if showOperators}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			onclick={() => (showOperators = false)}
		>
			<div
				class="max-h-[80vh] w-[900px] overflow-y-auto rounded-lg bg-white p-6"
				onclick={(e) => e.stopPropagation()}
			>
				<h2 class="mb-4 text-xl font-bold text-black">Search Operators</h2>
				<div class="space-y-1 text-base text-black">
					<div class="grid grid-cols-3 gap-4 border-b-2 border-gray-300 pb-2 font-bold">
						<span>Operator</span>
						<span>Purpose</span>
						<span>Example</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">ext:</span>
						<span>File extension</span>
						<span class="font-mono">manual ext:pdf</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">filetype:</span>
						<span>File type</span>
						<span class="font-mono">report filetype:pdf</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">intitle:</span>
						<span>Search in title</span>
						<span class="font-mono">intitle:guide</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">inbody:</span>
						<span>Search in body</span>
						<span class="font-mono">inbody:"phrase"</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">inpage:</span>
						<span>Title or body</span>
						<span class="font-mono">inpage:"keyword"</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">lang:</span>
						<span>Language filter</span>
						<span class="font-mono">lang:es</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">loc:</span>
						<span>Location filter</span>
						<span class="font-mono">loc:ca</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">site:</span>
						<span>Domain filter</span>
						<span class="font-mono">site:example.com</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">+</span>
						<span>Force inclusion</span>
						<span class="font-mono">+required</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">-</span>
						<span>Exclude term</span>
						<span class="font-mono">-unwanted</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">""</span>
						<span>Exact phrase</span>
						<span class="font-mono">johnny utah "narly wave man"</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">AND</span>
						<span>Logical AND</span>
						<span class="font-mono">visa loc:gb AND lang:en</span>
					</div>
					<div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-1">
						<span class="font-mono">OR</span>
						<span>Logical OR</span>
						<span class="font-mono"
							>travel requirements inpage:australia OR inpage:"new zealand"</span
						>
					</div>
					<div class="grid grid-cols-3 gap-4 py-1">
						<span class="font-mono">NOT</span>
						<span>Logical NOT</span>
						<span class="font-mono">brave search NOT site:brave.com</span>
					</div>
				</div>
				<button
					class="mt-4 cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-800"
					onclick={() => (showOperators = false)}
				>
					Close
				</button>
			</div>
		</div>
	{/if}
</div>
