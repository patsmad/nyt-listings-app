<script>
export let item;
export let index;
export let closeOut;
export let show_title;
export let availableTitles;
let filteredAvailableTitles = [];

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

const filterAvailableTitles = () => {
	let storageArr = []
	if (new_title) {
		availableTitles.forEach(availableTitle => {
			 if (availableTitle.title.toLowerCase().startsWith(new_title.toLowerCase())) {
				 storageArr = [...storageArr, availableTitle];
			 }
		});
	}
	filteredAvailableTitles = storageArr;
}

async function updateTitle(link_id) {
    if (new_title != old_title) {
        await fetch(import.meta.env.VITE_API_HOST + '/title/update/', {
            method: 'POST',
            credentials: 'include',
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
        await fetch(import.meta.env.VITE_API_HOST + '/title/add/', {
            method: 'POST',
            credentials: 'include',
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

async function addOrUpdateTitle(item, available_link) {
    if (available_link != '') {
        if (item.link === null || item.link == "") {
            await fetch(import.meta.env.VITE_API_HOST + '/link/add/', {
                method: 'POST',
                credentials: 'incldue',
                body: JSON.stringify({
                    'box_id': item.box_id,
                    'link': available_link,
                    'confirmed': true
                })
            })
        } else {
            await fetch(import.meta.env.VITE_API_HOST + '/link/update/', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    'id': item.link_id,
                    'link': available_link,
                    'confirmed': true
                })
            })
        }
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
            <input bind:value={new_title} on:input={filterAvailableTitles}/>
        </form>
    {:else}
        <form on:submit|preventDefault={(e) => addTitle(item?.box_id)}>
            <input bind:value={new_title} on:input={filterAvailableTitles}/>
        </form>
    {/if}
    {#if filteredAvailableTitles.length > 0}
        <div style="max-height: 200px; overflow-y: auto;">
        {#each filteredAvailableTitles as availableTitle}
            <ul on:dblclick={() => addOrUpdateTitle(item, availableTitle.link)}>{availableTitle.search_str}</ul>
        {/each}
        </div>
    {/if}
{/if}
</svelte:element>
