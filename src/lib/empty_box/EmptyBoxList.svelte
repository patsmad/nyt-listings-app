<script>
import { writable, derived } from "svelte/store";
import { linkFilesData } from './empty_box.js';
import EmptyBoxTable from './EmptyBoxTable.svelte';

function startUp()  {
    fetch('http://0.0.0.0:5000/empty_boxes/?api_key=' + import.meta.env.VITE_API_KEY)
        .then(response => response.json())
        .then(data => linkFilesData.set(data))
}

startUp();
</script>

<main>
	<h2>Empty Boxes:</h2>
    <div class="card">
        <EmptyBoxTable/>
    </div>
</main>
