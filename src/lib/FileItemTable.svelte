<script>
export let file_items;
let display_table = false;
</script>

<table class="file-item-table">
    <tr>
        <th>ID</th>
        <th>X</th>
        <th>Y</th>
        <th>LINK</th>
    </tr>
    {#each $file_items as file_item}
        {#each file_item.boxes as item_box}
            {#each item_box.links as link}
            <tr>
                <td>{file_item.id}</td>
                <td>{file_item.x}</td>
                <td>{file_item.y}</td>
                <td><a href={link.link} target="_blank">{link.link}</a></td>
            </tr>
            {/each}
        {/each}
    {/each}
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
</style>
