<script>
import { onMount } from "svelte";
import { writable, derived } from "svelte/store";
import { annotatedFileData } from './annotated.js';
import FileItemTable from './FileItemTable.svelte';
import AnnotatedFile from './AnnotatedFile.svelte';

let img_src;
let files = writable([]);
let sortedFiles = derived(
    files,
    files => files?.filter(file => new Date(file.file_date).getDay() == 0).sort((fileA, fileB) => {
        if (fileA.name > fileB.name) { return 1; }
        if (fileA.name < fileB.name) { return -1; }
        return 0;
    })
);
let display = false;
let display_table = window.location.hash != '#annotation';

let urlParams = new URLSearchParams(window.location.search);
let selected = urlParams.get('file_id');
if (selected) {
    selected = parseInt(selected);
    handleSelected();
}

onMount(async () => {
    annotatedFileData.set([]);
    await fetch('http://localhost:5000/files/?api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => files.set(data))
});

let selectedFileIndex;
async function handleSelected() {
    await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    img_src = 'http://localhost:5000/img/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY
    display = true;
    selectedFileIndex = $sortedFiles.findIndex(file => file.id == selected);
}
</script>

<main>
	<h2>Select a file:</h2>
    <select id="file-select" class='file-select' bind:value={selected}>
        {#each $sortedFiles as file, index}
        <option id="file-{index}" value={file.id}>{file.name}</option>
        {/each}
    </select>
    {#if selected}
    <a href="/file?file_id={selected}{display_table ? '' : '#annotation'}"><button>Submit</button></a>
    {:else}
    <button disabled>Submit</button>
    {/if}
    {#if display}
    <div>
        {#if selectedFileIndex > 0}
        <a href="/file?file_id={$sortedFiles[selectedFileIndex - 1].id}{display_table ? '' : '#annotation'}"><button>&lt;</button></a>
        {:else}
        <button disabled>&lt;</button>
        {/if}
        <button on:click={() => display_table = !display_table}>
            {#if display_table}Annotation{:else}Table{/if}
        </button>
        {#if selectedFileIndex < $sortedFiles.length - 1}
        <a href="/file?file_id={$sortedFiles[selectedFileIndex + 1].id}{display_table ? '' : '#annotation'}"><button>&gt;</button></a>
        {:else}
        <button disabled>&gt;</button>
        {/if}
    </div>
    {#if display_table}
    <div class="card">
        <FileItemTable img_src={img_src} selected={selected} />
    </div>
    {:else}
    <div class="card">
        <AnnotatedFile img_src={img_src} selected={selected} />
    </div>
    {/if}
    {/if}
</main>

<style>
    .file-select {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: border-color 0.25s;
    }
</style>
