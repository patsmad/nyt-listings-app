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

let dialog;
let modalFileItem;
let modalOpen = false;
function openModal(fileItem) {
    modalFileItem = fileItem;
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
        <dialog bind:this={dialog} on:click|self={() => closeModal()}>
            <button class="x" on:click={deleteItem(modalFileItem.id)}>X</button>
            {#if new_box}
            <td class="snippet" style="height: {new_box?.largest_height() + 150}px; min-width: {snippet_target}px; max-width: {snippet_target}px;">
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
                              color: #ff0000;
                              transform: translate(-50%, -50%);
                              left: { (modalFileItem?.x - new_box.left) * new_box.scale()}px;
                              top: { (modalFileItem?.y - new_box.top) * new_box.scale() + (new_box.height() * (1 - new_box.scale())) / 2 + (new_box.largest_height() - new_box.height()) / 2 }px"
                    >&#9733;</div>
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
            </td>
            {/if}
            <div>{modalFileItem?.title}</div>
        </dialog>
        {#each $fileItems as fileItem}
            <div class="box" style="
                      position: absolute;
                      left: { img?.offsetLeft + fileItem.left * new_height / original_height - 1 }px;
                      top: { img?.offsetTop + fileItem.top * new_height / original_height - 1 }px;
                      width: {fileItem.width * new_height / original_height + 2}px;
                      height: {fileItem.height * new_height / original_height + 2}px;
                      border-color: #ff0000;
                      background: rgba(142, 52, 30, 0.5);
                      border-width: 2px;
                      border-radius: 0px;
                      color: #000000"
                 on:click={openModal(fileItem)}
            >
            </div>
            <div class="item"
                 style="
                      position: absolute;
                      color: #ff0000;
                      transform: translate(-50%, -50%);
                      left: { img?.offsetLeft + fileItem.x * new_height / original_height }px;
                      top: { img?.offsetTop + fileItem.y * new_height / original_height }px"
                 on:click={openModal(fileItem)}
            >&#9733;</div>
        {/each}
    </div>
    {/if}
</main>

<style>
.box {
    cursor: pointer;
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
