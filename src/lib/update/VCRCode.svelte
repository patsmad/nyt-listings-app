<script>

export let item;
export let index;
export let closeOut;
export let show_title;

let tag = show_title? "div" : "td";

let vcr_code_editable;
let new_vcr_code;
let old_vcr_code;
resetVCRCode();

function resetVCRCode() {
    vcr_code_editable = -1;
    new_vcr_code = '';
    old_vcr_code = '';
}

function makeVCRCodeEditable(vcr_code, index) {
    return () => {
        vcr_code_editable = index;
        new_vcr_code = vcr_code;
        old_vcr_code = vcr_code;
    }
}

async function updateVCRCode(box_id, file_date) {
    let date = new Date(file_date)
    date = new Date(date.toLocaleString('en-US', {timeZone: 'Greenwich'}));
    if (new_vcr_code != old_vcr_code) {
        await fetch('http://localhost:5000/vcr_code/update?api_key=' + import.meta.env.VITE_API_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'id': box_id,
                'year': date.getFullYear(),
                'month': date.getMonth() + 1,
                'day': date.getDate(),
                'vcr_code': new_vcr_code
            })
        })
        await closeOut();
    }
    resetVCRCode();
}

</script>

<svelte:element this={tag}  on:dblclick={makeVCRCodeEditable(item?.vcr_code, index)}>
    {#if show_title}
        <b>VCR Code: </b>
    {/if}
    {#if vcr_code_editable != index}
        {item?.vcr_code}
    {:else}
        <form on:submit|preventDefault={(e) => updateVCRCode(item?.box_id, item?.file_date)}>
            <input id="vcr_code_update" bind:value={new_vcr_code} />
        </form>
    {/if}
</svelte:element>
