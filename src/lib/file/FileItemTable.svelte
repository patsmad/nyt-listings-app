<script>
import { derived } from 'svelte/store'
import { annotatedFileData } from './annotated.js'
import { fileItems, snippet_target } from './file.js';
import Channel from '../update/Channel.svelte';
import Time from '../update/Time.svelte';
import Duration from '../update/Duration.svelte';
import VCRCode from '../update/VCRCode.svelte';
import Link from '../update/Link.svelte';

export let img_src;
export let selected;

let asc = true;
let active = 'id';
let sortFnc = item => item.id;
let sortFileItems = () => derived(
    fileItems,
    fileItems => fileItems?.filter(item => sortFnc(item) !== null).sort((itemA, itemB) => {
            if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
            if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
        return 0;
    }).concat(fileItems?.filter(item => sortFnc(item) === null))
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

let editable_box=-1;
let new_box = [];
let old_box = [];
function boxEditable(fileItem, index) {
    return () => {
        editable_box = index;
        new_box = fileItem.box();
        old_box = fileItem.box();
    }
}
async function updateBox(box_id) {
    if (!new_box.match(old_box)) {
        await fetch('http://localhost:5000/box/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': box_id,
                'left': new_box.left,
                'top': new_box.top,
                'width': new_box.width(),
                'height': new_box.height()
            })
        })
        await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
        sortedFileItems = sortFileItems();
    }
    editable_box = -1;
    new_box = [];
    old_box = [];
}

async function closeOut() {
    await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    sortedFileItems = sortFileItems();
}

</script>

<div>Count: {$sortedFileItems?.length}</div>
<table class="file-item-table">
    <thead>
        <tr>
            <th class="isSortable {active === 'id' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.id, 'id')}>ID</th>
            <th class="isSortable {active === 'confirmed' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.confirmed, 'confirmed')}>Confirmed</th>
            <th>Snippet</th>
            <th class="isSortable {active === 'channel' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.channel, 'channel')}>Channel</th>
            <th class="isSortable {active === 'time' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.time, 'time')}>Time</th>
            <th class="isSortable {active === 'duration' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.duration_minutes, 'duration')}>Duration (min.)</th>
            <th class="isSortable {active === 'vcr_code' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.vcr_code, 'vcr_code')}>VCR Code</th>
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
            <td><input id="confirmed-{index}" type="checkbox" bind:checked={fileItem.confirmed} on:click={updateConfirmed(fileItem.link_id, fileItem.confirmed)}></td>
            {#if index != editable_box}
            <td class="snippet" style="height: {fileItem.scale() * fileItem.height}px; min-width: {snippet_target}px; max-width: {snippet_target}px;"
                on:dblclick={boxEditable(fileItem, index)}
            >
                <div class="snippet" style="height: {fileItem.height}px; position: relative; top: 0px; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <img src={img_src} style="
                        width: {fileItem.width}px;
                        height: {fileItem.height}px;
                        object-fit: none;
                        object-position: -{fileItem.left}px -{fileItem.top}px;
                        scale: {fileItem.scale()};
                        translate: -{fileItem.translation()}px 0px;
                    " alt="Snippet for {fileItem.title} ({fileItem.year})"/>
                    <div class="item"
                         style="
                              position: absolute;
                              transform: translate(-50%, -50%);
                              left: { (fileItem.x - fileItem.left) * fileItem.scale() }px;
                              top: { (fileItem.y - fileItem.top) * fileItem.scale() + (fileItem.height * (1 - fileItem.scale())) / 2}px;
                              width: 10px;
                              height: 10px;
                              background: rgba(183, 52, 30, 0.75);
                              border-radius: 5px;
                              color: #000000"
                    ></div>
                </div>
            </td>
            {:else}
            <td class="snippet" style="height: {new_box.largest_height() + 150}px; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                <div class="snippet" style="height: {new_box.largest_height()}px; position: relative; top: 0px; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="position: absolute; top: 0px;">
                    <img src={img_src} style="
                        width: {new_box.width()}px;
                        height: {new_box.height()}px;
                        object-fit: none;
                        object-position: -{new_box.left}px -{new_box.top}px;
                        scale: {new_box.scale()};
                        translate: {new_box.translation()}px {(new_box.largest_height() - new_box.height()) / 2}px;
                    " alt="Snippet for {fileItem.title} ({fileItem.year})"/>
                    </div>
                    <div class="item"
                         style="
                              position: absolute;
                              transform: translate(-50%, -50%);
                              left: { (fileItem.x - new_box.left) * new_box.scale()}px;
                              top: { (fileItem.y - new_box.top) * new_box.scale() + (new_box.height() * (1 - new_box.scale())) / 2 + (new_box.largest_height() - new_box.height()) / 2 }px;
                              width: 10px;
                              height: 10px;
                              background: rgba(183, 52, 30, 0.75);
                              border-radius: 5px;
                              color: #000000"
                    ></div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="max-height: 50px;  width: {snippet_target}px; position: absolute; bottom: 0px;">
                        Left: <input type="range" min="{old_box.left - 500}" max="{old_box.right}" bind:value={new_box.left} />
                        Right: <input type="range" min="{old_box.left}" max="{old_box.right + 500}" bind:value={new_box.right} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="max-height: 50px;  width: {snippet_target}px; position: absolute; bottom: 0px;">
                        Top: <input type="range" min="{old_box.top - 100}" max="{old_box.bottom}" bind:value={new_box.top} />
                        Bottom: <input type="range" min="{old_box.top}" max="{old_box.bottom + 100}" bind:value={new_box.bottom} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="height: 50px;  width: {snippet_target}px; position: absolute; bottom: 0px;">
                        <button on:click={updateBox(fileItem.box_id)}>Submit</button>
                    </div>
                </div>
            </td>
            {/if}
            <Channel closeOut={closeOut} item={fileItem} index={index} show_title={false}/>
            <Time closeOut={closeOut} item={fileItem} index={index} show_title={false}/>
            <Duration closeOut={closeOut} item={fileItem} index={index} show_title={false}/>
            <VCRCode closeOut={closeOut} item={fileItem} index={index} show_title={false}/>
            <td><a href='/link?link_id={fileItem.link}'>{fileItem.title}</a></td>
            <td>{fileItem.year}</td>
            <td>{fileItem.rating}</td>
            <td>{fileItem.votes}</td>
            <Link closeOut={closeOut} item={fileItem} index={index} show_title={false}/>
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
}

td {
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

.snippet {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}

</style>
