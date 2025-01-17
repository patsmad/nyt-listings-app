<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { titlesData } from './title.js';

export let selected;

let titles = derived(titlesData, titlesData => titlesData.titles??[]);

async function closeOut() {
    await fetch('http://localhost:5000/title/?title=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => titlesData.set(data))
}

</script>

<table class="titles-table">
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
    {#if $titles}
        {#each $titles as title, index}
            <tr>
               <td><a href={title?.link} target="_blank"><img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" /></a></td>
               <td><a href='/link?link_id={title?.link}'>{title?.title}</a></td>
               <td>{title?.year}</td>
               <td>{title?.rating}</td>
               <td>{title?.votes}</td>
               <td>{title?.count}</td>
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
