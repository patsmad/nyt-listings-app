<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { annotatedFileData, annotatedFile, FileItem } from './file.js';

export let img_src;
export let selected;

let fileItems = derived(annotatedFile, annotatedFile => annotatedFile.items?.map(item => {
    let boxes = item.boxes.map(box => {
        let links = box.links.map(link => {
            return new FileItem(item.id, box.id, box.left, box.top, box.width, box.height, link.id, link.link, link.title, link.year, link.rating, link.votes, link.confirmed)
        })
        return links.length > 0 ? links : [new FileItem(item.id, box.id, box.left, box.top, box.width, box.height, null, '', '', '', null, null, false)]
    })
    return boxes.length > 0 ? boxes : [new FileItem(item.id, null, null, null, null, null, null, '', '', '', null, null, false)]
}).flat(2))

let asc = true;
let active = 'id';
let sortFnc = item => item.id;
let sortFileItems = () => derived(
    fileItems,
    fileItems => fileItems?.sort((itemA, itemB) => {
            if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
            if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
        return 0;
    })
);
let sortedFileItems = sortFileItems();

function sortColumnFunction(fnc, activeTH) {
    return () => {
        asc = !asc || active !== activeTH;
        sortFnc = fnc;
        active = activeTH;
        sortedFileItems = sortFileItems();
    }
}

async function updateConfirmed(link_id, confirmed) {
    await fetch('http://localhost:5000/link/update?api_key=' + import.meta.env.VITE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
            'id': link_id,
            'confirmed': !confirmed
        })
    })
    await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    sortedFileItems = sortFileItems();
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
        await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
        sortedFileItems = sortFileItems();
    }
    editable = -1;
    new_value = '';
    old_value = '';
}
async function addLink(box_id) {
    if (new_value != '') {
        await fetch('http://localhost:5000/link/add?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'box_id': box_id,
                'link': new_value,
                'confirmed': true
            })
        })
        await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
        sortedFileItems = sortFileItems();
    }
    editable = -1;
    new_value = '';
    old_value = '';
}
function itemDeletable(index) {
    return () => deletable = index;
}
async function deleteItem(item_id) {
    await fetch('http://localhost:5000/item/delete?api_key=' + import.meta.env.VITE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
            'id': item_id
        })
    })
    await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    sortedFileItems = sortFileItems();
    deletable = -1;
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
        {#each $sortedFileItems as fileItem, index}
        <tr>
            <td on:dblclick={itemDeletable(index)}>
                {#if deletable != index}
                {fileItem.id}
                {:else}
                <button class="x" on:click={deleteItem(fileItem.id)}>X</button>
                {/if}
            </td>
            <td><input type="checkbox" id="confirmed-{fileItem.id}" bind:checked={fileItem.confirmed} on:click={updateConfirmed(fileItem.link_id, fileItem.confirmed)}></td>
            <td style="max-width: 400px; height: {fileItem.scale(400) * fileItem.height}px">
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
            <td><a href='/link?link_id={fileItem.link}'>{fileItem.title}</a></td>
            <td>{fileItem.year}</td>
            <td>{fileItem.rating}</td>
            <td>{fileItem.votes}</td>
            <td on:dblclick={linkEditable(fileItem.link, index)}>
            {#if index != editable}
                {#if fileItem.link}
                <a href={fileItem.link} target="_blank">
                    <img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" />
                </a>
                {/if}
            {:else}
            {#if fileItem.link_id}
            <form on:submit|preventDefault={(e) => updateLink(fileItem.link_id)}>
                <input bind:value={new_value} />
            </form>
            {:else}
            <form on:submit|preventDefault={(e) => addLink(fileItem.box_id)}>
                <input bind:value={new_value} />
            </form>
            {/if}
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
.x {
	border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #ff5248;
    cursor: pointer;
    transition: border-color 0.25s;
}
</style>
