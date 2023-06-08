<script>
import { onMount } from "svelte";
import { writable, derived } from "svelte/store";
import { annotatedFileData } from './model.js';
import FileItemTable from './FileItemTable.svelte';

let selected;
let img_src;
let files = writable([]);
let display_table = false;

onMount(async () => {
    annotatedFileData.set([]);
    fetch('http://localhost:5000/files/?api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => files.set(data))
});

function handleFileSubmit() {
    fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    img_src = 'http://localhost:5000/img/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY
    display_table = true;
}
</script>

<main>
	<h2>Select a file:</h2>
	<form on:submit|preventDefault={handleFileSubmit}>
    <select class='file-select' bind:value={selected}>
    {#each $files as file}
        <option value={file.id}>
            {file.name}
        </option>
    {/each}
    </select>
    <button submit='file-select-button' disabled={!selected} type=submit>
        Submit
    </button>
    </form>
    {#if display_table}
    <div class="card">
        <FileItemTable img_src={img_src} />
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
