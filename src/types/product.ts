export interface Product {
    id: string;
    user_id: string;
    catalog_id?: string;
    name: string;
    quantity: number;
    unit: string;
    shelf_id?: string;
    freezer_id?: string;
    barcode?: string;
    received_at: string;
    expiry_date?: string;
    notes?: string;
    added_by_user_id?: string;
    added_at?: string;
    created_at: string;
    updated_at: string;
    catalog?: ProductCatalog;
}

export interface ProductCatalog {
    id: string;
    name_en: string;
    name_ru: string;
    name_it: string;
    category_en: string;
    category_ru: string;
    category_it: string;
    default_unit: string;
    description_en?: string;
    description_ru?: string;
    description_it?: string;
    emoji?: string;
    is_popular?: boolean;
    is_seasonal?: boolean;
    created_at: string;
    updated_at: string;
}

export interface LocalizedProductCatalog {
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
    default_unit: string;
    emoji?: string;
    is_popular?: boolean;
    is_seasonal?: boolean;
}

export interface CreateProductData {
    catalog_id?: string;
    name: string;
    quantity: number;
    unit: string;
    shelf_id: string;
    freezer_id: string;
    barcode?: string;
    expiry_date?: string;
    notes?: string;
    added_by_user_id?: string;
    added_at?: string;
}

export interface UpdateProductData {
    name?: string;
    quantity?: number;
    unit?: string;
    shelf_id?: string;
    freezer_id?: string;
    barcode?: string;
    expiry_date?: string;
    notes?: string;
}

export interface ProductSearchFilters {
    name?: string;
    category?: string;
    freezer_id?: string;
    shelf_id?: string;
    expiry_date_from?: string;
    expiry_date_to?: string;
}

export type ExpiryStatus = 'good' | 'warning' | 'danger';

export interface ProductWithExpiry extends Product {
    expiryStatus: ExpiryStatus;
    daysUntilExpiry: number;
    shelf?: {
        id: string;
        name?: string;
        index_in_freezer: number;
        freezer_id: string;
    };
    freezer?: {
        id: string;
        name: string;
        user_id: string;
    };
}
