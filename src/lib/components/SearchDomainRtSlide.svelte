<script lang="ts">
	import { rightNews, leftNews, basedNews, foreignNews } from '$lib/utils/domains';
	import { Dropdown, Button, Radio, Checkbox, search } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	const leftNewsArray = Object.entries(leftNews);
	const rightNewsArray = Object.entries(rightNews);
	const basedNewsArray = Object.entries(basedNews);
	const foreignNewsArray = Object.entries(foreignNews);
	const cultureNewsArray = Object.entries(leftNews);
	const techNewsArray = Object.entries(rightNews);
	const musicNewsArray = Object.entries(leftNews);
	const landNewsArray = Object.entries(rightNews);
	const offGridNewsArray = Object.entries(leftNews);
	const farmNewsArray = Object.entries(rightNews);
	const medicineNewsArray = Object.entries(leftNews);
	const pycheNewsArray = Object.entries(rightNews);

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

<div class="flex flex-col items-center">
	<label class="text-xl text-black underline"
		>Left News<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span></label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
		<div class="flex flex-col">
			{#each leftNewsArray as [name, url]}
				<button
					type="button"
					class="cursor-pointer text-xl text-blue-700 underline hover:text-blue-900"
					on:click={() => copyToClipboard(url)}
				>
					{name}
				</button>
			{/each}
		</div>
	</Dropdown>
	<label class="text-xl text-black underline">Right News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
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
	</Dropdown>

	<label class="text-xl text-black underline">Based News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	{#each basedNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each}
	</div>
	</Dropdown>
	<label class="text-xl text-black underline">Foreign News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	{#each foreignNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each}
	</div>
	</Dropdown>

	<label class="text-xl text-black underline">Culture News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each cultureNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>
	<label class="text-xl text-black underline">Tech News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each techNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>

	<label class="text-xl text-black underline">Music News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each musicNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>

	<label class="text-xl text-black underline">Land News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each landNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>

	<label class="text-xl text-black underline">Off Grid News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each offGridNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>

	<label class="text-xl text-black underline">Farm News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each farmNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>

	<label class="text-xl text-black underline">Medicine News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each medicineNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>

	<label class="text-xl text-black underline">Psychology News
		<span>
			<Button class="cursor-pointer">
				<ChevronDownOutline class="ms-2 h-6 w-6 text-red-500" />
			</Button>
		</span>
	</label>
	<Dropdown simple class="max-h-94 w-44 space-y-3 overflow-y-auto p-3 text-sm">
	<div class="flex flex-col">
	<!-- {#each psychNewsArray as [name, url]}
		<button
			type="button"
			class="cursor-pointer text-blue-700 underline hover:text-blue-900"
			on:click={() => copyToClipboard(url)}
		>
			{name}
		</button>
	{/each} -->
	</div>
	</Dropdown>
</div>
