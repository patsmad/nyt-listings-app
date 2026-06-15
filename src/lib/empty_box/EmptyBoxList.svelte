<script>
import { writable, derived } from "svelte/store";
import { linkFilesData } from './empty_box.js';
import EmptyBoxTable from './EmptyBoxTable.svelte';

let availableTitles;

async function setAvailableTitles() {
    if (!availableTitles) {
        await fetch(import.meta.env.VITE_API_HOST + '/available_titles/', {credentials: 'include'})
            .then(response => response.json())
            .then(data => availableTitles = data)
    }
}

function startUp()  {
    fetch(import.meta.env.VITE_API_HOST + '/empty_boxes/', {credentials: 'include'})
        .then(response => response.json())
        .then(data => linkFilesData.set(data))
    setAvailableTitles();
}

startUp();
</script>

<main>
	<h2>Empty Boxes:</h2>
    <div class="card">
        <EmptyBoxTable availableTitles={availableTitles}/>
    </div>
</main>
