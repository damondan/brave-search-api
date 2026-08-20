<!-- src/lib/components/Navigation.svelte -->
<script lang="ts">
	import { page } from "$app/state";

	const tabs = [
		{ path: "/", label: "Web" },
		{ path: "/news", label: "News" },
		{ path: "/videos", label: "Videos" },
		{ path: "/images", label: "Images" },
		{ path: "/v2a", label: "V2T" },
		{ path: "/workspace", label: "Workspace" },
	];
</script>
<!--border-white/20-->
<nav class="flex w-full justify-center gap-2 mb-2 border-b pb-2">
	{#each tabs as tab}
		<a
			href={tab.path}
			class="px-4 py-.5 rounded-t-md font-semibold transition-all
           {page.url.pathname === tab.path
				? 'bg-black/20 border-b-2 border-blue-500 text-black'
				: 'bg-black/10 hover:bg-black/10 text-black/70'}"
		>
			{tab.label}
		</a>
	{/each}
</nav>
