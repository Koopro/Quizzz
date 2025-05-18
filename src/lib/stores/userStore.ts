import { writable, get } from 'svelte/store';

export interface User {
    id: string;
    name: string;
    hearts: number;
    isDead: boolean;
}

// Create separate stores for users and display mode
const users = writable<User[]>([]);
const displayMode = writable<boolean>(false);
const defaultHearts = writable<number>(3);

function createUserStore() {
    return {
        subscribe: users.subscribe,
        displayMode: {
            subscribe: displayMode.subscribe,
            toggle: () => displayMode.update(mode => !mode)
        },
        defaultHearts: {
            subscribe: defaultHearts.subscribe,
            set: (value: number) => defaultHearts.set(value)
        },
        addUser: (name: string) => {
            users.update(currentUsers => [...currentUsers, {
                id: crypto.randomUUID(),
                name,
                hearts: get(defaultHearts),
                isDead: false
            }]);
        },
        removeUser: (id: string) => {
            users.update(currentUsers => currentUsers.filter(user => user.id !== id));
        },
        reviveUser: (id: string) => {
            users.update(currentUsers => currentUsers.map(user => 
                user.id === id ? { 
                    ...user, 
                    hearts: get(defaultHearts),
                    isDead: false 
                } : user
            ));
        },
        addHeart: (id: string) => {
            users.update(currentUsers => currentUsers.map(user => 
                user.id === id ? { ...user, hearts: user.hearts + 1 } : user
            ));
        },
        removeHeart: (id: string) => {
            users.update(currentUsers => currentUsers.map(user => {
                if (user.id === id) {
                    const newHearts = Math.max(0, user.hearts - 1);
                    return { 
                        ...user, 
                        hearts: newHearts,
                        isDead: newHearts === 0
                    };
                }
                return user;
            }));
        }
    };
}

export const userStore = createUserStore(); 