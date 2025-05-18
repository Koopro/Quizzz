<script lang="ts">
    import { userStore } from '$lib/stores/userStore';
    import UserCard from '$lib/components/UserCard.svelte';
    import { fade, fly } from 'svelte/transition';

    let newUserName = '';
    let scaleHover = true;
    let isDisplayMode = false;
    let defaultHearts = 3;

    // Subscribe to display mode changes
    userStore.displayMode.subscribe(value => {
        isDisplayMode = value;
    });

    // Subscribe to default hearts changes
    userStore.defaultHearts.subscribe(value => {
        defaultHearts = value;
    });

    function handleAddUser() {
        if (newUserName.trim()) {
            userStore.addUser(newUserName.trim());
            newUserName = '';
        }
    }

    function toggleDisplayMode() {
        userStore.displayMode.toggle();
    }

    function updateDefaultHearts() {
        userStore.defaultHearts.set(defaultHearts);
    }
</script>

{#if isDisplayMode}
    <main class="display-mode">
        <div class="users-grid">
            {#each $userStore as user (user.id)}
                <UserCard {user} />
            {/each}
        </div>
        <button 
            class="exit-display-mode"
            on:click={toggleDisplayMode}
            class:scale-hover={scaleHover}
        >
            Exit Display Mode
        </button>
    </main>
{:else}
    <main>
        <div class="container">
            <div 
                class="header"
                in:fly={{ y: -20, duration: 500 }}
            >
                <div class="title-section">
                    <h1>Quizzz</h1>
                    <p class="subtitle">Test your knowledge with style</p>
                </div>
                <button 
                    class="display-mode-toggle"
                    on:click={toggleDisplayMode}
                    class:scale-hover={scaleHover}
                >
                    Display Mode
                </button>
            </div>
            
            <div 
                class="settings-form"
                in:fly={{ y: 20, duration: 500, delay: 200 }}
            >
                <div class="setting-group">
                    <label for="default-hearts">Default Hearts:</label>
                    <input
                        type="number"
                        id="default-hearts"
                        bind:value={defaultHearts}
                        min="1"
                        max="10"
                        on:change={updateDefaultHearts}
                    />
                </div>
            </div>

            <div 
                class="add-user-form"
                in:fly={{ y: 20, duration: 500, delay: 300 }}
            >
                <input
                    type="text"
                    bind:value={newUserName}
                    placeholder="Enter user name"
                    on:keydown={(e) => e.key === 'Enter' && handleAddUser()}
                />
                <button 
                    on:click={handleAddUser}
                    class:scale-hover={scaleHover}
                    disabled={!newUserName.trim()}
                >
                    Add User
                </button>
            </div>

            <div 
                class="users-grid"
                in:fade={{ duration: 500, delay: 400 }}
            >
                {#each $userStore as user (user.id)}
                    <UserCard {user} />
                {/each}
            </div>
        </div>
    </main>
{/if}

<style>
    main {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    main::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        pointer-events: none;
    }

    .display-mode {
        min-height: 100vh;
        background: linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .display-mode::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        pointer-events: none;
    }

    .exit-display-mode {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 1rem 2rem;
        border-radius: 12px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .exit-display-mode:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
        padding: 0 1rem;
        position: relative;
        z-index: 1;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.5rem;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .header:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    }

    .title-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    h1 {
        color: #2c3e50;
        font-size: clamp(2rem, 5vw, 2.5rem);
        margin: 0;
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        color: #666;
        margin: 0;
        font-size: clamp(0.9rem, 2vw, 1.1rem);
        opacity: 0.8;
    }

    .settings-form {
        background: rgba(255, 255, 255, 0.95);
        padding: 1.5rem;
        border-radius: 20px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        margin-bottom: 1.5rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease;
    }

    .settings-form:hover {
        transform: translateY(-2px);
    }

    .setting-group {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .setting-group label {
        font-weight: bold;
        color: #2c3e50;
        min-width: 120px;
        opacity: 0.9;
    }

    .setting-group input[type="number"] {
        width: 80px;
        padding: 0.75rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        text-align: center;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.9);
    }

    .setting-group input[type="number"]:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        transform: translateY(-1px);
    }

    .display-mode-toggle {
        background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        font-size: 1rem;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .display-mode-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .add-user-form {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        justify-content: center;
        background: rgba(255, 255, 255, 0.95);
        padding: 1.5rem;
        border-radius: 20px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(10px);
        flex-wrap: wrap;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease;
    }

    .add-user-form:hover {
        transform: translateY(-2px);
    }

    input {
        padding: 0.75rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        width: min(300px, 100%);
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.9);
    }

    input:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        transform: translateY(-1px);
    }

    button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        font-size: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
        gap: 1.5rem;
        padding: 1rem;
        width: 100%;
        position: relative;
    }

    .scale-hover:hover {
        transform: scale(1.05);
    }

    .scale-hover:active {
        transform: scale(0.95);
    }

    @media (max-width: 768px) {
        main {
            padding: 1rem;
        }

        .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 1rem;
        }

        .add-user-form {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
        }

        .users-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .exit-display-mode {
            bottom: 1rem;
            right: 1rem;
            padding: 0.75rem 1.5rem;
        }
    }
</style>
