<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { yearsData } from './year.js';

export let selected;

let years = derived(yearsData, yearsData => yearsData.years??[]);

async function closeOut() {
    await fetch('http://localhost:5000/year/?year=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => yearsData.set(data))
}

</script>

<table class="years-table">
    <thead>
        <tr>
            <th>Link</th>
            <th>Title</th>
            <th>Year</th>
            <th>Rating</th>
            <th>Votes</th>
            <th>Count</th>
        </tr>
    </thead>
    <tbody>
    {#if $years}
        {#each $years as year, index}
            <tr>
               <td><a href={year?.link} target="_blank"><img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" /></a></td>
               <td><a href='/link?link_id={year?.link}'>{year?.title}</a></td>
               <td>{year?.year}</td>
               <td>{year?.rating}</td>
               <td>{year?.votes}</td>
               <td>{year?.count}</td>
           </tr>
        {/each}
    {/if}
    </tbody>
</table>

<style>
table {
    width: 100%;
}
</style>
