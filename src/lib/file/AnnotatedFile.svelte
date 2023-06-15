<script>
import { fileItems } from './file.js';

export let img_src;
export let selected;

let img;
let original_width;
let new_width;
let display_img = false;

function loadImg() {
    if (img) {
        original_width = img.width;
        new_width = 1500;
        display_img = true;
    }
}

</script>

<main>
    <div>
        <img class="annotated-file"
            style="width: {new_width}px;"
            bind:this={img}
            src={img_src}
            alt="Annotated file for file id {selected}"
            on:load={loadImg}
         />
        {#each $fileItems as fileItem}
            <button class="box" style="
                      position: absolute;
                      left: { img?.offsetLeft + fileItem.top * new_width / original_width - 1 }px;
                      top: { img?.offsetTop + fileItem.left * new_width / original_width - 1 }px;
                      width: {fileItem.width * new_width / original_width + 2}px;
                      height: {fileItem.height * new_width / original_width + 2}px;
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
                      left: { img?.offsetLeft + fileItem.x * new_width / original_width }px;
                      top: { img?.offsetTop + fileItem.y * new_width / original_width }px"
            >&#9733;</div>
        {/each}
    </div>
</main>

<style>
</style>
