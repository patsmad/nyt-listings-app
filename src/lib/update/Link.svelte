<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'

export let item;
export let index;
export let closeOut;
export let show_title;

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

{#if link_editable != index}
    <td style="width: 400px; align: center;" on:dblclick={makeLinkEditable(item?.link, index)}>
    {#if show_title}
        <b>Link: </b>
        {#if item?.link}
            <a href={item?.link} target="_blank">
                {item?.link}
            </a>
        {/if}
    {:else}
        {#if item?.link}
            <a href={item.link} target="_blank" style="height: 32px; width: 32px;">
                <img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" />
            </a>
        {/if}
    {/if}
    </td>
{:else}
    <td style="width: 400px; align: center;">
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
    </td>
{/if}

<style>

.imdb-logo {
    height: 32px;
}

td {
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
}

</style>
