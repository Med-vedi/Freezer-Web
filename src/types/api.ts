// API Response Types
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

// Supabase Product with Relations
export interface SupabaseProductWithRelations {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    barcode?: string;
    expiry_date?: string;
    notes?: string;
    user_id: string;
    shelf_id: string;
    freezer_id: string;
    catalog_id?: string;
    added_by_user_id?: string;
    added_at?: string;
    created_at: string;
    updated_at: string;
    product_catalog: {
        id: string;
        name_en: string;
        name_ru?: string;
        name_it?: string;
        category_en: string;
        category_ru?: string;
        category_it?: string;
        description_en?: string;
        description_ru?: string;
        description_it?: string;
        emoji?: string;
        is_popular?: boolean;
        is_seasonal?: boolean;
        default_unit: string;
    };
    shelves: {
        id: string;
        name?: string;
        index_in_freezer: number;
    };
    freezers: {
        id: string;
        name: string;
    };
}

// Catalog Product from Supabase
export interface SupabaseCatalogProduct {
    id: string;
    name_en: string;
    name_ru?: string;
    name_it?: string;
    category_en: string;
    category_ru?: string;
    category_it?: string;
    description_en?: string;
    description_ru?: string;
    description_it?: string;
    emoji?: string;
    is_popular?: boolean;
    is_seasonal?: boolean;
    default_unit: string;
    created_at: string;
    updated_at: string;
}

// Error Types
export interface ApiError {
    message: string;
    code?: string;
    details?: string;
}

// Query Parameters
export interface ProductQueryParams {
    userId: string;
    language: string;
    addedByUser?: boolean;
}

export interface CatalogQueryParams {
    language: string;
    search?: string;
    category?: string;
    sortBy?: 'name' | 'category' | 'popular';
}
