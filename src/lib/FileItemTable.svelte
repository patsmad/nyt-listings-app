<script>
import imdbLogo from '../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { annotatedFile, FileItem } from './model.js';

let fileItems = derived(annotatedFile, annotatedFile => annotatedFile.items?.map(item => {
    let boxes = item.boxes.map(box => {
        let links = box.links.map(link => {
            return new FileItem(item.id, link.link, link.title, link.year, link.rating, link.votes)
        })
        return links.length > 0 ? links : [new FileItem(item.id, '', '', '', 0.0, 0)]
    })
    return boxes.length > 0 ? boxes : [new FileItem(item.id, '', '', '', 0.0, 0)]
}).flat(2))

let asc = true;
let active = 'id';
function sortColumnFunction(fnc, activeTH) {
    return () => {
        asc = !asc || active !== activeTH;
        fileItems = derived(
            fileItems,
            fileItems => fileItems
                .sort((itemA, itemB) => {
                    if (fnc(itemA) > fnc(itemB)) { return -1 + 2 * asc; }
                    if (fnc(itemA) < fnc(itemB)) { return 1 - 2 * asc; }
                    return 0;
                })
        );
        active = activeTH;
    }
}
</script>

<table class="file-item-table">
    <thead>
        <tr>
            <th class="isSortable {active === 'id' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.id, 'id')}>ID</th>
            <th class="isSortable {active === 'title' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.title, 'title')}>Title</th>
            <th class="isSortable {active === 'year' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.year, 'year')}>Year</th>
            <th class="isSortable {active === 'rating' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.rating, 'rating')}>Rating</th>
            <th class="isSortable {active === 'votes' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.votes, 'votes')}>Votes</th>
            <th class="isSortable {active === 'link' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.link, 'link')}>Link</th>
        </tr>
    </thead>
    <tbody>
    {#if $fileItems}
        {#each $fileItems as fileItem}
        <tr>
            <td>{fileItem.id}</td>
            <td>{fileItem.title}</td>
            <td>{fileItem.year}</td>
            <td>{fileItem.rating}</td>
            <td>{fileItem.votes}</td>
            {#if fileItem.link}
            <td><a href={fileItem.link} target="_blank"><img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" /></a></td>
            {:else}
            <td></td>
            {/if}
        </tr>
        {/each}
    {/if}
    </tbody>
</table>

<style>
table {
    width: 100%;
}

th, td {
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
}

th {
    background-color: #117bb7aa;
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
.imdb-logo {
    height: 32px;
}
</style>
