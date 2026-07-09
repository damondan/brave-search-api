<!-- src/lib/components/NewsResults.svelte -->
<script lang="ts">
	import type { NewsResult } from '$lib/types/newsResultsInterface';
	import { open } from '@tauri-apps/plugin-shell';
	import { newsResults } from '$lib/stores/searchResultsStore';
	import { newsSelectionState } from '$lib/stores/state.svelte';

	let {
		results,
		onToggleSelection
	}: {
		results: NewsResult[];
		onToggleSelection: (news: NewsResult) => void;
	} = $props();

	function openLink(url: string) {
		open(url);
	}
</script>

{#if results.length === 0}
	<div class="p-4 text-gray-400">No news results</div>
{:else}
	{#each results as news, index}
		<div class="mb-6">
			<div class="flex items-start gap-2">
				<input
					type="checkbox"
					class="mt-2 text-4xl h-6 w-6 ascent-black text-black"
					checked={newsSelectionState.selectedNewsResults.some((r) => r.url == news.url)}
					onchange={() => onToggleSelection(news)}
				/>
				<button
					class="cursor-pointer text-4xl text-red-500 hover:text-red-700"
					onclick={() => newsResults.update((results) => results.filter((_, i) => i != index))}
				>
					✕
				</button>
				{#if news.thumbnail?.src}
					<img src={news.thumbnail.src} alt="" class="h-34 w-34 rounded object-cover" />
				{/if}
				<div class="flex-1">
					<div class="text-3xl font-semibold text-black">{@html news.title}</div>
					{#if news.profile?.name}
						<div class="text-2xl text-gray-500">{news.profile.name}</div>
					{/if}
					{#if news.page_age}
						<div class="text-2xl text-gray-400">{news.page_age}</div>
					{/if}
					<div class="mt-1 text-2xl text-black">{@html news.description}</div>
					<a
						href={news.url}
						class="cursor-pointer text-sm text-blue-500 underline"
						onclick={(e) => {
							e.preventDefault();
							openLink(news.url);
						}}
					>
						{news.url}
					</a>
				</div>
			</div>
		</div>
	{/each}
{/if}
