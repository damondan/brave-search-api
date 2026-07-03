<!-- src/lib/components/VideoResults.svelte -->
<script lang="ts">
	import { imageResults } from '$lib/stores/searchResultsStore';
	import type { ImagesResult } from '$lib/types/imagesResultsInterface';
	import { open } from '@tauri-apps/plugin-shell';

	let {
		results,
		selectedImageResults,
		onToggleSelection
	}: {
		results: ImagesResult[];
		selectedImageResults: ImagesResult[];
		onToggleSelection: (images: ImagesResult) => void;
	} = $props();

	function openLink(url: string) {
		open(url);
	}
</script>

{#if results.length === 0}
	<div class="p-4 text-gray-400">No image results</div>
{:else}
	{#each results as image, index}
		<div class="mb-6">
			<div class="flex items-start gap-2">
			<input
					type="checkbox"
					class="mt-2 text-4xl h-6 w-6 ascent-black text-black"
					checked={selectedImageResults.some((r) => r.url == image.url)}
					onchange={() => onToggleSelection(image)}
				/>
				<button
					class="cursor-pointer text-4xl text-red-500 hover:text-red-700"
					onclick={() => imageResults.update((results) => results.filter((_, i) => i != index))}
				>
					✕
				</button>
				{#if image.thumbnail?.src}
					<div class="relative">
						<img 
                            src={image.thumbnail.src} 
                            alt="" class="h-200 w-400 rounded object-cover" />
					</div>
				{/if}
				<div class="flex-1">
					<div class="font-semibold text-black">{@html image.title}</div>
					{#if image?.source}
						<div class="text-xl text-gray-500">{image.source}</div>
					{/if}
					<!-- {#if image.properties?.format}
						<div class="text-md text-red-400">{image.properties.format} format</div>
					{/if} -->
                    {#if image.properties?.width}
						<div class="font-semibold text-md text-red-400">{image.properties.width} width</div>
					{/if}
                    {#if image.properties?.height}
						<div class="font-semibold text-md text-red-400">{image.properties.height} height</div>
					{/if}
					<a
						href={image.properties?.url}
						class="cursor-pointer text-sm text-blue-500 underline"
						onclick={(e) => {
							e.preventDefault();
                            const imgUrl = image.properties?.url;
                            if(imgUrl){
							    openLink(imgUrl);
                            }
                        }}
					>
						Watch image
					</a>
				</div>
			</div>
		</div>
	{/each}
{/if}
