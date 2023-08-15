<script>

export let item;
export let index;
export let closeOut;
export let show_title;

let tag = show_title? "div" : "td";

let time_editable;
let new_time;
let old_time;
resetTime();

function resetTime() {
    time_editable = -1;
    new_time = '';
    old_time = '';
}

function makeTimeEditable(time, file_date, index) {
    return () => {
        time_editable = index;
        if (time != null) {
            new_time = time;
            old_time = time;
        } else {
            new_time = file_date;
            old_time = time;
        }
    }
}

async function updateTime(box_id) {
    if (new_time != old_time) {
        let date = new Date(new_time)
        date = new Date(date.toLocaleString('en-US', {timeZone: 'Greenwich'}));
        await fetch('http://localhost:5000/time/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': box_id,
                'year': date.getFullYear(),
                'month': date.getMonth() + 1,
                'day': date.getDate(),
                'hour': date.getHours(),
                'minute': date.getMinutes()
            })
        })
        await closeOut();
    }
    resetTime();
}

</script>

<svelte:element this={tag} on:dblclick={ makeTimeEditable(item?.time, item?.file_date, index) }>
    {#if show_title}
        <b>Time: </b>
    {/if}
    {#if time_editable != index}
        {item?.time}
    {:else}
        <form on:submit|preventDefault={ (e) => updateTime(item?.box_id) }>
            <input id="time_update" bind:value={new_time} />
        </form>
    {/if}
</svelte:element>
