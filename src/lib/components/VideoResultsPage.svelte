<!-- src/lib/components/VideoResults.svelte -->
<script lang="ts">
	import type { VideoResult } from '$lib/types/braveInterfaces';
	import { open } from '@tauri-apps/plugin-shell';

	let { results = [] }: { results: VideoResult[] } = $props();

	function openLink(url: string) {
		open(url);
	}
</script>

{#if results.length === 0}
	<div class="text-gray-400 p-4">No video results</div>
{:else}
	{#each results as video}
		<div class="mb-6 flex gap-4">
			{#if video.thumbnail?.src}
				<div class="relative">
					<img src={video.thumbnail.src} alt="" class="w-40 h-24 object-cover rounded" />
					{#if video.video?.duration}
						<span class="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
							{video.video.duration}
						</span>
					{/if}
				</div>
			{/if}
			<div class="flex-1">
				<div class="font-semibold">{@html video.title}</div>
				{#if video.video?.creator}
					<div class="text-sm text-gray-500">{video.video.creator}</div>
				{/if}
				{#if video.video?.views}
					<div class="text-xs text-gray-400">{video.video.views.toLocaleString()} views</div>
				{/if}
				{#if video.age}
					<div class="text-xs text-gray-400">{video.age}</div>
				{/if}
				<div class="mt-1 text-sm">{@html video.description}</div>
				<a
					href={video.url}
					class="cursor-pointer text-blue-500 underline text-sm"
					onclick={(e) => {
						e.preventDefault();
						openLink(video.url);
					}}
				>
					Watch Video
				</a>
			</div>
		</div>
	{/each}
{/if}
