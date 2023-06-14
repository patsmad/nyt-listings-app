<script>
import { onMount } from "svelte";
import { writable, derived } from "svelte/store";
import { annotatedFileData } from './annotated.js';
import FileItemTable from './FileItemTable.svelte';
import AnnotatedFile from './AnnotatedFile.svelte';

let img_src;
let files = writable([]);
let display = false;
let display_table = true;

let urlParams = new URLSearchParams(window.location.search);
let selected = urlParams.get('file_id');
if (selected) {
    selected = parseInt(selected);
    handleSelected();
}

onMount(async () => {
    annotatedFileData.set([]);
    fetch('http://localhost:5000/files/?api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => files.set(data))
});

function handleSelected() {
    fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    img_src = 'http://localhost:5000/img/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY
    display = true;
}
</script>

<main>
	<h2>Select a file:</h2>
    <select class='file-select' bind:value={selected}>
        {#each $files as file}
        <option value={file.id}>{file.name}</option>
        {/each}
    </select>
    {#if selected}
    <a href="/file?file_id={selected}"><button>Submit</button></a>
    {:else}
    <button disabled>Submit</button>
    {/if}
    <div>
        <button on:click={() => display_table = !display_table}>
            {#if display_table}Annotation{:else}Table{/if}
        </button>
    </div>
    {#if display && display_table}
    <div class="card">
        <FileItemTable img_src={img_src} selected={selected} />
    </div>
    {/if}
    {#if display && !display_table}
    <div class="card">
        <AnnotatedFile img_src={img_src} selected={selected} />
    </div>
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
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
    }
</style>
