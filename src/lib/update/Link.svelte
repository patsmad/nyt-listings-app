<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'

export let item;
export let index;
export let closeOut;
export let show_title;

let tag = show_title? "div" : "td";

let link_editable;
let new_link;
let old_link;
resetLink();

function resetLink() {
    link_editable = -1;
    new_link = '';
    old_link = '';
}

function makeLinkEditable(link, index) {
    return () => {
        link_editable = index;
        new_link = link;
        old_link = link;
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
        await closeOut();
    }
    resetLink();
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
        await closeOut();
    }
    resetLink();
}

</script>

<svelte:element this={tag} on:dblclick={makeLinkEditable(item?.link, index)}>
{#if link_editable != index}
    {#if show_title}<b>Link: </b>{/if}
    {#if item?.link}
        <a href={item?.link} target="_blank">
            {#if show_title}{item?.link}{:else}<img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" />{/if}
        </a>
    {/if}
{:else}
    {#if show_title}<b>Link: </b>{/if}
    {#if item?.link_id}
        <form on:submit|preventDefault={(e) => updateLink(item?.link_id)}>
            <input bind:value={new_link} />
        </form>
    {:else}
        <form on:submit|preventDefault={(e) => addLink(item?.box_id)}>
            <input bind:value={new_link} />
        </form>
    {/if}
{/if}
</svelte:element>
