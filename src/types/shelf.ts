export interface Shelf {
    id: string;
    freezer_id: string;
    index_in_freezer: number;
    name?: string;
    created_at: string;
    products?: any[];
}

export interface CreateShelfData {
    freezer_id: string;
    index_in_freezer: number;
    name?: string;
}

export interface UpdateShelfData {
    name?: string;
}

export interface ShelfStats {
    totalProducts: number;
    totalQuantity: number;
    expiringSoon: number;
    expired: number;
}

// Re-export Product type for convenience
export type { Product } from './product';
