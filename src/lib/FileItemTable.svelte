<script>
import { derived } from 'svelte/store'
import { annotatedFile, FileItem } from './model.js';

let displayTable = false;

let fileItems = derived(annotatedFile, annotatedFile => annotatedFile.items?.map(item => {
    let boxes = item.boxes.map(box => {
        let links = box.links.map(link => {
            return new FileItem(item.id, link.link, link.title, link.year, link.rating, link.votes)
        })
        return links.length > 0 ? links : [new FileItem(item.id, '', '', '', 0.0, 0)]
    })
    return boxes.length > 0 ? boxes : [new FileItem(item.id, '', '', '', 0.0, 0)]
}).flat(2))

let asc = true
function sortColumnFunction(fnc) {
    return () => {
        fileItems = derived(
            fileItems,
            fileItems => fileItems
                .sort((itemA, itemB) => {
                    if (fnc(itemA) > fnc(itemB)) { return -1 + 2 * asc; }
                    if (fnc(itemA) < fnc(itemB)) { return 1 - 2 * asc; }
                    return 0;
                })
        );
        asc = !asc;
    }
}
</script>

<table class="file-item-table">
    <thead>
        <tr>
            <th on:click={sortColumnFunction(item => item.id)}>ID</th>
            <th on:click={sortColumnFunction(item => item.title)}>Title</th>
            <th on:click={sortColumnFunction(item => item.year)}>Year</th>
            <th on:click={sortColumnFunction(item => item.rating)}>Rating</th>
            <th on:click={sortColumnFunction(item => item.votes)}>Votes</th>
            <th on:click={sortColumnFunction(item => item.link)}>Link</th>
        </tr>
    </thead>
    <tbody>
    {#if $fileItems}
        {#each $fileItems as fileItem}
        <tr>
            <td>{fileItem.id}</td>
            <td>{fileItem.title}</td>
            <td>{fileItem.year}</td>
            <td>{fileItem.rating}</td>
            <td>{fileItem.votes}</td>
            <td><a href={fileItem.link} target="_blank">{fileItem.link}</a></td>
        </tr>
        {/each}
    {/if}
    </tbody>
</table>

<style>
table {
    width: 100%;
}

th, td {
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
}

th {
    background-color: #117bb7aa;
}
</style>
