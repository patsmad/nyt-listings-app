<script>
import { authFetch } from '../clerk/clerk.js';

export let item;
export let index;
export let closeOut;

async function updateConfirmed(link_id) {
    await authFetch('/link/update/', {
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
