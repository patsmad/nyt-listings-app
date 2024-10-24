<script>
export let item;
export let index;
export let closeOut;
export let show_title;

let tag = show_title? "div" : "td";

let title_editable;
let new_title;
let old_title;
resetTitle();

function resetTitle() {
    title_editable = -1;
    new_title = '';
    old_title = '';
}

function makeTitleEditable(title, index) {
    return () => {
        title_editable = index;
        new_title = title;
        old_title = title;
    }
}

async function updateTitle(link_id) {
    if (new_title != old_title) {
        await fetch('http://localhost:5000/title/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': link_id,
                'title': new_title,
                'confirmed': true
            })
        })
        await closeOut();
    }
    resetTitle();
}

async function addTitle(box_id) {
    if (new_title != '') {
        await fetch('http://localhost:5000/title/add?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'box_id': box_id,
                'title': new_title,
                'confirmed': true
            })
        })
        await closeOut();
    }
    resetTitle();
}

</script>

<svelte:element this={tag} on:dblclick={makeTitleEditable(item?.title, index)}>
{#if title_editable != index}
    {#if show_title}<b>Title: </b>{/if}
    {#if item?.link}
        <a href='/link?link_id={item?.link}'>{item?.title}</a>
    {/if}
{:else}
    {#if show_title}<b>Title: </b>{/if}
    {#if item?.link}
        <form on:submit|preventDefault={(e) => updateTitle(item?.link_id)}>
            <input bind:value={new_title} />
        </form>
    {:else}
        <form on:submit|preventDefault={(e) => addTitle(item?.box_id)}>
            <input bind:value={new_title} />
        </form>
    {/if}
{/if}
</svelte:element>
