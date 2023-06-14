<script>
import { fileItems } from './file.js';

export let img_src;
export let selected;

let img;
let img_x;
let img_y;

function loadImg() {
    img_x = img.x;
    img_y = img.y;
}

$: console.log(img_x, img_y);

</script>

<main>
    <div>
        <img class="annotated-file"
             bind:this={img}
             src={img_src}
             alt="Annotated file for file id {selected}"
             on:dblclick={(mouse) => console.log(mouse.offsetX, mouse.offsetY, mouse.x, mouse.y, img_x, img_y)}
             on:load={loadImg}
         />
        {#each $fileItems as fileItem}
            <div class="test" style="left: {img_x + fileItem.x}px; top: {img_y + fileItem.y}px">0</div>
        {/each}
    </div>
</main>

<style>
    .annotated-file {
    }
    .test {
        position: absolute;
        background-color: #ff0000;
    }
</style>
