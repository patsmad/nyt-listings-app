<script>
import { onDestroy, onMount } from 'svelte'
import { clerk } from './clerk.js'

let signInElement

let unsubscribe = ()=>{};

onMount(()=>{
    unsubscribe = clerk.subscribe(Clerk => {
        if (Clerk) {
            Clerk.mountSignIn(signInElement)
        }
    })
})
</script>

<div bind:this={signInElement}></div>
