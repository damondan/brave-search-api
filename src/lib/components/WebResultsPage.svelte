<!-- src/lib/components/WebResults.svelte -->
<script lang="ts">
	import type { WebResult } from '$lib/types/searchWebResultsInterface';
	import { open } from '@tauri-apps/plugin-shell';

	let { results = [] }: { results: WebResult[] } = $props();

	function openLink(url: string) {
		open(url);
	}
</script>

{#if results.length === 0}
	<div class="text-gray-400 p-4">No web results</div>
{:else}
	{#each results as web}
		<div class="mb-6">
		<h1 class="text-black text-2xl">Hello</h1>
			<div class="font-semibold">{@html web.title}</div>
			<div>{@html web.description}</div>
			{#if web.extra_snippets && web.extra_snippets.length > 0}
				<div class="mt-2 border-l-2 border-gray-300 pl-4">
					<div class="mb-1 text-sm text-gray-500">Additional snippets:</div>
					{#each web.extra_snippets as snippet, i}
						<div class="mb-1 text-sm text-red-700">{i + 1}. {snippet}</div>
					{/each}
				</div>
			{/if}
			<a
				href={web.url}
				class="cursor-pointer text-blue-500 underline"
				onclick={(e) => {
					e.preventDefault();
					openLink(web.url);
				}}
			>
				{web.url}
			</a>
		</div>
	{/each}
{/if}
