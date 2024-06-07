<script lang="ts">
    import { GameEvent } from '@lib/events';
    import { onMount } from 'svelte';
    let score = 0;

    function updateScore(event: CustomEvent) {
        // score = event.detail;
    }

    onMount(() => {
        window.addEventListener('scoreUpdate', updateScore);
        return () => {
            window.removeEventListener<GameEvent>('scoreUpdate', updateScore);
        };
    });
</script>

<div id="score">Score: {score}</div>

<style>
    #score {
        position: absolute;
        top: 16px;
        left: 16px;
        font-size: 32px;
        color: #fff;
    }
</style>
