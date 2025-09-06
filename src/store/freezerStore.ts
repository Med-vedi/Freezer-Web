import { create } from 'zustand';
import { supabase } from '../supabase/supabaseClient';
import { Freezer, Shelf, CreateFreezerData, UpdateFreezerData, CreateShelfData } from '../types/freezer';

interface FreezerState {
    freezers: Freezer[];
    currentFreezer: Freezer | null;
    shelves: Shelf[];
    loading: boolean;
    error: string | null;

    // Freezer actions
    fetchFreezers: () => Promise<void>;
    createFreezer: (data: CreateFreezerData) => Promise<{ error: any }>;
    updateFreezer: (id: string, data: UpdateFreezerData) => Promise<{ error: any }>;
    deleteFreezer: (id: string) => Promise<{ error: any }>;
    setCurrentFreezer: (freezer: Freezer | null) => void;

    // Shelf actions
    fetchShelves: (freezerId: string) => Promise<void>;
    createShelf: (data: CreateShelfData) => Promise<{ error: any }>;
    updateShelfCount: (freezerId: string, count: number) => Promise<{ error: any }>;
    deleteShelf: (id: string) => Promise<{ error: any }>;

    // Realtime subscriptions
    subscribeToFreezers: () => Promise<() => void>;
    subscribeToShelves: (freezerId: string) => () => void;
}

export const useFreezerStore = create<FreezerState>((set, get) => ({
    freezers: [],
    currentFreezer: null,
    shelves: [],
    loading: false,
    error: null,

    fetchFreezers: async () => {
        set({ loading: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('freezers')
                .select(`
          *,
          shelves (
            id,
            index_in_freezer,
            name,
            created_at
          )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            set({ freezers: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching freezers:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },

    createFreezer: async (data: CreateFreezerData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { error: 'Not authenticated' };

            const { data: freezer, error: freezerError } = await supabase
                .from('freezers')
                .insert({
                    user_id: user.id,
                    name: data.name,
                })
                .select()
                .single();

            if (freezerError) throw freezerError;

            // Create default 7 shelves
            const shelvesData = Array.from({ length: 7 }, (_, i) => ({
                freezer_id: freezer.id,
                index_in_freezer: i + 1,
                name: `Shelf ${i + 1}`,
            }));

            const { error: shelvesError } = await supabase
                .from('shelves')
                .insert(shelvesData);

            if (shelvesError) throw shelvesError;

            // Refresh freezers
            await get().fetchFreezers();

            return { error: null };
        } catch (error) {
            console.error('Error creating freezer:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    },

    updateFreezer: async (id: string, data: UpdateFreezerData) => {
        try {
            const { error } = await supabase
                .from('freezers')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Refresh freezers
            await get().fetchFreezers();

            return { error: null };
        } catch (error) {
            console.error('Error updating freezer:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    },

    deleteFreezer: async (id: string) => {
        try {
            const { error } = await supabase
                .from('freezers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Refresh freezers
            await get().fetchFreezers();

            return { error: null };
        } catch (error) {
            console.error('Error deleting freezer:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    },

    setCurrentFreezer: (freezer: Freezer | null) => {
        set({ currentFreezer: freezer });
        if (freezer) {
            get().fetchShelves(freezer.id);
        }
    },

    fetchShelves: async (freezerId: string) => {
        set({ loading: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                set({ error: 'User not authenticated', loading: false });
                return;
            }

            // Сначала проверяем, что морозильная камера принадлежит пользователю
            const { data: freezer, error: freezerError } = await supabase
                .from('freezers')
                .select('id, user_id')
                .eq('id', freezerId)
                .eq('user_id', user.id)
                .single();

            if (freezerError || !freezer) {
                set({ error: 'Freezer not found or access denied', loading: false });
                return;
            }

            const { data, error } = await supabase
                .from('shelves')
                .select(`
          *,
          products (
            id,
            name,
            quantity,
            unit,
            expiry_date,
            notes
          )
        `)
                .eq('freezer_id', freezerId)
                .order('index_in_freezer', { ascending: true });

            if (error) throw error;

            set({ shelves: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching shelves:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },

    createShelf: async (data: CreateShelfData) => {
        try {
            const { error } = await supabase
                .from('shelves')
                .insert(data);

            if (error) throw error;

            // Refresh shelves
            await get().fetchShelves(data.freezer_id);

            return { error: null };
        } catch (error) {
            console.error('Error creating shelf:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    },

    updateShelfCount: async (freezerId: string, count: number) => {
        try {
            // Get current shelves
            const { data: currentShelves } = await supabase
                .from('shelves')
                .select('*')
                .eq('freezer_id', freezerId)
                .order('index_in_freezer', { ascending: true });

            const currentCount = currentShelves?.length || 0;

            if (count > currentCount) {
                // Add new shelves
                const newShelves = Array.from({ length: count - currentCount }, (_, i) => ({
                    freezer_id: freezerId,
                    index_in_freezer: currentCount + i + 1,
                    name: `Shelf ${currentCount + i + 1}`,
                }));

                const { error } = await supabase
                    .from('shelves')
                    .insert(newShelves);

                if (error) throw error;
            } else if (count < currentCount) {
                // Remove excess shelves (only if they're empty)
                const shelvesToRemove = currentShelves?.slice(count) || [];

                for (const shelf of shelvesToRemove) {
                    // Check if shelf has products
                    const { data: products } = await supabase
                        .from('products')
                        .select('id')
                        .eq('shelf_id', shelf.id)
                        .limit(1);

                    if (products && products.length > 0) {
                        throw new Error(`Cannot remove shelf ${shelf.name || shelf.index_in_freezer} - it contains products`);
                    }

                    const { error } = await supabase
                        .from('shelves')
                        .delete()
                        .eq('id', shelf.id);

                    if (error) throw error;
                }
            }

            // Refresh shelves
            await get().fetchShelves(freezerId);

            return { error: null };
        } catch (error) {
            console.error('Error updating shelf count:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    },

    deleteShelf: async (id: string) => {
        try {
            const { error } = await supabase
                .from('shelves')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Refresh shelves
            const { currentFreezer } = get();
            if (currentFreezer) {
                await get().fetchShelves(currentFreezer.id);
            }

            return { error: null };
        } catch (error) {
            console.error('Error deleting shelf:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    },

    subscribeToFreezers: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return () => { };

        const subscription = supabase
            .channel('freezers_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'freezers',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    get().fetchFreezers();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    },

    subscribeToShelves: (freezerId: string) => {
        const subscription = supabase
            .channel('shelves_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'shelves',
                    filter: `freezer_id=eq.${freezerId}`,
                },
                () => {
                    get().fetchShelves(freezerId);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    },
}));
