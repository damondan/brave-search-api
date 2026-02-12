<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="h-screen overflow-y-auto bg-white border-2">       <!--height 100vh, vertical scrollbar-->
	<div class="mx-auto max-w-[95%] px-8 py-4">                                 <!--margin left/right automatic--> 
		<div class="mb-2 w-full rounded-xl bg-white/10 p-1 backdrop-blur-sm">
			<Navigation />
			{@render children?.()}
		</div>
	</div>
</div>
