<script lang="ts">
	import V2TSearchComponent from '$lib/components/V2TSearchComponent.svelte';
	import { v2aprevSearchesWritable, transcriptState } from '$lib/stores/state.svelte';
	import { invoke } from '@tauri-apps/api/core';

	let searchQuery = $state('');
	//let transcript = $state('');
	let transcriptionError = $state('');
	let loading = $state(false);
	let textarea: HTMLTextAreaElement;

	function resizeTextarea(): void {
		if (!textarea) return;

		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	$effect(() => {
		transcriptState.transcript;
		resizeTextarea();
	});

	async function handleSearchFromComponent(): Promise<void> {
		const videoUrl = searchQuery.trim();

		if (!videoUrl) {
			transcriptionError = 'Enter a YouTube video URL.';
			return;
		}

		if (!v2aprevSearchesWritable.includes(videoUrl)) {
			v2aprevSearchesWritable.push(videoUrl);
		}

		loading = true;
		transcriptState.transcript = "";
		transcriptionError = '';

		try {
			transcriptState.transcript = await invoke<string>('transcribe_video_url', {
				videoUrl
			});

			console.log('Transcript:', transcriptState.transcript);
		} catch (error) {
			console.error('Transcription failed:', error);
			transcriptionError = String(error);
		} finally {
			loading = false;
		}
	}

	function handleLoadingChange() {}
</script>

<div class="background min-h-screen w-full bg-black">
	<div class="mainContainer min-h-screen w-full border border-amber-50">
		<div class="searchBar mt-6">
			<V2TSearchComponent bind:searchQuery handleSearch={handleSearchFromComponent} bind:loading />
		</div>
		<div
			class="my-8 h-px w-full
					bg-gradient-to-r from-transparent via-white/60
					to-transparent"
		></div>
		<textarea
			bind:this={textarea}
			bind:value={transcriptState.transcript}
			oninput={resizeTextarea}
			wrap="soft"
			class="mx-auto block w-[90%] resize-none overflow-hidden rounded-lg
	       border border-gray-700 bg-zinc-900 p-4
	       text-white text-4xl outline-none focus:border-blue-500"
		></textarea>
		{#if transcriptionError}
    <div class="mx-auto mt-4 w-[90%] rounded border border-red-500 p-3 text-red-400">
        {transcriptionError}
    </div>
{/if}
	</div>
</div>
