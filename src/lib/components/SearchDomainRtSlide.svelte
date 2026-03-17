<script lang="ts">
	import { rightNews, leftNews } from '$lib/utils/domains';

	const leftNewsArray = Object.entries(leftNews);
	const rightNewsArray = Object.entries(rightNews);

	function copyToClipboard(text: string) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				// Optional: show feedback
				alert(`Copied: ${text}`);
			})
			.catch((err) => console.error('Failed to copy!', err));
	}
</script>

<div class="flex flex-col items-center gap-1">
	<label class="text-xl text-black underline">Left News</label>
	{#each leftNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each}
    <label class="text-xl text-black underline">Right News</label>
	{#each rightNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each}
    
</div>
