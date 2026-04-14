import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setToken: (token) => {
        try {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        } catch (e) {
            // ignore localStorage errors in SSR
        }
        set({ token, isAuthenticated: !!token });
    },
    logout: () => {
        try {
            localStorage.removeItem('token');
        } catch (e) {}
        set({ user: null, token: null, isAuthenticated: false });
    },

    initialize: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            set({ token, isAuthenticated: true });

            // Try to fetch the current user; if it fails, clear token
            try {
                const res = await authAPI.getMe();
                const user = res.data;
                set({ user });
            } catch (err) {
                // invalid token or expired
                try { localStorage.removeItem('token'); } catch (e) {}
                set({ user: null, token: null, isAuthenticated: false });
            }
        } catch (e) {
            // ignore
        }
    },
}));

export const usePikaStore = create((set) => ({
    isListening: false,
    currentQuery: '',
    response:null,
    briefing: null,
    connectionPlatforms:[],

    setListening: (isListening) => set({isListening}),
    setCurrentQuery: (query) => set({ currentQuery: query}),
    setResponse: (response) => set({response}),
    setBriefing: (briefing) => set({briefing}),
    setConnectedPlatform: (platform) => set({ connectedPlatform: platform}),

    resetCOnversation: () => set({
        currentQuery: '',
        response: null
    }),
}));

export const useSocialStore = create((set) => ({
    accounts: [],
    activities: [],
    dms: [],
    unreadCount: 0,

    setAccounts: (accounts) => set({accounts}),
    setActivities: (activities) => set({activities}),
    setDMs: (dms) => {
        const unreadCount = dms.reduce((sum, dm) => sum + dm.unread_count, 0);
        set({ dms, unreadCount});
    },

    addAccount: (account) => set((state) => ({
        account: [...state.accounts, account]
    })),

    removeAccount: (platform) => set((set) => ({
        accounts: state.accounts.filter(acc => acc.platform !== platform)
    })),
}));