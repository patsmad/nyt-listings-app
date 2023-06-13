<script>
import imdbLogo from '../../assets/IMDb_Logo_Square_Gold.png'
import { derived } from 'svelte/store'
import { linkFiles } from './link.js';

let asc = true;
let active = 'id';
let linkFilesList = derived(linkFiles, linkFiles => linkFiles.link_files??[]);
function sortColumnFunction(fnc, activeTH) {
    return () => {
        asc = !asc || active !== activeTH;
        linkFilesList = derived(
            linkFilesList,
            linkFilesList => linkFilesList
                .sort((itemA, itemB) => {
                    if (fnc(itemA) > fnc(itemB)) { return -1 + 2 * asc; }
                    if (fnc(itemA) < fnc(itemB)) { return 1 - 2 * asc; }
                    return 0;
                })
        );
        active = activeTH;
    }
}

function getImgSrc(linkFile) {
    return 'http://localhost:5000/img/?file_id=' + linkFile.file_id + '&api_key=' + import.meta.env.VITE_API_KEY +
        '&box=' + linkFile.left + ',' + linkFile.top + ',' + linkFile.width + ',' + linkFile.height
}
</script>

<table class="link-file-info">
    <tr>
        <td><a href={$linkFiles?.link_info?.link} target="_blank"><img src={imdbLogo} class="imdb-logo" alt="IMDb Logo" /></a></td>
        <td>{$linkFiles?.link_info?.title}</td>
        <td>{$linkFiles?.link_info?.year}</td>
        <td>{$linkFiles?.link_info?.rating}</td>
        <td>{$linkFiles?.link_info?.votes}</td>
    </tr>
</table>

<table class="link-file-table">
    <thead>
        <tr>
            <th class="isSortable {active === 'id' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.id, 'id')}>ID</th>
            <th class="isSortable {active === 'file' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.file, 'file')}>File</th>
            <th>Snippet</th>
            <th class="isSortable {active === 'confirmed' ? 'isActive' : ''} {asc ? 'asc' : 'desc'}" on:click={sortColumnFunction(linkFile => linkFile.confirmed, 'confirmed')}>Confirmed</th>
        </tr>
    </thead>
    <tbody>
    {#if $linkFilesList}
        {#each $linkFilesList as linkFile}
        <tr>
            <td>{linkFile.link_id}</td>
            <td>{linkFile.file}</td>
            <td style="max-width: 400px; height: {linkFile.scale(400) * linkFile.height}px">
                {#if linkFile.height}
                <img src={getImgSrc(linkFile)} style="
                    width: {linkFile.width}px;
                    height: {linkFile.height}px;
                    scale: {linkFile.scale(400)};
                    translate: -{linkFile.translation(400)}px 0px;
                " alt="Snippet for {linkFile.title} ({linkFile.file})"/>
                {/if}
            </td>
            <td>{linkFile.confirmed}</td>
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

.isSortable {
    cursor: pointer;
}
.isActive.asc:after {
    content: "▼";
    padding-left: 5px;
}
.isActive.desc:after {
    content: "▲";
    padding-left: 5px;
}

.imdb-logo {
    height: 32px;
}
</style>
