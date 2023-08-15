<script>
import { writable, derived } from "svelte/store";
import { linkFilesData } from './link.js';
import LinkTable from './LinkTable.svelte';

let display_table = false;
let urlParams = new URLSearchParams(window.location.search);
let selected = urlParams.get('link_id');
if (selected) {
    handleSelected();
}

function handleSelected()  {
    fetch('http://localhost:5000/link/?link=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => linkFilesData.set(data))
    display_table = true;
}
</script>

<main>
	<h2>Input a link:</h2>
    <input id="link-input" class='link-select' bind:value={selected} />
    {#if selected}
    <a href="/link?link_id={selected}"><button>Submit</button></a>
    {:else}
    <button disabled={!selected}>Submit</button>
    {/if}
    {#if display_table}
    <div class="card">
        <LinkTable selected={selected}/>
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
        cursor: pointer;
        transition: border-color 0.25s;
    }
</style>
