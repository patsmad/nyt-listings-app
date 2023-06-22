<script>
import { fileItems } from './file.js';

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

</script>

<main>
    <div>
        <img class="annotated-file"
            style="height: {new_height}px;"
            bind:this={img}
            src={img_src}
            alt="Annotated file for file id {selected}"
            on:load={loadImg}
         />
        {#each $fileItems as fileItem}
            <button class="box" style="
                      position: absolute;
                      left: { img?.offsetLeft + fileItem.left * new_height / original_height - 1 }px;
                      top: { img?.offsetTop + fileItem.top * new_height / original_height - 1 }px;
                      width: {fileItem.width * new_height / original_height + 2}px;
                      height: {fileItem.height * new_height / original_height + 2}px;
                      border-color: #ff0000;
                      background-color: transparent;
                      border-width: 2px;
                      border-radius: 0px;
                      color: #000000"
            >
            </button>
            <div class="item"
                 style="
                      position: absolute;
                      color: #ff0000;
                      transform: translate(-50%, -50%);
                      left: { img?.offsetLeft + fileItem.x * new_height / original_height }px;
                      top: { img?.offsetTop + fileItem.y * new_height / original_height }px"
            >&#9733;</div>
        {/each}
    </div>
</main>

<style>
</style>
