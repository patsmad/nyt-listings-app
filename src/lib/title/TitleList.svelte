<script>
import { writable, derived } from "svelte/store";
import { titlesData } from './title.js';
import TitleTable from './TitleTable.svelte';

let display_table = false;
let urlParams = new URLSearchParams(window.location.search);
let selected = urlParams.get('title');
if (selected) {
    handleSelected();
}

function handleSelected()  {
    fetch('http://localhost:5000/title/?title=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => titlesData.set(data))
    display_table = true;
}
</script>

<main>
	<h2>Search by title:</h2>
    <input id="title-input" class='title-select' bind:value={selected} />
    {#if selected}
    <a href="/title?title={selected}"><button>Submit</button></a>
    {:else}
    <button disabled={!selected}>Submit</button>
    {/if}
    {#if display_table}
    <div class="card">
        <TitleTable selected={selected}/>
    </div>
    {/if}
</main>

<style>
    .title-select {
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