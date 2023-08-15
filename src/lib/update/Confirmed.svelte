<script>

export let item;
export let index;
export let closeOut;

async function updateConfirmed(link_id) {
    await fetch('http://localhost:5000/link/update?api_key=' + import.meta.env.VITE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
            'id': link_id,
            'confirmed': !item.confirmed
        })
    })
    await closeOut();
}

</script>

<td>
    <input id="confirmed-{index}" type="checkbox" bind:checked={item.confirmed} on:click={updateConfirmed(item.link_id)}>
</td>
