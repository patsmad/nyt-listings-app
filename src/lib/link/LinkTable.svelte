<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { linkFiles, linkFilesData, snippet_target } from './link.js';

export let selected;

let linkFilesList = derived(linkFiles, linkFiles => linkFiles.link_files??[]);

let asc = true;
let active = 'id';
let sortFnc = item => item.id;

let sortLinkList = () => derived(
    linkFilesList,
    linkFilesList => linkFilesList?.filter(item => sortFnc(item) !== null).sort((itemA, itemB) => {
            if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
            if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
        return 0;
    }).concat(linkFilesList?.filter(item => sortFnc(item) === null))
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
    await fetch('http://localhost:5000/link/?link=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => linkFilesData.set(data))
    sortedLinkList = sortLinkList();
    deletable = -1;
}

let editable_box=-1;
let new_box = [];
let old_box = [];
function boxEditable(linkFile, index) {
    return () => {
        editable_box = index;
        new_box = linkFile.box();
        old_box = linkFile.box();
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
        await fetch('http://localhost:5000/link/?link=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => linkFilesData.set(data))
        sortedLinkList = sortLinkList();
    }
    editable_box = -1;
    new_box = [];
    old_box = [];
}

let vcr_code_editable = -1;
let new_vcr_code = '';
let old_vcr_code = '';
function VCRCodeEditable(vcr_code, index) {
    return () => {
        vcr_code_editable = index;
        new_vcr_code = vcr_code;
        old_vcr_code = vcr_code;
    }
}
async function updateVCRCode(box_id, file_date) {
    let date = new Date(file_date)
    date = new Date(date.toLocaleString('en-US', {timeZone: 'Europe/London'}));
    if (new_vcr_code != old_vcr_code) {
        await fetch('http://localhost:5000/vcr_code/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': box_id,
                'year': date.getFullYear(),
                'month': date.getMonth() + 1,
                'day': date.getDate(),
                'vcr_code': new_vcr_code
            })
        })
        await fetch('http://localhost:5000/link/?link=' + selected +'&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => linkFilesData.set(data))
        sortedLinkList = sortLinkList();
    }
    vcr_code_editable = -1;
    new_vcr_code = '';
    old_vcr_code = '';
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
            <th class="isSortable {active === 'channel' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.channel, 'channel')}>Channel</th>
            <th class="isSortable {active === 'time' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.time_as_decimal(), 'time')}>Time</th>
            <th class="isSortable {active === 'duration' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.duration_minutes, 'duration')}>Duration (min.)</th>
            <th class="isSortable {active === 'vcr_code' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.vcr_code, 'vcr_code')}>VCR Code</th>
            <th class="isSortable {active === 'confirmed' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.confirmed, 'confirmed')}>Confirmed</th>
            <th>Link</th>
        </tr>
    </thead>
    <tbody>
    {#if $sortedLinkList}
        {#each $sortedLinkList as linkFile, index}
        <tr>
            <td on:dblclick={itemDeletable(index)}>
                {#if deletable != index}
                {linkFile.link_id}
                {:else}
                <button class="x" on:click={deleteItem(linkFile.item_id)}>X</button>
                {/if}
            </td>
            <td><a href="/file?file_id={linkFile.file_id}">{linkFile.file}</a></td>
            {#if linkFile.height}
            {#if index != editable_box}
            <td class="snippet" style="height: {linkFile.scale() * linkFile.height}px; min-width: {snippet_target}px; max-width: {snippet_target}px;"
                on:dblclick={boxEditable(linkFile, index)}
            >
                <div class="snippet" style="height: {linkFile.height}px; position: relative; top: 0px; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <img src={getImgSrc(linkFile)} style="
                        width: {linkFile.width}px;
                        height: {linkFile.height}px;
                        scale: {linkFile.scale()};
                        translate: -{linkFile.translation()}px 0px;
                    " alt="Snippet for {linkFile.title} ({linkFile.file})"/>
                    <div class="item"
                         style="
                              position: absolute;
                              transform: translate(-50%, -50%);
                              left: { (linkFile.x - linkFile.left) * linkFile.scale() }px;
                              top: { (linkFile.y - linkFile.top) * linkFile.scale() + (linkFile.height * (1 - linkFile.scale())) / 2}px;
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
                    <img src={getImgSrc(linkFile)} style="
                        width: {new_box.width()}px;
                        height: {new_box.height()}px;
                        object-fit: none;
                        object-position: {old_box.left - new_box.left}px {old_box.top - new_box.top}px;
                        scale: {new_box.scale()};
                        translate: {new_box.translation()}px {(new_box.largest_height() - new_box.height()) / 2}px;
                    " alt="Snippet for {linkFile.title} ({linkFile.year})"/>
                    </div>
                    <div class="item"
                         style="
                              position: absolute;
                              transform: translate(-50%, -50%);
                              left: { (linkFile.x - new_box.left) * new_box.scale() }px;
                              top: { (linkFile.y - new_box.top) * new_box.scale() + (new_box.height() * (1 - new_box.scale())) / 2 + (new_box.largest_height() - new_box.height()) / 2}px;
                              width: 10px;
                              height: 10px;
                              background: rgba(183, 52, 30, 0.75);
                              border-radius: 5px;
                              color: #000000"
                    ></div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="max-height: 50px;  width: {snippet_target}px; position: absolute; bottom: 0px;">
                        Left: <input type="range" min="{old_box.left}" max="{old_box.right}" bind:value={new_box.left} />
                        Right: <input type="range" min="{old_box.left}" max="{old_box.right}" bind:value={new_box.right} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="max-height: 50px;  width: {snippet_target}px; position: absolute; bottom: 0px;">
                        Top: <input type="range" min="{old_box.top}" max="{old_box.bottom}" bind:value={new_box.top} />
                        Bottom: <input type="range" min="{old_box.top}" max="{old_box.bottom}" bind:value={new_box.bottom} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="height: 50px;  width: {snippet_target}px; position: absolute; bottom: 0px;">
                        <button on:click={updateBox(linkFile.box_id)}>Submit</button>
                    </div>
                </div>
            </td>
            {/if}
            <td>{linkFile.channel}</td>
            <td>{linkFile.time}</td>
            <td>{linkFile.duration_minutes}</td>
            <td on:dblclick={VCRCodeEditable(linkFile.vcr_code, index)}>
                {#if index != vcr_code_editable}
                {linkFile.vcr_code}
                {:else}
                <form on:submit|preventDefault={(e) => updateVCRCode(linkFile.box_id, linkFile.file_date)}>
                    <input id="vcr_code_update" bind:value={new_vcr_code} />
                </form>
                {/if}
            </td>
            <td><input id="confirmed-{index}" type="checkbox" bind:checked={linkFile.confirmed} on:click={updateConfirmed(linkFile.link_id, linkFile.confirmed)}></td>
            <td on:dblclick={linkEditable(linkFile.link, index)}>
            {#if index != editable}
            <a href={linkFile.link} target="_blank">
                <img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" />
            </a>
            {:else}
            <form on:submit|preventDefault={(e) => updateLink(linkFile.link_id)}>
                <input id="new_link_update" bind:value={new_value} />
            </form>
            {/if}
            </td>
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
