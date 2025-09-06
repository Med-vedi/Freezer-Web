import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabaseClient';

interface AuthState {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!error && data.user) {
            set({ user: data.user, loading: false });
        }

        return { error };
    },

    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (!error && data.user) {
            set({ user: data.user, loading: false });
        }

        return { error };
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, loading: false });
    },

    initialize: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({ user: session?.user ?? null, loading: false });
        } catch (error) {
            console.error('Error initializing auth:', error);
            set({ loading: false });
        }
    },
}));

// Initialize auth on app start
useAuthStore.getState().initialize();

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
    useAuthStore.setState({
        user: session?.user ?? null,
        loading: false,
    });
});
