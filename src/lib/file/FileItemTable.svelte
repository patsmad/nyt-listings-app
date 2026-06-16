<script>
import { derived } from 'svelte/store'
import { annotatedFileData } from './annotated.js'
import { fileItems, max_height, max_width } from './file.js';
import Confirmed from '../update/Confirmed.svelte';
import Delete from '../update/Delete.svelte';
import Link from '../update/Link.svelte';
import Title from '../update/Title.svelte';
import { authFetch } from '../clerk/clerk.js';
import AuthImage from '../clerk/AuthImage.svelte';

export let img_src;
export let selected;

let asc = true;
let active = 'time';
let sortFnc = item => item.time_as_decimal();
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
        await authFetch('/box/update/', {
            method: 'POST',
            body: JSON.stringify({
                'id': box_id,
                'left': new_box.left,
                'top': new_box.top,
                'width': new_box.width(),
                'height': new_box.height()
            })
        })
        await authFetch('/file/?file_id=' + selected)
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
        sortedFileItems = sortFileItems();
    }
    editable_box = -1;
    new_box = [];
    old_box = [];
}

async function closeOut() {
    await authFetch('/file/?file_id=' + selected)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    sortedFileItems = sortFileItems();
}

</script>

<div>Count: {$sortedFileItems?.length}</div>
<table class="file-item-table">
    <thead>
        <tr>
            <th class="isSortable {active === 'id' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.item_id, 'id')}>ID</th>
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
            <Delete closeOut={closeOut} item={fileItem} index={index} show_title={false}/>
            <Confirmed closeOut={closeOut} item={fileItem} index={index}/>
            {#if index != editable_box}
            <td class="snippet"
                style="
                    min-width: {max_width}px;
                    max-width: {max_width}px;
                    min-height: {max_height}px;
                    max-height: {max_height}px;
                "
                on:dblclick={boxEditable(fileItem, index)}
            >
                <div
                    style="
                        min-width: {max_width}px;
                        max-width: {max_width}px;
                        min-height: {max_height}px;
                        max-height: {max_height}px;
                    ">
                    <AuthImage src={img_src} style="
                        width: {fileItem.width}px;
                        height: {fileItem.height}px;
                        scale: {fileItem.scale()};
                        object-fit: none;
                        object-position: -{fileItem.left}px -{fileItem.top}px;
                        translate: {fileItem.translate_x()}px {fileItem.translate_y()}px;
                    " alt="Snippet for {fileItem.title} ({fileItem.year})"
                    />
                </div>
            </td>
            {:else}
            <div class="snippet" style="min-height: {max_height + 150}px; max-height: {max_height + 150}px; min-width: {max_width}px; max-width: {max_width}px;">
                <td class="snippet"
                    style="
                        min-width: {max_width}px;
                        max-width: {max_width}px;
                        min-height: {max_height}px;
                        max-height: {max_height}px;
                    "
                    on:dblclick={boxEditable(fileItem, index)}
                >
                    <div
                        style="
                            min-width: {max_width}px;
                            max-width: {max_width}px;
                            min-height: {max_height}px;
                            max-height: {max_height}px;
                        ">
                        <AuthImage
                            src={img_src}
                            style="
                                width: {new_box.width()}px;
                                height: {new_box.height()}px;
                                scale: {new_box.scale()};
                                object-fit: none;
                                object-position: -{new_box.left}px -{new_box.top}px;
                                translate: {new_box.translate_x()}px {new_box.translate_y()}px;
                            "
                            alt="Snippet for {fileItem.title} ({fileItem.file})"
                        />
                    </div>
                </td>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="max-height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        Left: <input type="range" min="{old_box.left - 500}" max="{old_box.right}" bind:value={new_box.left} />
                        Right: <input type="range" min="{old_box.left}" max="{old_box.right + 500}" bind:value={new_box.right} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="max-height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        Top: <input type="range" min="{old_box.top - 100}" max="{old_box.bottom}" bind:value={new_box.top} />
                        Bottom: <input type="range" min="{old_box.top}" max="{old_box.bottom + 100}" bind:value={new_box.bottom} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        <button on:click={updateBox(fileItem.box_id)}>Submit</button>
                    </div>
                </div>
            </div>
            {/if}
            <Title closeOut={closeOut} item={fileItem} index={index} show_title={false}/>
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

.snippet {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}

</style>
