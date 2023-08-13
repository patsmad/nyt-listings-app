<script>

export let item;
export let index;
export let closeOut;
export let show_title;

let item_deletable;
resetDelete();

function resetDelete() {
    item_deletable = -1;
}

function makeItemDeletable(index) {
    return () => {
        item_deletable = index;
    }
}

async function deleteItem(item_id) {
    await fetch('http://localhost:5000/item/delete?api_key=' + import.meta.env.VITE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
            'id': item_id
        })
    })
    await closeOut();
    resetDelete();
}

</script>

{#if show_title}
    {#if item_deletable != index}
        <button class="x" on:click={makeItemDeletable(index)}>Delete Item</button>
    {:else}
        <div>Are you sure?</div>
        <span>
            <button class="x" on:click={deleteItem(item.item_id)} style="background-color: #777777;">Yes</button>
            <button class="x" on:click={() => item_deletable= false}>No</button>
        </span>
    {/if}
{:else}
    <td on:dblclick={makeItemDeletable(index)}>
        {#if item_deletable != index}
            {item.item_id}
        {:else}
            <button class="x" on:click={deleteItem(item.item_id)}>X</button>
        {/if}
    </td>
{/if}

<style>

td {
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
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

</style>
