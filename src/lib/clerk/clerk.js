import { writable, derived, get } from 'svelte/store';

export const clerk = writable(false);

export async function authFetch(fnc, options = {}) {
    const clerkInstance = get(clerk);
    const token = await clerkInstance.session.getToken();
    return fetch(import.meta.env.VITE_API_HOST + fnc, {
        ...options,
        headers: { Authorization: `Bearer ${token}` }
    });
}
