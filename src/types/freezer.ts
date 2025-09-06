export interface Freezer {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    shelves?: Shelf[];
}

export interface Shelf {
    id: string;
    freezer_id: string;
    index_in_freezer: number;
    name?: string;
    created_at: string;
    products?: any[];
}

export interface CreateFreezerData {
    name: string;
}

export interface UpdateFreezerData {
    name?: string;
}

export interface CreateShelfData {
    freezer_id: string;
    index_in_freezer: number;
    name?: string;
}

export interface UpdateShelfData {
    name?: string;
}
