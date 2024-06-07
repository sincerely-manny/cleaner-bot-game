declare global {
    interface WindowEventMap {
        'custom-event': CustomEvent<{ data: string }>;
    }
}
window.addEventListener('custom-event', (event) => {
    const { data } = event.detail;
});
