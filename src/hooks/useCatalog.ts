import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { LocalizedProductCatalog } from '../types/product';
import { SupabaseCatalogProduct, ApiError } from '../types/api';

interface UseCatalogParams {
    language?: string;
}

interface UseCatalogReturn {
    catalog: LocalizedProductCatalog[];
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
    searchProducts: (query: string) => Promise<LocalizedProductCatalog[]>;
}

export function useCatalog({ language: _language }: UseCatalogParams): UseCatalogReturn {
    const [catalog, setCatalog] = useState<LocalizedProductCatalog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const transformCatalogProduct = useCallback((product: SupabaseCatalogProduct): LocalizedProductCatalog => {
        return {
            id: product.id,
            name_en: product.name_en,
            name_ru: product.name_ru,
            name_it: product.name_it,
            category_en: product.category_en,
            category_ru: product.category_ru,
            category_it: product.category_it,
            description_en: product.description_en,
            description_ru: product.description_ru,
            description_it: product.description_it,
            default_unit: product.default_unit,
            emoji: product.emoji,
            is_popular: product.is_popular,
            is_seasonal: product.is_seasonal,
        };
    }, []);

    const fetchCatalog = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: queryError } = await supabase
                .from('product_catalog')
                .select('*')
                .order('name_en');

            if (queryError) {
                throw new Error(`Failed to fetch catalog: ${queryError.message}`);
            }

            if (!data || data.length === 0) {
                setCatalog([]);
                return;
            }

            const transformedCatalog = data.map(transformCatalogProduct);
            setCatalog(transformedCatalog);
        } catch (err) {
            const apiError: ApiError = {
                message: err instanceof Error ? err.message : 'Unknown error occurred',
                code: 'FETCH_CATALOG_ERROR',
            };
            setError(apiError);
            console.error('Error fetching catalog:', err);
        } finally {
            setLoading(false);
        }
    }, [transformCatalogProduct]);

    const searchProducts = useCallback(async (query: string): Promise<LocalizedProductCatalog[]> => {
        if (!query.trim()) {
            return catalog;
        }

        try {
            const { data, error: queryError } = await supabase
                .from('product_catalog')
                .select('*')
                .or(`name_en.ilike.%${query}%,name_ru.ilike.%${query}%,name_it.ilike.%${query}%`)
                .order('name_en')
                .limit(20);

            if (queryError) {
                throw new Error(`Failed to search products: ${queryError.message}`);
            }

            if (!data) {
                return [];
            }

            return data.map(transformCatalogProduct);
        } catch (err) {
            console.error('Error searching products:', err);
            return [];
        }
    }, [catalog, transformCatalogProduct]);

    // Автоматически загружаем каталог при инициализации
    useEffect(() => {
        fetchCatalog();
    }, [fetchCatalog]);

    return {
        catalog,
        loading,
        error,
        refetch: fetchCatalog,
        searchProducts,
    };
}
