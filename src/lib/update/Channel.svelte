<script>

export let item;
export let index;
export let closeOut;
export let show_title;

let tag = show_title? "div" : "td";

let channel_editable;
let new_channel;
let old_channel;
resetChannel();

function resetChannel() {
    channel_editable = -1;
    new_channel = '';
    old_channel = '';
}

function makeChannelEditable(channel, index) {
    return () => {
        channel_editable = index;
        new_channel = channel;
        old_channel = channel;
    }
}

async function updateChannel(box_id) {
    if (new_channel != old_channel) {
        await fetch('http://localhost:5000/channel/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': box_id,
                'channel': new_channel
            })
        })
        await closeOut();
    }
    resetChannel();
}

</script>

<svelte:element this={tag} on:dblclick={makeChannelEditable(item?.channel, index)}>
    {#if show_title}
        <b>Channel: </b>
    {/if}
    {#if channel_editable != index}
        {item?.channel}
    {:else}
        <form on:submit|preventDefault={ (e) => updateChannel(item?.box_id) }>
            <input id="channel_update" bind:value={new_channel} />
        </form>
    {/if}
</svelte:element>

<style>

td {
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
}

</style>
