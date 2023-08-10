<script>

export let item;
export let index;
export let closeOut;
export let show_title;

let tag = show_title? "div" : "td";

let duration_editable;
let new_duration;
let old_duration;
resetDuration();

function resetDuration() {
    duration_editable = -1;
    new_duration = '';
    old_duration = '';
}

function makeDurationEditable(duration, index) {
    return () => {
        duration_editable = index;
        new_duration = duration;
        old_duration = duration;
    }
}

async function updateDuration(box_id) {
    if (new_duration != old_duration) {
        await fetch('http://localhost:5000/duration/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': box_id,
                'duration': new_duration
            })
        })
        await closeOut();
    }
    resetDuration();
}

</script>

<svelte:element this={tag} on:dblclick={makeDurationEditable(item?.duration_minutes, index)}>
    {#if show_title}
        <b>Duration: </b>
    {/if}
    {#if duration_editable != index}
        {item?.duration_minutes}
    {:else}
        <form on:submit|preventDefault={(e) => updateDuration(item?.box_id)}>
            <input id="duration_update" bind:value={new_duration} />
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
