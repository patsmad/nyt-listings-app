<script>
import { onMount } from "svelte";
import { writable } from "svelte/store";
import FileItemTable from './FileItemTable.svelte'

let selected;
let files = writable([]);
export let file_items = writable([]);
let display_table = false;

onMount(async () => {
  fetch('http://localhost:5000/files/?api_key=' + import.meta.env.VITE_API_KEY)
  .then(response => response.json())
  .then(data => files.set(data))
});

function handleFileSubmit() {
    fetch('http://localhost:5000/file/?file_id=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
      .then(response => response.json())
      .then(data => file_items.set(data.items))
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
        <FileItemTable file_items={file_items} />
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
