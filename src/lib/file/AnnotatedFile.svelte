<script>
import { fileItems } from './file.js';

export let img_src;
export let selected;

let img;
let original_width;
let new_width;

function loadImg() {
    original_width = img.width;
    new_width = 1500;
}

$: console.log(original_width, img?.x, img?.y, img?.height, img?.width);

</script>

<main>
    <div>
        <img class="annotated-file"
            style="width: {new_width}px;"
            bind:this={img}
            src={img_src}
            alt="Annotated file for file id {selected}"
            on:dblclick={(mouse) => console.log(mouse.offsetX, mouse.offsetY, mouse.x, mouse.y, img?.x, img?.y)}
            on:load={loadImg}
         />
        {#each $fileItems as fileItem}
            <button class="box" style="
                      position: absolute;
                      left: {img?.x + fileItem.top * new_width / original_width}px;
                      top: {img?.y + fileItem.left * new_width / original_width}px;
                      width: {fileItem.width * new_width / original_width}px;
                      height: {fileItem.height * new_width / original_width}px;
                      border-color: #ff0000;
                      background-color: transparent;
                      border-width: 3px;
                      color: #000000"
            >
            </button>
            <div class="item"
                 style="
                      position: absolute;
                      color: #ff0000;
                      transform: translate(-50%, -50%);
                      left: {img?.x + fileItem.x * new_width / original_width}px;
                      top: {img?.y + fileItem.y * new_width / original_width}px"
            >&#9733;</div>
        {/each}
    </div>
</main>

<style>
</style>
