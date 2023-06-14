<script>

export let img_src;
export let selected;

</script>

<main>
    <div>
        <img class="annotated-file" src={img_src} alt="Annotated file for file id {selected}" />
    </div>
</main>

<style>
    .annotated-file {
        width: 1000px;
    }
</style>
