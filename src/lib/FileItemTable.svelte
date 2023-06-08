<script>
import imdbLogo from '../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { annotatedFile, FileItem } from './model.js';

export let img_src;

let fileItems = derived(annotatedFile, annotatedFile => annotatedFile.items?.map(item => {
    let boxes = item.boxes.map(box => {
        let links = box.links.map(link => {
            return new FileItem(item.id, box.left, box.top, box.width, box.height, link.link, link.title, link.year, link.rating, link.votes, link.confirmed)
        })
        return links.length > 0 ? links : [new FileItem(item.id, null, null, null, null, '', '', '', null, null, false)]
    })
    return boxes.length > 0 ? boxes : [new FileItem(item.id, null, null, null, null, '', '', '', null, null, flase)]
}).flat(2))

let asc = true;
let active = 'id';
let sortFnc = item => item.id;
let sortedFileItems = derived(
    fileItems,
    fileItems => fileItems?.sort((itemA, itemB) => {
            if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
            if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
        return 0;
    })
);
function sortColumnFunction(fnc, activeTH) {
    return () => {
        asc = !asc || active !== activeTH;
        sortFnc = fnc;
        active = activeTH;
        sortedFileItems = derived(
            fileItems,
            fileItems => fileItems
                .sort((itemA, itemB) => {
                    if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
                    if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
                return 0;
            })
        );
    }
}
</script>

<table class="file-item-table">
    <thead>
        <tr>
            <th class="isSortable {active === 'id' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.id, 'id')}>ID</th>
            <th class="isSortable {active === 'confirmed' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.confirmed, 'confirmed')}>Confirmed</th>
            <th>Snippet</th>
            <th class="isSortable {active === 'title' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.title, 'title')}>Title</th>
            <th class="isSortable {active === 'year' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.year, 'year')}>Year</th>
            <th class="isSortable {active === 'rating' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.rating, 'rating')}>Rating</th>
            <th class="isSortable {active === 'votes' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.votes, 'votes')}>Votes</th>
            <th class="isSortable {active === 'link' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.link, 'link')}>Link</th>
        </tr>
    </thead>
    <tbody>
    {#if $sortedFileItems}
        {#each $sortedFileItems as fileItem}
        <tr>
            <td>{fileItem.id}</td>
            <td><input type="checkbox" id="confirmed-{fileItem.id}" bind:checked={fileItem.confirmed}></td>
            <td style="max-width: 400px;">
                {#if fileItem.height}
                <img src={img_src} style="
                    width: {fileItem.width}px;
                    height: {fileItem.height}px;
                    object-fit: none;
                    object-position: -{fileItem.top}px -{fileItem.left}px;
                    scale: {fileItem.scale(400)};
                    translate: -{fileItem.translation(400)}px 0px;
                " alt="Snippet for {fileItem.title} ({fileItem.year})"/>
                {/if}
            </td>
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
