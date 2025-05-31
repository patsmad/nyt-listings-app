<script>
import { writable, derived } from "svelte/store";
import { yearsData } from './year.js';
import YearTable from './YearTable.svelte';

let display_table = false;
let urlParams = new URLSearchParams(window.location.search);
let selected = urlParams.get('year');
if (selected) {
    handleSelected();
}

function handleSelected()  {
    fetch('http://localhost:5000/year/?year=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => yearsData.set(data))
    display_table = true;
}
</script>

<main>
	<h2>Search by year:</h2>
    <input id="year-input" class='year-select' bind:value={selected} />
    {#if selected}
    <a href="/year?year={selected}"><button>Submit</button></a>
    {:else}
    <button disabled={!selected}>Submit</button>
    {/if}
    {#if display_table}
    <div class="card">
        <YearTable selected={selected}/>
    </div>
    {/if}
</main>

<style>
    .year-select {
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