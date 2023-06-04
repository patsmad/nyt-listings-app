<script>
import { writable, derived } from "svelte/store";
import { linkFilesData } from './model.js';
import LinkTable from './LinkTable.svelte';

let selected;
let display_table = false;

function handleLinkSubmit() {
    fetch('http://localhost:5000/link/?link=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => linkFilesData.set(data))
    display_table = true;
}
</script>

<main>
	<h2>Input a link:</h2>
	<form on:submit|preventDefault={handleLinkSubmit}>
    <input class='link-select' bind:value={selected} />
    <button submit='link-select-button' disabled={!selected} type=submit>
        Submit
    </button>
    </form>
    {#if display_table}
    <div class="card">
        <LinkTable />
    </div>
    {/if}
</main>

<style>
    .link-select {
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
