import { create } from 'zustand';
import { supabase } from '../supabase/supabaseClient';
import { ProductCatalog, LocalizedProductCatalog } from '../types/product';

interface CatalogState {
    catalog: ProductCatalog[];
    popularProducts: LocalizedProductCatalog[];
    categories: string[];
    loading: boolean;
    error: string | null;
    initialized: boolean;
    language: string;
    fetchCatalog: () => Promise<void>;
    searchCatalog: (query: string, language?: string) => Promise<LocalizedProductCatalog[]>;
    getCategories: (language?: string) => Promise<string[]>;
    getPopularProducts: (language?: string, limit?: number) => Promise<LocalizedProductCatalog[]>;
    getLocalizedProduct: (id: string, language?: string) => Promise<LocalizedProductCatalog | null>;
    initialize: (language?: string) => Promise<void>;
    setLanguage: (language: string) => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
    catalog: [],
    popularProducts: [],
    categories: [],
    loading: false,
    error: null,
    initialized: false,
    language: 'it',

    fetchCatalog: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from('product_catalog')
            .select('*')
            .order('name_it', { ascending: true });

        if (error) {
            console.error('Error fetching product catalog:', error);
            set({ error: error.message, loading: false });
        } else {
            set({ catalog: data || [], loading: false, initialized: true });
        }
    },

    searchCatalog: async (query: string, language: string = 'it') => {
        try {
            const { data, error } = await supabase.rpc('search_products_localized', {
                search_query: query,
                language_code: language,
                limit_count: 50
            });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error searching catalog:', error);
            return [];
        }
    },

    getCategories: async (language: string = 'it') => {
        const { categories, language: currentLanguage } = get();

        // Возвращаем кэшированные категории если язык не изменился
        if (currentLanguage === language && categories.length > 0) {
            return categories;
        }

        try {
            const { data, error } = await supabase.rpc('get_categories_localized', {
                language_code: language
            });

            if (error) throw error;
            const categoriesList = data?.map((item: any) => item.category) || [];

            // Кэшируем категории
            set({ categories: categoriesList, language });
            return categoriesList;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    getPopularProducts: async (language: string = 'it', limit: number = 20) => {
        const { popularProducts, language: currentLanguage } = get();

        // Возвращаем кэшированные популярные продукты если язык не изменился
        if (currentLanguage === language && popularProducts.length > 0) {
            return popularProducts.slice(0, limit);
        }

        try {
            const { data, error } = await supabase.rpc('get_popular_products_localized', {
                language_code: language,
                limit_count: limit
            });

            if (error) throw error;
            const products = data || [];

            // Кэшируем популярные продукты
            set({ popularProducts: products, language });
            return products;
        } catch (error) {
            console.error('Error fetching popular products:', error);
            return [];
        }
    },

    getLocalizedProduct: async (id: string, language: string = 'it') => {
        try {
            const { data, error } = await supabase
                .from('product_catalog')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                id: data.id,
                name: language === 'ru' ? data.name_ru : language === 'en' ? data.name_en : data.name_it,
                category: language === 'ru' ? data.category_ru : language === 'en' ? data.category_en : data.category_it,
                default_unit: data.default_unit,
                description: language === 'ru' ? data.description_ru : language === 'en' ? data.description_en : data.description_it,
                emoji: data.emoji,
                is_popular: data.is_popular,
                is_seasonal: data.is_seasonal
            };
        } catch (error) {
            console.error('Error fetching localized product:', error);
            return null;
        }
    },

    initialize: async (language: string = 'it') => {
        const { initialized, language: currentLanguage } = get();
        if (!initialized || currentLanguage !== language) {
            set({ language });
            await get().fetchCatalog();
            // Загружаем популярные продукты и категории параллельно
            await Promise.all([
                get().getPopularProducts(language, 20),
                get().getCategories(language)
            ]);
        }
    },

    setLanguage: (language: string) => {
        set({ language });
        // Очищаем кэш при смене языка
        set({ popularProducts: [], categories: [] });
    },
}));