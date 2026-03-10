<!-- src/lib/components/NewsResults.svelte -->
<script lang="ts">
	import type { NewsResult } from '$lib/types/braveInterfaces';
	import { open } from '@tauri-apps/plugin-shell';

	let { results = [] }: { results: NewsResult[] } = $props();

	function openLink(url: string) {
		open(url);
	}
</script>

{#if results.length === 0}
	<div class="text-gray-400 p-4">No news results</div>
{:else}
	{#each results as news}
		<div class="mb-6 flex gap-4">
			{#if news.thumbnail?.src}
				<img src={news.thumbnail.src} alt="" class="w-34 h-34 object-cover rounded" />
			{/if}
			<div class="flex-1">
				<div class="font-semibold text-3xl">{@html news.title}</div>
				{#if news.profile?.name}
					<div class="text-2xl text-gray-500">{news.profile.name}</div>
				{/if}
				{#if news.page_age}
					<div class="text-2xl text-gray-400">{news.page_age}</div>
				{/if}
				<div class="mt-1 text-2xl">{@html news.description}</div>
				<a
					href={news.url}
					class="cursor-pointer text-blue-500 underline text-sm"
					onclick={(e) => {
						e.preventDefault();
						openLink(news.url);
					}}
				>
					{news.url}
				</a>
			</div>
		</div>
	{/each}
{/if}
