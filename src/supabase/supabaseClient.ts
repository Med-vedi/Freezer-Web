import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Database types
export interface Database {
    public: {
        Tables: {
            freezers: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    created_at?: string;
                };
            };
            shelves: {
                Row: {
                    id: string;
                    freezer_id: string;
                    index_in_freezer: number;
                    name: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    freezer_id: string;
                    index_in_freezer: number;
                    name?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    freezer_id?: string;
                    index_in_freezer?: number;
                    name?: string | null;
                    created_at?: string;
                };
            };
            product_catalog: {
                Row: {
                    id: string;
                    name: string;
                    category: string | null;
                    default_unit: string | null;
                    description: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    category?: string | null;
                    default_unit?: string | null;
                    description?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    category?: string | null;
                    default_unit?: string | null;
                    description?: string | null;
                    created_at?: string;
                };
            };
            products: {
                Row: {
                    id: string;
                    user_id: string;
                    catalog_id: string | null;
                    name: string;
                    quantity: number;
                    unit: string;
                    shelf_id: string | null;
                    freezer_id: string | null;
                    barcode: string | null;
                    received_at: string;
                    expiry_date: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    catalog_id?: string | null;
                    name: string;
                    quantity?: number;
                    unit?: string;
                    shelf_id?: string | null;
                    freezer_id?: string | null;
                    barcode?: string | null;
                    received_at?: string;
                    expiry_date?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    catalog_id?: string | null;
                    name?: string;
                    quantity?: number;
                    unit?: string;
                    shelf_id?: string | null;
                    freezer_id?: string | null;
                    barcode?: string | null;
                    received_at?: string;
                    expiry_date?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}
