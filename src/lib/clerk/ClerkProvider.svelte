<script>
import { onMount } from 'svelte'
import { clerk } from './clerk.js'

let frontendApi = import.meta.env.VITE_CLERK_FRONTEND_API;
let pub_key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
let navigate;

onMount(()=>{
    const script = document.createElement('script');
    script.setAttribute('data-clerk-frontend-api', frontendApi);
    script.setAttribute('data-clerk-publishable-key', pub_key);
    script.async = true;
    script.src = `https://${frontendApi}/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
    script.addEventListener('load', function(){
        window.Clerk.load({ navigate : navigate || undefined }).then((e)=>{
            clerk.update(() => window.Clerk)
        })
    });
    document.body.appendChild(script);
});

</script>

<div style="display:none;">Clerk loader</div>
