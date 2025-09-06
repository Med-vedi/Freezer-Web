import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { ProductWithExpiry } from '../types/product';
import { SupabaseProductWithRelations, ApiResponse, ApiError } from '../types/api';
import { getExpiryStatus, getDaysUntilExpiry } from '../utils/date';

interface UseProductsParams {
    userId: string;
    language: string;
    addedByUserOnly?: boolean;
}

interface UseProductsReturn {
    products: ProductWithExpiry[];
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
}

export function useProducts({ userId, language, addedByUserOnly = false }: UseProductsParams): UseProductsReturn {
    const [products, setProducts] = useState<ProductWithExpiry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const transformProduct = useCallback((product: SupabaseProductWithRelations): ProductWithExpiry => {
        return {
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            unit: product.unit,
            barcode: product.barcode,
            expiry_date: product.expiry_date,
            notes: product.notes,
            user_id: product.user_id,
            shelf_id: product.shelf_id,
            freezer_id: product.freezer_id,
            catalog_id: product.catalog_id,
            added_by_user_id: product.added_by_user_id,
            added_at: product.added_at,
            created_at: product.created_at,
            updated_at: product.updated_at,
            catalog: {
                id: product.product_catalog.id,
                name_en: product.product_catalog.name_en,
                name_ru: product.product_catalog.name_ru,
                name_it: product.product_catalog.name_it,
                category_en: product.product_catalog.category_en,
                category_ru: product.product_catalog.category_ru,
                category_it: product.product_catalog.category_it,
                description_en: product.product_catalog.description_en,
                description_ru: product.product_catalog.description_ru,
                description_it: product.product_catalog.description_it,
                emoji: product.product_catalog.emoji,
                is_popular: product.product_catalog.is_popular,
                is_seasonal: product.product_catalog.is_seasonal,
                default_unit: product.product_catalog.default_unit,
            },
            shelf: {
                id: product.shelves.id,
                name: product.shelves.name,
                index_in_freezer: product.shelves.index_in_freezer,
            },
            freezer: {
                id: product.freezers.id,
                name: product.freezers.name,
            },
            expiryStatus: getExpiryStatus(product.expiry_date),
            daysUntilExpiry: getDaysUntilExpiry(product.expiry_date),
        };
    }, []);

    const fetchProducts = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            let query = supabase
                .from('products')
                .select(`
          *,
          product_catalog!inner(
            id,
            name_en,
            name_ru,
            name_it,
            category_en,
            category_ru,
            category_it,
            description_en,
            description_ru,
            description_it,
            emoji,
            is_popular,
            is_seasonal,
            default_unit
          ),
          shelves!inner(
            id,
            name,
            index_in_freezer
          ),
          freezers!inner(
            id,
            name
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            // Если нужны только продукты, добавленные пользователем
            if (addedByUserOnly) {
                query = query.eq('added_by_user_id', userId);
            }

            const { data, error: queryError } = await query;

            if (queryError) {
                throw new Error(`Failed to fetch products: ${queryError.message}`);
            }

            if (!data) {
                setProducts([]);
                return;
            }

            const transformedProducts = data.map(transformProduct);
            setProducts(transformedProducts);
        } catch (err) {
            const apiError: ApiError = {
                message: err instanceof Error ? err.message : 'Unknown error occurred',
                code: 'FETCH_PRODUCTS_ERROR',
            };
            setError(apiError);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [userId, addedByUserOnly, transformProduct]);

    const deleteProduct = useCallback(async (productId: string) => {
        setLoading(true);
        setError(null);

        try {
            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)
                .eq('user_id', userId); // Дополнительная проверка безопасности

            if (deleteError) {
                throw new Error(`Failed to delete product: ${deleteError.message}`);
            }

            // Обновляем локальное состояние
            setProducts(prev => prev.filter(product => product.id !== productId));
        } catch (err) {
            const apiError: ApiError = {
                message: err instanceof Error ? err.message : 'Failed to delete product',
                code: 'DELETE_PRODUCT_ERROR',
            };
            setError(apiError);
            console.error('Error deleting product:', err);
            throw err; // Re-throw для обработки в компоненте
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Автоматически загружаем продукты при инициализации
    useEffect(() => {
        if (userId) {
            fetchProducts();
        }
    }, [userId, fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
        deleteProduct,
    };
}
