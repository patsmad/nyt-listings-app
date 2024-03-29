<script>
import { annotatedFileData } from './annotated.js';
import { fileItems, snippet_target } from './file.js';
import Channel from '../update/Channel.svelte';
import Delete from '../update/Delete.svelte';
import Duration from '../update/Duration.svelte';
import Link from '../update/Link.svelte';
import Time from '../update/Time.svelte';
import VCRCode from '../update/VCRCode.svelte';

export let img_src;
export let selected;

let img;
let original_height;
let new_height;
let display_img = false;

function loadImg() {
    if (img) {
        original_height = img.height;
        new_height = 2000;
        display_img = true;
    }
}

async function addItem(mouse) {
    await fetch('http://localhost:5000/item/add?api_key=' + import.meta.env.VITE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
            'file_id': selected,
            'x': parseInt(mouse.offsetX * original_height / new_height),
            'y': parseInt(mouse.offsetY * original_height / new_height)
        })
    })
    await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
}

let new_box;
let old_box;
function boxEditable(fileItem) {
    return () => {
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
    }
    closeModal();
}

async function closeOut() {
    await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    closeModal();
}

let dialog;
let modalFileItem;
let modalPosterLink;
function openModal(fileItem) {
    modalFileItem = fileItem;
    modalPosterLink = 'http://localhost:5000/poster/?link=' + fileItem.link + '&api_key=' + import.meta.env.VITE_API_KEY
    new_box = fileItem.box();
    old_box = fileItem.box();
    dialog.showModal();
}

function closeModal() {
    new_box = null;
    old_box = null;
    dialog.close();
}
</script>

<main>
    {#if $fileItems}
    <div>
        <img class="annotated-file"
            style="height: {new_height}px;"
            bind:this={img}
            src={img_src}
            alt="Annotated file for file id {selected}"
            on:load={loadImg}
            on:dblclick={(mouse) => addItem(mouse)}
         />
        <dialog bind:this={dialog} on:click|self={() => closeModal()} on:keypress={(e) => null}>
            {#if new_box}
            <div class="snippet" style="height: {new_box?.largest_height() + 150}px; min-width: {snippet_target}px; max-width: {snippet_target}px; display: inline-block;">
                {#if modalFileItem?.link}
                    <a href={modalFileItem?.link} target="_blank">
                        <img src={modalPosterLink} alt="Poster for {modalFileItem.title} ({modalFileItem.year})"/>
                    </a>
                {:else}
                    <img src={modalPosterLink} alt="Poster for {modalFileItem.title} ({modalFileItem.year})"/>
                {/if}
                <div style="width: 400px;">
                    <Link closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
                </div>
                <div style="width: 400px;">
                    <div style="width: 200px; display: inline-block;" align="left">
                        <b>Title: </b><a href="/link?link_id={modalFileItem?.link}" target="_blank">{modalFileItem?.title}</a>
                    </div>
                    <div style="width: 150px; display: inline-block;" align="left">
                        <Channel closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
                    </div>
                </div>
                <div style="width: 400px;">
                    <div style="width: 200px; display: inline-block;" align="left">
                        <b>Year: </b>{modalFileItem?.year}
                    </div>
                    <div style="width: 150px; display: inline-block;" align="left">
                        <Time closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
                    </div>
                </div>
                <div style="width: 400px;">
                    <div style="width: 200px; display: inline-block;" align="left">
                        <b>Rating: </b>{modalFileItem?.rating}
                    </div>
                    <div style="width: 150px; display: inline-block;" align="left">
                        <Duration closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
                    </div>
                </div>
                <div style="width: 400px;">
                    <div style="width: 200px; display: inline-block;" align="left">
                        <b>Votes: </b>{modalFileItem?.votes}
                    </div>
                    <div style="width: 150px; display: inline-block;" align="left">
                        <VCRCode closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
                    </div>
                </div>
                <Delete  closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
            </div>
            <div class="snippet" style="height: {new_box?.largest_height() + 150}px; min-width: {snippet_target}px; max-width: {snippet_target}px; display: inline-block;">
                <div class="snippet" style="height: {new_box?.largest_height()}px; position: relative; top: 0px; min-width: {snippet_target}px; max-width: {snippet_target}px;">
                    <div style="position: absolute; top: 0px;">
                    <img src={img_src} style="
                        width: {new_box.width()}px;
                        height: {new_box.height()}px;
                        object-fit: none;
                        object-position: -{new_box.left}px -{new_box.top}px;
                        scale: {new_box.scale()};
                        translate: {new_box.translation()}px {(new_box.largest_height() - new_box.height()) / 2}px;
                    " alt="Snippet for {modalFileItem?.title} ({modalFileItem?.year})"/>
                    </div>
                    <div class="item"
                         style="
                              position: absolute;
                              transform: translate(-50%, -50%);
                              left: { (modalFileItem?.x - new_box.left) * new_box.scale()}px;
                              top: { (modalFileItem?.y - new_box.top) * new_box.scale() + (new_box.height() * (1 - new_box.scale())) / 2 + (new_box.largest_height() - new_box.height()) / 2 }px;
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
                        <button on:click={updateBox(modalFileItem.box_id)}>Submit</button>
                    </div>
                </div>
            </div>
            {/if}
        </dialog>
        {#each $fileItems as fileItem, index}
            <div style="
                      position: absolute;
                      transform: translate(-50%, -50%);
                      left: { img?.offsetLeft + fileItem.x * new_height / original_height }px;
                      top: { img?.offsetTop + fileItem.y * new_height / original_height }px;
                      width: 10px;
                      height: 10px;
                      background: { fileItem.link == '' ? 'rgba(17, 123, 183, 0.35)'  : 'rgba(183, 52, 30, 0.5)' };
                      border-radius: 5px;
                      color: #000000"
            ></div>
            <button class="box" style="
                      position: absolute;
                      left: { img?.offsetLeft + fileItem.left * new_height / original_height - 1 }px;
                      top: { img?.offsetTop + fileItem.top * new_height / original_height - 1 }px;
                      width: {fileItem.width * new_height / original_height + 2}px;
                      height: {fileItem.height * new_height / original_height + 2}px;
                      background: {fileItem.link == '' ? 'rgba(183, 52, 30, 0.5)' :
                        (fileItem.vcr_code === null ?
                            (fileItem.channel !== null || fileItem.time !== null || fileItem.duration_minutes !== null ?
                                'repeating-linear-gradient(45deg, rgba(17, 123, 183, 0.35), rgba(17, 123, 183, 0.35) 10%, rgb(300, 300, 300, 0.30) 11%, rgb(300, 300, 300, 0.30) 20%)' : 'rgb(223, 203, 90, 0.30)'
                            ) : 'rgba(17, 123, 183, 0.35)') };
                      border-radius: 0px;
                      padding-top: 0px;
                      padding-bottom: 0px;
                      color: #000000"
                 on:click={openModal(fileItem)}
                 on:keypress={(e) => openModal(fileItem)}
            >
            </button>
        {/each}
    </div>
    {/if}
</main>

<style>

.box {
    cursor: pointer;
}

.snippet {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}

</style>
