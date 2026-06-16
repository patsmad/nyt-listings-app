<script>
    import { onMount } from 'svelte';
    import { authFetch } from './clerk.js';

    export let src = '';
    export let alt = '';
    export let thisElement = null;

    let objectUrl = '';

    onMount(async () => {
        const response = await authFetch(src);
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    });
</script>

{#if objectUrl}
    <img bind:this={thisElement} src={objectUrl} {alt} on:load on:dblclick {...$$restProps} />
{/if}
