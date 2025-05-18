<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { userStore } from '$lib/stores/userStore';

    export let user: {
        id: string;
        name: string;
        hearts: number;
        isDead: boolean;
    };

    let scaleHover = true;
    let isHovering = false;
    let showContextMenu = false;
    let contextMenuX = 0;
    let contextMenuY = 0;

    function handleRemoveHeart() {
        userStore.removeHeart(user.id);
    }

    function handleContextMenu(event: MouseEvent) {
        event.preventDefault();
        contextMenuX = event.clientX;
        contextMenuY = event.clientY;
        showContextMenu = true;
    }

    function handleRevive() {
        userStore.reviveUser(user.id);
        showContextMenu = false;
    }

    function handleRemove() {
        userStore.removeUser(user.id);
        showContextMenu = false;
    }

    function handleClickOutside() {
        showContextMenu = false;
    }

    function heartTransition(node: Element, params: { delay: number }) {
        return {
            delay: params.delay,
            duration: 600,
            easing: cubicOut,
            css: (t: number) => {
                const y = (1 - t) * 30;
                const scale = 0.5 + t * 0.5;
                const rotate = (1 - t) * 20;
                return `
                    transform: translateY(${y}px) scale(${scale}) rotate(${rotate}deg);
                    opacity: ${t};
                `;
            }
        };
    }

    function deathTransition(node: Element) {
        return {
            duration: 1000,
            easing: cubicOut,
            css: (t: number) => {
                const scale = 1 + (1 - t) * 0.3;
                const rotate = (1 - t) * 15;
                const y = (1 - t) * 10;
                return `
                    transform: scale(${scale}) rotate(${rotate}deg) translateY(${y}px);
                    opacity: ${t};
                `;
            }
        };
    }

    function cardTransition(node: Element) {
        return {
            duration: 800,
            easing: cubicOut,
            css: (t: number) => {
                const y = (1 - t) * 40;
                const scale = 0.9 + t * 0.1;
                return `
                    transform: translateY(${y}px) scale(${scale});
                    opacity: ${t};
                `;
            }
        };
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div 
    class="user-card"
    class:dead={user.isDead}
    class:scale-hover={scaleHover}
    class:hovering={isHovering}
    class:last-heart={user.hearts === 1}
    on:mouseenter={() => isHovering = true}
    on:mouseleave={() => isHovering = false}
    on:contextmenu={handleContextMenu}
    in:cardTransition
    role="button"
    tabindex="0"
    aria-label="User card for {user.name}"
>
    <div class="user-header">
        <h2>{user.name}</h2>
        {#if user.isDead}
            <div 
                class="skull-icon" 
                in:deathTransition
            >
                💀
            </div>
        {/if}
    </div>
    <div class="hearts-container">
        {#each Array(user.hearts) as _, i}
            <button 
                class="heart-button"
                on:click={handleRemoveHeart}
                on:keydown={(e) => e.key === 'Enter' && handleRemoveHeart()}
                disabled={user.isDead}
                aria-label="Remove life"
            >
                <span 
                    class="heart"
                    in:heartTransition={{ delay: i * 100 }}
                >
                    ❤️
                </span>
            </button>
        {/each}
    </div>
    {#if user.isDead}
        <div class="death-overlay" in:fade={{ duration: 800, delay: 300 }}>
            <span class="death-text">Eliminated</span>
        </div>
    {/if}
    <div class="card-shine"></div>
</div>

{#if showContextMenu}
    <div 
        class="context-menu"
        style="left: {contextMenuX}px; top: {contextMenuY}px"
        in:scale={{ duration: 200, start: 0.95, easing: cubicOut }}
        out:fade={{ duration: 150 }}
    >
        {#if user.isDead}
            <button class="context-menu-item" on:click={handleRevive}>
                <span class="icon">🔄</span>
                Rejoin Quiz
            </button>
        {/if}
        <button class="context-menu-item" on:click={handleRemove}>
            <span class="icon">🚪</span>
            Leave Quiz
        </button>
    </div>
{/if}

<style>
    .user-card {
        background: white;
        border-radius: clamp(12px, 2vw, 16px);
        padding: clamp(1rem, 3vw, 1.5rem);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        cursor: context-menu;
        will-change: transform;
        isolation: isolate;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    }

    .card-shine {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 45%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.1) 55%,
            transparent 100%
        );
        transform: translateX(-100%);
        transition: transform 0.6s ease;
        pointer-events: none;
        z-index: 1;
    }

    .user-card:hovering .card-shine {
        transform: translateX(100%);
    }

    .user-card.dead {
        text-decoration: line-through;
        background: #f5f5f5;
        opacity: 0.7;
        transform: scale(0.98);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .user-card.dead h2 {
        text-decoration: line-through;
        color: #666;
        transition: color 0.3s ease;
    }

    .user-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: clamp(0.75rem, 2vw, 1rem);
        gap: 0.5rem;
    }

    h2 {
        margin: 0;
        color: #2c3e50;
        font-size: clamp(1.2rem, 3vw, 1.5rem);
        transition: all 0.3s ease;
        word-break: break-word;
        hyphens: auto;
    }

    .skull-icon {
        font-size: clamp(1.5rem, 4vw, 2rem);
        animation: float 3s ease-in-out infinite;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        will-change: transform;
        flex-shrink: 0;
    }

    .hearts-container {
        display: flex;
        gap: clamp(0.25rem, 1vw, 0.5rem);
        flex-wrap: wrap;
        position: relative;
        z-index: 1;
    }

    .heart-button {
        background: none;
        border: none;
        padding: clamp(0.25rem, 1vw, 0.5rem);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
        position: relative;
        overflow: hidden;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    }

    .heart-button::after {
        content: '';
        position: absolute;
        inset: -4px;
        background: radial-gradient(circle at center, rgba(255, 0, 0, 0.2) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .heart-button:hover:not(:disabled)::after,
    .heart-button:focus-visible::after {
        opacity: 1;
    }

    .heart-button:hover:not(:disabled) .heart,
    .heart-button:focus-visible .heart {
        transform: scale(1.2) rotate(5deg);
        filter: brightness(1.2) drop-shadow(0 0 4px rgba(255, 0, 0, 0.3));
    }

    .heart {
        font-size: clamp(1.2rem, 3vw, 1.5rem);
        display: inline-block;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
        position: relative;
        z-index: 1;
    }

    .death-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        transition: all 0.5s ease;
    }

    .death-text {
        font-size: clamp(1.5rem, 4vw, 2rem);
        font-weight: bold;
        color: #666;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: rotate(-10deg);
        animation: pulse 2s ease-in-out infinite;
    }

    .context-menu {
        position: fixed;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        padding: 0.5rem;
        min-width: min(180px, 80vw);
        max-width: 90vw;
        z-index: 1000;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        will-change: transform;
        transform-origin: top left;
    }

    .context-menu-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
        border: none;
        background: none;
        color: #2c3e50;
        font-size: clamp(0.85rem, 2vw, 0.95rem);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    }

    .context-menu-item::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    .context-menu-item:hover::before,
    .context-menu-item:focus-visible::before {
        transform: translateX(100%);
    }

    .context-menu-item:hover,
    .context-menu-item:focus-visible {
        background: rgba(44, 62, 80, 0.1);
        transform: translateX(4px);
    }

    .context-menu-item .icon {
        font-size: clamp(1rem, 2.5vw, 1.2rem);
        transition: transform 0.3s ease;
        position: relative;
        z-index: 1;
        flex-shrink: 0;
    }

    .context-menu-item:hover .icon,
    .context-menu-item:focus-visible .icon {
        transform: scale(1.2) rotate(5deg);
    }

    @media (hover: none) {
        .user-card:hovering .card-shine {
            transform: none;
        }

        .heart-button:hover:not(:disabled) .heart,
        .heart-button:focus-visible .heart {
            transform: none;
            filter: none;
        }

        .context-menu-item:hover,
        .context-menu-item:focus-visible {
            transform: none;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .user-card,
        .heart-button,
        .heart,
        .context-menu-item,
        .context-menu-item .icon,
        .card-shine,
        .death-text,
        .skull-icon {
            transition: none !important;
            animation: none !important;
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-5px) rotate(5deg);
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: rotate(-10deg) scale(1);
            opacity: 0.8;
        }
        50% {
            transform: rotate(-10deg) scale(1.1);
            opacity: 1;
        }
    }

    .user-card.last-heart {
        animation: lastHeartPulse 2s ease-in-out infinite;
        position: relative;
    }

    .user-card.last-heart::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(45deg, #ff4444, #ff0000);
        -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: borderPulse 2s ease-in-out infinite;
    }

    @keyframes lastHeartPulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        50% {
            transform: scale(1.02);
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.2);
        }
    }

    @keyframes borderPulse {
        0%, 100% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
    }
</style> 