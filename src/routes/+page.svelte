<script lang="ts">
	import SearchComponent from '$lib/components/SearchComponent.svelte';

	let selectedSubject = $state('web');
	let leftOpen = $state(false);
	let rightOpen = $state(false);
</script>

<div class="flex flex-col">
	<SearchComponent {selectedSubject} />

	<div class="flex flex-1">
		<!-- Left Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {leftOpen ? 'w-[10%]' : 'w-0'}"></div>

		<!-- Main Content -->
		<div class="flex-1 overflow-y-auto"></div>

		<!-- Right Sidebar -->
		<div class="overflow-hidden transition-all duration-300 {rightOpen ? 'w-[10%]' : 'w-0'}"></div>
	</div>
</div>
