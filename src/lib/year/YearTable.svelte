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

let asc = false;
let active = 'total_size';
let sortFnc = item => item.total_size;
let sortYears = () => derived(
    years,
    years => years?.filter(item => sortFnc(item) !== null).sort((itemA, itemB) => {
            if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
            if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
        return 0;
    }).concat(years?.filter(item => sortFnc(item) === null))
);
let sortedYears = sortYears();

function sortColumnFunction(fnc, activeTH) {
    return () => {
        asc = !asc || active !== activeTH;
        sortFnc = fnc;
        active = activeTH;
        sortedYears = sortYears();
    }
}

</script>

<table class="years-table">
    <thead>
        <tr>
            <th>Link</th>
            <th class="isSortable {active === 'title' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.title, 'id')}>Title</th>
            <th>Year</th>
            <th class="isSortable {active === 'rating' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.rating, 'rating')}>Rating</th>
            <th class="isSortable {active === 'votes' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.votes, 'votes')}>Votes</th>
            <th class="isSortable {active === 'count' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.count, 'count')}>Count</th>
            <th class="isSortable {active === 'total_size' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.total_size, 'total_size')}>Total Size</th>
        </tr>
    </thead>
    <tbody>
    {#if $sortedYears}
        {#each $sortedYears as year, index}
            <tr>
               <td><a href={year?.link} target="_blank"><img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" /></a></td>
               <td><a href='/link?link_id={year?.link}'>{year?.title}</a></td>
               <td>{year?.year}</td>
               <td>{year?.rating}</td>
               <td>{year?.votes}</td>
               <td>{year?.count}</td>
               <td>{year?.total_size.toFixed(2)}</td>
           </tr>
        {/each}
    {/if}
    </tbody>
</table>

<style>
table {
    width: 100%;
}

.isSortable {
    cursor: pointer;
}

.isActive.asc:after {
    content: "▼";
    padding-left: 5px;
}

.isActive.desc:after {
    content: "▲";
    padding-left: 5px;
}
</style>
