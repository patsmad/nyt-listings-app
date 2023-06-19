<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { linkFiles, linkFilesData } from './link.js';

export let selected;

let linkFilesList = derived(linkFiles, linkFiles => linkFiles.link_files??[]);

let asc = true;
let active = 'id';
let sortFnc = item => item.id;

let sortLinkList = () => derived(
    linkFilesList,
    linkFilesList => linkFilesList?.sort((itemA, itemB) => {
            if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
            if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
        return 0;
    })
);

let sortedLinkList = sortLinkList();

function sortColumnFunction(fnc, activeTH) {
    return () => {
        asc = !asc || active !== activeTH;
        sortFnc = fnc;
        active = activeTH;
        sortedLinkList = sortLinkList();
    }
}

function getImgSrc(linkFile) {
    return 'http://localhost:5000/img/?file_id=' + linkFile.file_id + '&api_key=' + import.meta.env.VITE_API_KEY +
        '&box=' + linkFile.left + ',' + linkFile.top + ',' + linkFile.width + ',' + linkFile.height
}

let deletable=-1
let editable=-1;
let new_value='';
let old_value='';
function linkEditable(value, index) {
    return () => {
        editable = index;
        new_value = value;
        old_value = value;
    }
}
async function updateLink(link_id) {
    if (new_value != old_value) {
        await fetch('http://localhost:5000/link/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': link_id,
                'link': new_value,
                'confirmed': true
            })
        })
        await fetch('http://localhost:5000/link/?link=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => linkFilesData.set(data))
        sortedLinkList = sortLinkList();
    }
    editable = -1;
    new_value = '';
    old_value = '';
}

async function updateConfirmed(link_id, confirmed) {
    await fetch('http://localhost:5000/link/update?api_key=' + import.meta.env.VITE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
            'id': link_id,
            'confirmed': !confirmed
        })
    })
    await fetch('http://localhost:5000/link/?link=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => linkFilesData.set(data))
    sortedLinkList = sortLinkList();
}
</script>

<div>Count: {$sortedLinkList?.length}</div>
<table class="link-file-info">
    <tr>
        <td><a href={$linkFiles?.link_info?.link} target="_blank"><img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" /></a></td>
        <td>{$linkFiles?.link_info?.title}</td>
        <td>{$linkFiles?.link_info?.year}</td>
        <td>{$linkFiles?.link_info?.rating}</td>
        <td>{$linkFiles?.link_info?.votes}</td>
    </tr>
</table>

<table class="link-file-table">
    <thead>
        <tr>
            <th class="isSortable {active === 'id' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.id, 'id')}>ID</th>
            <th class="isSortable {active === 'file' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.file, 'file')}>File</th>
            <th>Snippet</th>
            <th class="isSortable {active === 'confirmed' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.confirmed, 'confirmed')}>Confirmed</th>
            <th>Link</th>
        </tr>
    </thead>
    <tbody>
    {#if $sortedLinkList}
        {#each $sortedLinkList as linkFile, index}
        <tr>
            <td>{linkFile.link_id}</td>
            <td><a href="/file?file_id={linkFile.file_id}">{linkFile.file}</a></td>
            <td style="max-width: 400px; min-width: 400px; height: {linkFile.scale(400, linkFile.width) * linkFile.height}px">
                {#if linkFile.height}
                <img src={getImgSrc(linkFile)} style="
                    width: {linkFile.width}px;
                    height: {linkFile.height}px;
                    scale: {linkFile.scale(400, linkFile.width)};
                    translate: -{linkFile.translation(400, linkFile.width)}px 0px;
                " alt="Snippet for {linkFile.title} ({linkFile.file})"/>
                {/if}
            </td>
            <td><input type="checkbox" bind:checked={linkFile.confirmed} on:click={updateConfirmed(linkFile.link_id, linkFile.confirmed)}></td>
            <td on:dblclick={linkEditable(linkFile.link, index)}>
            {#if index != editable}
            <a href={linkFile.link} target="_blank">
                <img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" />
            </a>
            {:else}
            <form on:submit|preventDefault={(e) => updateLink(linkFile.link_id)}>
                <input bind:value={new_value} />
            </form>
            {/if}
            </td>
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
