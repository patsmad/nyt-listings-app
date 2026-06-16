<script>
import { writable, derived } from "svelte/store";
import { linkFilesData } from './empty_box.js';
import EmptyBoxTable from './EmptyBoxTable.svelte';
import { authFetch } from '../clerk/clerk.js';

let availableTitles;

async function setAvailableTitles() {
    if (!availableTitles) {
        await authFetch('/available_titles/')
            .then(response => response.json())
            .then(data => availableTitles = data)
    }
}

function startUp()  {
    authFetch('/empty_boxes/')
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
