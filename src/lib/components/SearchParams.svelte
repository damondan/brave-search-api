<script lang="ts">
    import {
        type SearchParams,
        Country,
        SearchLanguage,
        FetchMetaData,
        XtraSnippets,
        Goggles,
        Freshness,
        SafeSearch
    } from "$lib/types/brave";
    let selectedFreshness = $state<Freshness | null>(null);
	let selectedSafesearch = $state<SafeSearch | null>(null);
	let selectedfetchmetadata = $state<FetchMetaData | null>(null);
	let selectedxtraSnippets = $state<XtraSnippets | null>(null);
	let selectedGoggles = $state<Goggles | null>(null);
</script>

<div class="mb-1">
	<label class="text-red-600 font-semibold block tracking-widest">Extra Snippets</label>
	<div class="flex flex-col">
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="extrasnippets" value={XtraSnippets.extrasnippets} bind:group={selectedxtraSnippets} />
			On
		</label>
	</div>
	<label class="text-red-600 font-semibold block tracking-widest">Fetch Meta Data</label>
	<div class="flex flex-col">
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="fetchmetadata" value={FetchMetaData.fetchmetadata} bind:group={selectedfetchmetadata} />
			On
		</label>
	</div>
	<label class="text-red-600 font-semibold block tracking-widest">Goggles</label>
	<div class="flex flex-col">
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="safesearch" value={Goggles.goggles} bind:group={selectedGoggles} />
			On
		</label>
	</div>
	<label class="text-red-600 font-semibold block tracking-widest">Safe Search</label>
	<div class="flex flex-col">
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="safesearch" value={SafeSearch.off} bind:group={selectedSafesearch} />
			Off
		</label>
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="safesearch" value={SafeSearch.moderate} bind:group={selectedSafesearch} />
			Moderate
		</label>
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="safesearch" value={SafeSearch.strict} bind:group={selectedSafesearch} />
			Strict
		</label>
	</div>
	<label class="text-red-600 font-semibold block tracking-widest">Freshness</label>
	<div class="flex flex-col">
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="freshness" value={Freshness.pd} bind:group={selectedFreshness} />
			Last 24 hours
		</label>
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="freshness" value={Freshness.pw} bind:group={selectedFreshness} />
			Last 7 days
		</label>
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="freshness" value={Freshness.pm} bind:group={selectedFreshness} />
			Last 31 days
		</label>
		<label class="text-white flex items-center gap-2 cursor-pointer">
			<input type="radio" name="freshness" value={Freshness.py} bind:group={selectedFreshness} />
			Last 365 days
		</label>
	</div>
</div>
