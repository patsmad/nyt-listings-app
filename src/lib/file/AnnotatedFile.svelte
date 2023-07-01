<script>
import { annotatedFileData } from './annotated.js';
import { fileItems, snippet_target } from './file.js';

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

let deletable = false;
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
    deletable = false;
    closeModal();
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
    new_box = null;
    old_box = null;
    closeModal();
}

let editable=false;
let new_link='';
let old_link='';
function linkEditable(value) {
    return () => {
        console.log(value);
        editable = true;
        new_link = value;
        old_link = value;
    }
}
async function updateLink(link_id) {
    if (new_link != old_link) {
        await fetch('http://localhost:5000/link/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': link_id,
                'link': new_link,
                'confirmed': true
            })
        })
        await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
    }
    editable = false;
    new_link = '';
    old_link = '';
}
async function addLink(box_id) {
    if (new_link != '') {
        await fetch('http://localhost:5000/link/add?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'box_id': box_id,
                'link': new_link,
                'confirmed': true
            })
        })
        await fetch('http://localhost:5000/file/?file_id=' + selected + '&api_key=' + import.meta.env.VITE_API_KEY)
            .then(response => response.json())
            .then(data => annotatedFileData.set(data))
    }
    editable = false;
    new_link = '';
    old_link = '';
    closeModal();
}

let dialog;
let modalFileItem;
let modalPosterLink;
let modalOpen = false;
function openModal(fileItem) {
    modalFileItem = fileItem;
    modalPosterLink = 'http://localhost:5000/poster/?link=' + fileItem.link + '&api_key=' + import.meta.env.VITE_API_KEY
    new_box = fileItem.box();
    old_box = fileItem.box();
    dialog.showModal();
}
function closeModal() {
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
        <dialog bind:this={dialog} on:click|self={() => closeModal()} on:keypress={() => closeModal()}>
            {#if new_box}
            <div class="snippet" style="height: {new_box?.largest_height() + 150}px; min-width: {snippet_target}px; max-width: {snippet_target}px; display: inline-block;">
                <a href={modalFileItem?.link} target="_blank">
                    <img src={modalPosterLink} alt="Poster for {modalFileItem.title} ({modalFileItem.year})"/>
                </a>
                {#if !editable}
                <div style="width: 400px;" on:dblclick={linkEditable(modalFileItem?.link)}>
                    <b>Link: </b><a href={modalFileItem?.link} target="_blank">{modalFileItem?.link}</a>
                </div>
                {:else}
                {#if modalFileItem?.link_id}
                <form on:submit|preventDefault={(e) => updateLink(modalFileItem?.link_id)}>
                    <input bind:value={new_link} />
                </form>
                {:else}
                <form on:submit|preventDefault={(e) => addLink(modalFileItem?.box_id)}>
                    <input bind:value={new_link} />
                </form>
                {/if}
                {/if}
                <div style="width: 400px;"><b>Title: </b><a href="/link?link_id={modalFileItem?.link}" target="_blank">{modalFileItem?.title}</a></div>
                <div style="width: 400px;"><b>Year: </b>{modalFileItem?.year}</div>
                <div style="width: 400px;"><b>Rating: </b>{modalFileItem?.rating}</div>
                <div style="width: 400px;"><b>Votes: </b>{modalFileItem?.votes}</div>
                {#if !deletable}
                <button class="x" on:click={() => deletable = true}>Delete Item</button>
                {:else}
                <div>Are you sure?</div>
                <span>
                <button class="x" on:click={deleteItem(modalFileItem.id)} style="background-color: #777777;">Yes</button>
                <button class="x" on:click={() => deletable = false}>No</button>
                </span>
                {/if}
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
                      background: { fileItem.link == '' ? 'rgba(17, 123, 183, 0.35)' : 'rgba(183, 52, 30, 0.5)' };
                      border-radius: 5px;
                      color: #000000"
            ></div>
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
.x {
	border-radius: 3px;
    border: 1px solid transparent;
    padding: 0.3em 0.6em;
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
