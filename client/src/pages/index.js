import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    iser: null,
    token: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticates: !!user}),
    setToken: (token) => {
        localStorage,setItem('token', token);
        set({ token, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({user: null, token: null, isAuthenticated:false});
    },

    initialize: () => {
        const token = localStorage.getItem('token');
        if(token) {
            set({ token, isAuthenticates: true});
        }
    },
}));