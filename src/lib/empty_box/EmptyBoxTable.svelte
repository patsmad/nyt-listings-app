<script>
import { derived } from 'svelte/store'
import { linkFiles, linkFilesData, max_width, max_height } from './empty_box.js';
import Delete from '../update/Delete.svelte';
import Link from '../update/Link.svelte';
import Title from '../update/Title.svelte';
import { authFetch } from '../clerk/clerk.js';
import AuthImage from '../clerk/AuthImage.svelte';

export let availableTitles;

let linkFilesList = derived(linkFiles, linkFiles => linkFiles.link_files??[]);

let asc = true;
let active = 'time';
let sortFnc = item => item.time_as_decimal();

let sortLinkList = () => derived(
    linkFiles,
    linkFiles => linkFiles.filter(item => sortFnc(item) !== null).sort((itemA, itemB) => {
            if (sortFnc(itemA) > sortFnc(itemB)) { return -1 + 2 * asc; }
            if (sortFnc(itemA) < sortFnc(itemB)) { return 1 - 2 * asc; }
        return 0;
    }).concat(linkFiles.filter(item => sortFnc(item) === null))
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
    return import.meta.env.VITE_API_HOST + '/img/?file_id=' + linkFile.file_id +
        '&box=' + linkFile.left + ',' + linkFile.top + ',' + linkFile.width + ',' + linkFile.height
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
        await authFetch('/empty_boxes/')
            .then(response => response.json())
            .then(data => linkFilesData.set(data))
        sortedLinkList = sortLinkList();
    }
    editable_box = -1;
    new_box = [];
    old_box = [];
}

async function closeOut() {
    await authFetch('/empty_boxes/')
        .then(response => response.json())
        .then(data => linkFilesData.set(data))
    sortedLinkList = sortLinkList();
}

</script>

{#if $linkFiles}
    <div>Count: {$sortedLinkList.length}</div>
{/if}
<table class="link-file-table">
    <thead>
        <tr>
            <th class="isSortable {active === 'id' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.item_id, 'id')}>ID</th>
            <th class="isSortable {active === 'file' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.file, 'file')}>File</th>
            <th>Snippet</th>
            <th class="isSortable {active === 'title' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(item => item.title, 'title')}>Title</th>
            <th>Link</th>
        </tr>
    </thead>
    <tbody>
    {#if $sortedLinkList}
        {#each $sortedLinkList as linkFile, index}
        <tr>
            <Delete  closeOut={closeOut} item={linkFile} index={index} show_title={false}/>
            <td><a href="/file?file_id={linkFile.file_id}">{linkFile.file}</a></td>
            {#if linkFile.height}
            {#if index != editable_box}
            <td class="snippet"
                style="
                    min-width: {max_width}px;
                    max-width: {max_width}px;
                    min-height: {max_height}px;
                    max-height: {max_height}px;
                "
                on:dblclick={boxEditable(linkFile, index)}
            >
                <div
                    style="
                        min-width: {max_width}px;
                        max-width: {max_width}px;
                        min-height: {max_height}px;
                        max-height: {max_height}px;
                    ">
                    <AuthImage
                        src={getImgSrc(linkFile)}
                        style="
                            display: flex;
                            width: {linkFile.width * linkFile.scale()}px;
                            height: {linkFile.height * linkFile.scale()}px;
                            translate:
                                {max_width / 2 - linkFile.width * linkFile.scale() / 2}px
                                {max_height / 2 - linkFile.height * linkFile.scale() / 2}px;
                        "
                        alt="Snippet for {linkFile.title} ({linkFile.file})"
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
                    on:dblclick={boxEditable(linkFile, index)}
                >
                    <div
                        style="
                            min-width: {max_width}px;
                            max-width: {max_width}px;
                            min-height: {max_height}px;
                            max-height: {max_height}px;
                        ">
                        <AuthImage
                            src={getImgSrc(linkFile)}
                            style="
                                width: {new_box.width()}px;
                                height: {new_box.height()}px;
                                scale: {new_box.scale()};
                                object-fit: none;
                                object-position: {old_box.left - new_box.left}px {old_box.top - new_box.top}px;
                                translate: {new_box.translate_x()}px {new_box.translate_y()}px;
                            "
                            alt="Snippet for {linkFile.title} ({linkFile.file})"
                        />
                    </div>
                </td>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="max-height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        Left: <input type="range" min="{old_box.left}" max="{old_box.right}" bind:value={new_box.left} />
                        Right: <input type="range" min="{old_box.left}" max="{old_box.right}" bind:value={new_box.right} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="max-height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        Top: <input type="range" min="{old_box.top}" max="{old_box.bottom}" bind:value={new_box.top} />
                        Bottom: <input type="range" min="{old_box.top}" max="{old_box.bottom}" bind:value={new_box.bottom} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        <button on:click={updateBox(linkFile.box_id)}>Submit</button>
                    </div>
                </div>
            </div>
            {/if}
            <Title closeOut={closeOut} item={linkFile} index={index} show_title={false} availableTitles={availableTitles}/>
            <Link closeOut={closeOut} item={linkFile} index={index} show_title={false}/>
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
