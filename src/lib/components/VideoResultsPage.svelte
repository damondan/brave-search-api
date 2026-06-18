<!-- src/lib/components/VideoResults.svelte -->
<script lang="ts">
	import { videoResults } from '$lib/stores/searchResultsStore';
	import type { VideosResult } from '$lib/types/videoResultsInterface';
	import { open } from '@tauri-apps/plugin-shell';

	let {
		results,
		selectedVideosResults,
		onToggleSelection
	}: {
		results: VideosResult[];
		selectedVideosResults: VideosResult[];
		onToggleSelection: (videos: VideosResult) => void;
	} = $props();

	function openLink(url: string) {
		open(url);
	}
</script>

{#if results.length === 0}
	<div class="p-4 text-gray-400">No video results</div>
{:else}
	{#each results as video, index}
		<div class="mb-6">
			<div class="flex items-start gap-2">
			<input
					type="checkbox"
					class="mt-2"
					checked={selectedVideosResults.some((r) => r.url == video.url)}
					onchange={() => onToggleSelection(video)}
				/>
				{#if video.thumbnail?.src}
					<div class="relative">
						<img src={video.thumbnail.src} alt="" class="h-48 w-80 rounded object-cover" />
						{#if video.video?.duration}
							<span class="absolute right-1 bottom-1 rounded bg-black/80 px-1 text-lg text-white">
								{video.video.duration}
							</span>
						{/if}
					</div>
				{/if}
				<div class="flex-1">
					<div class="font-semibold text-black">{@html video.title}</div>
					{#if video.video?.creator}
						<div class="text-xl text-gray-500">{video.video.creator}</div>
					{/if}
					{#if video.video?.views}
						<div class="text-xs text-gray-400">{video.video.views.toLocaleString()} views</div>
					{/if}
					{#if video.age}
						<div class="text-lg text-gray-400">{video.age}</div>
					{/if}
					<div class="mt-1 text-lg text-black">{@html video.description}</div>
					<a
						href={video.url}
						class="cursor-pointer text-sm text-blue-500 underline"
						onclick={(e) => {
							e.preventDefault();
							openLink(video.url);
						}}
					>
						Watch Video
					</a>
				</div>
				<button
					class="cursor-pointer text-2xl text-red-500 hover:text-red-700"
					onclick={() => videoResults.update((results) => results.filter((_, i) => i != index))}
				>
					✕
				</button>
			</div>
		</div>
	{/each}
{/if}
