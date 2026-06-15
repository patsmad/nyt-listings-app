<script>
import { annotatedFileData } from './annotated.js';
import { fileItems, max_width, max_height } from './file.js';
import Delete from '../update/Delete.svelte';
import Link from '../update/Link.svelte';
import Title from '../update/Title.svelte';

export let img_src;
export let selected;

let img;
let original_height;
let new_height;
let display_img = false;
let x1;
let y1;
let availableTitles;

async function setAvailableTitles() {
    if (!availableTitles) {
        await fetch(import.meta.env.VITE_API_HOST + '/available_titles/', {credentials: 'include'})
            .then(response => response.json())
            .then(data => availableTitles = data)
    }
}

function loadImg() {
    if (img) {
        original_height = img.height;
        new_height = 1000;
        display_img = true;
    }
}

async function addItem(mouse) {
    if (x1 && y1) {
        let left;
        let right;
        let top;
        let bottom;
        let x2 = mouse.offsetX * original_height / new_height;
        let y2 = mouse.offsetY * original_height / new_height
        if (x1 < x2) {
            left = x1;
            right = x2;
        } else {
            left = x2;
            right = x1;
        }
        if (y1 < y2) {
            top = y1;
            bottom = y2;
        } else {
            top = y2;
            bottom = y1;
        }
        await fetch(import.meta.env.VITE_API_HOST + '/item/add/', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                'file_id': selected,
                'left': parseInt(left),
                'top': parseInt(top),
                'width': parseInt(right - left),
                'height': parseInt(bottom - top)
            })
        })
        await fetch(import.meta.env.VITE_API_HOST + '/file/?file_id=' + selected, {credentials: 'include'})
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
        x1 = null;
        y1 = null;
    } else {
        x1 = mouse.offsetX * original_height / new_height;
        y1 = mouse.offsetY * original_height / new_height;
    }
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
        await fetch(import.meta.env.VITE_API_HOST + '/box/update/', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                'id': box_id,
                'left': new_box.left,
                'top': new_box.top,
                'width': new_box.width(),
                'height': new_box.height()
            })
        })
        await fetch(import.meta.env.VITE_API_HOST + '/file/?file_id=' + selected, {credentials: 'include'})
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
    }
    closeModal();
}

async function closeOut() {
    await fetch(import.meta.env.VITE_API_HOST + '/file/?file_id=' + selected, {credentials: 'include'})
        .then(response => response.json())
        .then(data => annotatedFileData.set(data))
    closeModal();
}

let dialog;
let modalFileItem;
let modalPosterLink;
function openModal(fileItem) {
    modalFileItem = fileItem;
    modalPosterLink = import.meta.env.VITE_API_HOST + '/poster/?link=' + fileItem.link
    new_box = fileItem.box();
    old_box = fileItem.box();
    setAvailableTitles();
    dialog.showModal();
}

function closeModal() {
    new_box = null;
    old_box = null;
    dialog.close();
}

async function checkTitles(file_id) {
    await fetch(import.meta.env.VITE_API_HOST + '/title/check/', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            'file_id': file_id
        })
    })
    await closeOut();
}

</script>

<main>
    <button on:click={checkTitles(selected)}>
        Check
    </button>
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
            <div class="snippet" style="height: {max_height + 150}px; min-width: {max_width}px; max-width: {max_width}px; display: inline-block;">
                {#if modalFileItem?.link}
                    <a href={modalFileItem?.link} target="_blank">
                        <img src={modalPosterLink} alt="Poster for {modalFileItem.title} ({modalFileItem.year})"/>
                    </a>
                {:else}
                    <img src={modalPosterLink} alt="Poster for {modalFileItem.title} ({modalFileItem.year})"/>
                {/if}
                <div style="min-width: {max_width}px; max-width: {max_width}px;">
                    <Link closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
                </div>
                <div style="min-width: {max_width}px; max-width: {max_width}px;">
                    <Title closeOut={closeOut} item={modalFileItem} index=1 show_title={true} availableTitles={availableTitles}/>
                </div>
                <div style="min-width: {max_width}px; max-width: {max_width}px;">
                    <b>Year: </b>{modalFileItem?.year}
                </div>
                <div style="min-width: {max_width}px; max-width: {max_width}px;">
                    <b>Rating: </b>{modalFileItem?.rating}
                </div>
                <div style="min-width: {max_width}px; max-width: {max_width}px;">
                    <b>Votes: </b>{modalFileItem?.votes}
                </div>
                <Delete  closeOut={closeOut} item={modalFileItem} index=1 show_title={true}/>
            </div>
            <div class="snippet" style="height: {max_height+ 150}px; min-width: {max_width}px; max-width: {max_width}px; display: inline-block; overflow: hidden;">
                <div class="snippet" style="min-height: {max_height}px; max-height: {max_height}px; min-width: {max_width}px; max-width: {max_width}px;">
                    <img
                        src={img_src}
                        style="
                            width: {new_box.width()}px;
                            height: {new_box.height()}px;
                            scale: {new_box.scale()};
                            object-fit: none;
                            object-position: -{new_box.left}px -{new_box.top}px;
                            translate: {new_box.translate_x()}px {new_box.translate_y()}px;
                        "
                        alt="Snippet for {modalFileItem.title} ({modalFileItem.file})"
                    />
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="max-height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        Left: <input type="range" min="{old_box.left - 500}" max="{old_box.right}" bind:value={new_box.left} />
                        Right: <input type="range" min="{old_box.left}" max="{old_box.right + 500}" bind:value={new_box.right} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="max-height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        Top: <input type="range" min="{old_box.top - 500}" max="{old_box.bottom}" bind:value={new_box.top} />
                        Bottom: <input type="range" min="{old_box.top}" max="{old_box.bottom + 500}" bind:value={new_box.bottom} />
                    </div>
                </div>
                <div class="snippet" style="height: 50px; position: relative; min-width: {max_width}px; max-width: {max_width}px;">
                    <div style="height: 50px;  width: {max_width}px; position: absolute; bottom: 0px;">
                        <button on:click={updateBox(modalFileItem.box_id)}>Submit</button>
                    </div>
                </div>
            </div>
            {/if}
        </dialog>
        {#if x1 && y1}
            <div style="
                      position: absolute;
                      transform: translate(-50%, -50%);
                      left: { img?.offsetLeft + x1 * new_height / original_height }px;
                      top: { img?.offsetTop + y1 * new_height / original_height }px;
                      width: 10px;
                      height: 10px;
                      background: rgba(183, 52, 30, 0.5);
                      border-radius: 5px;
                      color: #000000"
            ></div>
        {/if}
        {#each $fileItems as fileItem, index}
            <button class="box" style="
                      position: absolute;
                      left: { img?.offsetLeft + fileItem.left * new_height / original_height - 1 }px;
                      top: { img?.offsetTop + fileItem.top * new_height / original_height - 1 }px;
                      width: {fileItem.width * new_height / original_height + 2}px;
                      height: {fileItem.height * new_height / original_height + 2}px;
                      background: {fileItem.link == '' ? 'rgba(183, 52, 30, 0.5)' : 'rgba(17, 123, 183, 0.35)' };
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
