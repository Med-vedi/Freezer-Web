-- Обновление базы данных для поддержки локализованного каталога
-- Этот скрипт обновляет существующую структуру для поддержки 3 языков

-- 1. Удаляем старую таблицу product_catalog и создаем новую с локализацией
-- Сначала удаляем foreign key constraint из products
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_catalog_id_fkey;
DROP TABLE IF EXISTS product_catalog CASCADE;

-- Создаем новую таблицу product_catalog с поддержкой локализации
CREATE TABLE product_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    name_it TEXT NOT NULL,
    category_en TEXT,
    category_ru TEXT,
    category_it TEXT,
    default_unit TEXT,
    description_en TEXT,
    description_ru TEXT,
    description_it TEXT,
    emoji TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Создаем индексы для лучшей производительности
CREATE INDEX ON product_catalog (name_en);
CREATE INDEX ON product_catalog (name_ru);
CREATE INDEX ON product_catalog (name_it);
CREATE INDEX ON product_catalog (category_en);
CREATE INDEX ON product_catalog (category_ru);
CREATE INDEX ON product_catalog (category_it);
CREATE INDEX ON product_catalog (is_popular);
CREATE INDEX ON product_catalog (is_seasonal);

-- Включаем Row Level Security
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;

-- RLS политики для каталога
CREATE POLICY "Catalog read for authenticated" ON product_catalog
    FOR SELECT USING (auth.role() IS NOT NULL);

-- Предотвращаем любые изменения каталога обычными пользователями
CREATE POLICY "Catalog no writes for users" ON product_catalog
    FOR ALL USING (false) WITH CHECK (false);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_product_catalog_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления updated_at
CREATE TRIGGER update_product_catalog_updated_at
    BEFORE UPDATE ON product_catalog
    FOR EACH ROW
    EXECUTE FUNCTION update_product_catalog_updated_at_column();

-- Восстанавливаем foreign key constraint для products
ALTER TABLE products
ADD CONSTRAINT products_catalog_id_fkey
FOREIGN KEY (catalog_id) REFERENCES product_catalog(id);

-- 2. Создаем локализованные функции

-- Функция для получения локализованного названия продукта
CREATE OR REPLACE FUNCTION get_localized_product_name(product_id UUID, language_code TEXT DEFAULT 'it')
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    SELECT CASE language_code
        WHEN 'ru' THEN name_ru
        WHEN 'en' THEN name_en
        ELSE name_it
    END INTO result
    FROM product_catalog
    WHERE id = product_id;

    RETURN COALESCE(result, 'Unknown Product');
END;
$$ LANGUAGE plpgsql;

-- Функция для получения локализованной категории
CREATE OR REPLACE FUNCTION get_localized_category(product_id UUID, language_code TEXT DEFAULT 'it')
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    SELECT CASE language_code
        WHEN 'ru' THEN category_ru
        WHEN 'en' THEN category_en
        ELSE category_it
    END INTO result
    FROM product_catalog
    WHERE id = product_id;

    RETURN COALESCE(result, 'Unknown Category');
END;
$$ LANGUAGE plpgsql;

-- Функция для получения локализованного описания
CREATE OR REPLACE FUNCTION get_localized_description(product_id UUID, language_code TEXT DEFAULT 'it')
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    SELECT CASE language_code
        WHEN 'ru' THEN description_ru
        WHEN 'en' THEN description_en
        ELSE description_it
    END INTO result
    FROM product_catalog
    WHERE id = product_id;

    RETURN COALESCE(result, '');
END;
$$ LANGUAGE plpgsql;

-- Функция для поиска продуктов по локализованному названию
CREATE OR REPLACE FUNCTION search_products_localized(
    search_query TEXT,
    language_code TEXT DEFAULT 'it',
    category_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    default_unit TEXT,
    description TEXT,
    emoji TEXT,
    is_popular BOOLEAN,
    is_seasonal BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.id,
        CASE language_code
            WHEN 'ru' THEN pc.name_ru
            WHEN 'en' THEN pc.name_en
            ELSE pc.name_it
        END as name,
        CASE language_code
            WHEN 'ru' THEN pc.category_ru
            WHEN 'en' THEN pc.category_en
            ELSE pc.category_it
        END as category,
        pc.default_unit,
        CASE language_code
            WHEN 'ru' THEN pc.description_ru
            WHEN 'en' THEN pc.description_en
            ELSE pc.description_it
        END as description,
        pc.emoji,
        pc.is_popular,
        pc.is_seasonal
    FROM product_catalog pc
    WHERE
        (CASE language_code
            WHEN 'ru' THEN pc.name_ru ILIKE '%' || search_query || '%'
            WHEN 'en' THEN pc.name_en ILIKE '%' || search_query || '%'
            ELSE pc.name_it ILIKE '%' || search_query || '%'
        END)
        AND (category_filter IS NULL OR
            CASE language_code
                WHEN 'ru' THEN pc.category_ru = category_filter
                WHEN 'en' THEN pc.category_en = category_filter
                ELSE pc.category_it = category_filter
            END)
    ORDER BY
        pc.is_popular DESC,
        pc.name_it ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Функция для получения всех категорий на выбранном языке
CREATE OR REPLACE FUNCTION get_categories_localized(language_code TEXT DEFAULT 'it')
RETURNS TABLE (
    category TEXT,
    emoji TEXT,
    product_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CASE language_code
            WHEN 'ru' THEN pc.category_ru
            WHEN 'en' THEN pc.category_en
            ELSE pc.category_it
        END as category,
        pc.emoji,
        COUNT(*) as product_count
    FROM product_catalog pc
    GROUP BY
        CASE language_code
            WHEN 'ru' THEN pc.category_ru
            WHEN 'en' THEN pc.category_en
            ELSE pc.category_it
        END,
        pc.emoji
    ORDER BY product_count DESC, category ASC;
END;
$$ LANGUAGE plpgsql;

-- Функция для получения популярных продуктов
CREATE OR REPLACE FUNCTION get_popular_products_localized(
    language_code TEXT DEFAULT 'it',
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    default_unit TEXT,
    description TEXT,
    emoji TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.id,
        CASE language_code
            WHEN 'ru' THEN pc.name_ru
            WHEN 'en' THEN pc.name_en
            ELSE pc.name_it
        END as name,
        CASE language_code
            WHEN 'ru' THEN pc.category_ru
            WHEN 'en' THEN pc.category_en
            ELSE pc.category_it
        END as category,
        pc.default_unit,
        CASE language_code
            WHEN 'ru' THEN pc.description_ru
            WHEN 'en' THEN pc.description_en
            ELSE pc.description_it
        END as description,
        pc.emoji
    FROM product_catalog pc
    WHERE pc.is_popular = true
    ORDER BY pc.name_it ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Функции для создания начальных продуктов пользователей

-- Функция для автоматического создания начальных продуктов при регистрации
CREATE OR REPLACE FUNCTION create_initial_products_for_user()
RETURNS TRIGGER AS $$
DECLARE
    user_freezer_id UUID;
    user_shelf_id UUID;
    milk_catalog_id UUID;
    chicken_catalog_id UUID;
    rice_catalog_id UUID;
    pasta_catalog_id UUID;
    butter_catalog_id UUID;
    eggs_catalog_id UUID;
    broccoli_catalog_id UUID;
    apples_catalog_id UUID;
    salmon_catalog_id UUID;
    yogurt_catalog_id UUID;
BEGIN
    -- Создаем морозильную камеру по умолчанию для нового пользователя
    INSERT INTO public.freezers (user_id, name)
    VALUES (NEW.id, 'My Freezer')
    RETURNING id INTO user_freezer_id;

    -- Триггер create_default_shelves_trigger автоматически создаст полки для этой камеры.
    -- Нам нужно получить ID первой полки.
    SELECT id INTO user_shelf_id
    FROM public.shelves
    WHERE freezer_id = user_freezer_id
    ORDER BY index_in_freezer
    LIMIT 1;

    -- Получаем ID каталога для образцов продуктов
    SELECT id INTO milk_catalog_id FROM public.product_catalog WHERE name_it = 'Latte';
    SELECT id INTO chicken_catalog_id FROM public.product_catalog WHERE name_it = 'Petto di pollo';
    SELECT id INTO rice_catalog_id FROM public.product_catalog WHERE name_it = 'Riso';
    SELECT id INTO pasta_catalog_id FROM public.product_catalog WHERE name_it = 'Pasta';
    SELECT id INTO butter_catalog_id FROM public.product_catalog WHERE name_it = 'Burro';
    SELECT id INTO eggs_catalog_id FROM public.product_catalog WHERE name_it = 'Uova';
    SELECT id INTO broccoli_catalog_id FROM public.product_catalog WHERE name_it = 'Broccoli';
    SELECT id INTO apples_catalog_id FROM public.product_catalog WHERE name_it = 'Mele';
    SELECT id INTO salmon_catalog_id FROM public.product_catalog WHERE name_it = 'Filetto di salmone';
    SELECT id INTO yogurt_catalog_id FROM public.product_catalog WHERE name_it = 'Yogurt';

    -- Вставляем образцы продуктов для нового пользователя
    INSERT INTO public.products (user_id, catalog_id, name, quantity, unit, shelf_id, freezer_id, expiry_date) VALUES
    (NEW.id, milk_catalog_id, 'Latte', 1, 'l', user_shelf_id, user_freezer_id, (now() + interval '7 days')::date),
    (NEW.id, chicken_catalog_id, 'Petto di pollo', 2, 'kg', user_shelf_id, user_freezer_id, (now() + interval '5 days')::date),
    (NEW.id, rice_catalog_id, 'Riso', 1, 'kg', user_shelf_id, user_freezer_id, (now() + interval '365 days')::date),
    (NEW.id, pasta_catalog_id, 'Pasta', 1, 'kg', user_shelf_id, user_freezer_id, (now() + interval '365 days')::date),
    (NEW.id, butter_catalog_id, 'Burro', 1, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '30 days')::date),
    (NEW.id, eggs_catalog_id, 'Uova', 12, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '14 days')::date),
    (NEW.id, broccoli_catalog_id, 'Broccoli', 1, 'kg', user_shelf_id, user_freezer_id, (now() + interval '10 days')::date),
    (NEW.id, apples_catalog_id, 'Mele', 6, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '21 days')::date),
    (NEW.id, salmon_catalog_id, 'Filetto di salmone', 0.5, 'kg', user_shelf_id, user_freezer_id, (now() + interval '4 days')::date),
    (NEW.id, yogurt_catalog_id, 'Yogurt', 4, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '10 days')::date);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания начальных продуктов при регистрации
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.create_initial_products_for_user();

-- Функция для ручного создания начальных продуктов
CREATE OR REPLACE FUNCTION create_initial_products_manual(user_id_input UUID)
RETURNS JSON AS $$
DECLARE
    user_freezer_id UUID;
    user_shelf_id UUID;
    products_count INT;
    milk_catalog_id UUID;
    chicken_catalog_id UUID;
    rice_catalog_id UUID;
    pasta_catalog_id UUID;
    butter_catalog_id UUID;
    eggs_catalog_id UUID;
    broccoli_catalog_id UUID;
    apples_catalog_id UUID;
    salmon_catalog_id UUID;
    yogurt_catalog_id UUID;
BEGIN
    -- Проверяем, есть ли у пользователя уже продукты
    SELECT COUNT(*) INTO products_count FROM public.products WHERE user_id = user_id_input;
    IF products_count > 0 THEN
        RETURN json_build_object('success', false, 'error', 'User already has products. Cannot add initial products.');
    END IF;

    -- Получаем или создаем морозильную камеру по умолчанию для пользователя
    SELECT id INTO user_freezer_id
    FROM public.freezers
    WHERE user_id = user_id_input
    LIMIT 1;

    IF user_freezer_id IS NULL THEN
        INSERT INTO public.freezers (user_id, name)
        VALUES (user_id_input, 'My Freezer')
        RETURNING id INTO user_freezer_id;
    END IF;

    -- Получаем ID первой полки в морозильной камере пользователя
    SELECT id INTO user_shelf_id
    FROM public.shelves
    WHERE freezer_id = user_freezer_id
    ORDER BY index_in_freezer
    LIMIT 1;

    IF user_shelf_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'No shelves found for the user''s freezer.');
    END IF;

    -- Получаем ID каталога для образцов продуктов
    SELECT id INTO milk_catalog_id FROM public.product_catalog WHERE name_it = 'Latte';
    SELECT id INTO chicken_catalog_id FROM public.product_catalog WHERE name_it = 'Petto di pollo';
    SELECT id INTO rice_catalog_id FROM public.product_catalog WHERE name_it = 'Riso';
    SELECT id INTO pasta_catalog_id FROM public.product_catalog WHERE name_it = 'Pasta';
    SELECT id INTO butter_catalog_id FROM public.product_catalog WHERE name_it = 'Burro';
    SELECT id INTO eggs_catalog_id FROM public.product_catalog WHERE name_it = 'Uova';
    SELECT id INTO broccoli_catalog_id FROM public.product_catalog WHERE name_it = 'Broccoli';
    SELECT id INTO apples_catalog_id FROM public.product_catalog WHERE name_it = 'Mele';
    SELECT id INTO salmon_catalog_id FROM public.product_catalog WHERE name_it = 'Filetto di salmone';
    SELECT id INTO yogurt_catalog_id FROM public.product_catalog WHERE name_it = 'Yogurt';

    -- Вставляем образцы продуктов для пользователя
    INSERT INTO public.products (user_id, catalog_id, name, quantity, unit, shelf_id, freezer_id, expiry_date) VALUES
    (user_id_input, milk_catalog_id, 'Latte', 1, 'l', user_shelf_id, user_freezer_id, (now() + interval '7 days')::date),
    (user_id_input, chicken_catalog_id, 'Petto di pollo', 2, 'kg', user_shelf_id, user_freezer_id, (now() + interval '5 days')::date),
    (user_id_input, rice_catalog_id, 'Riso', 1, 'kg', user_shelf_id, user_freezer_id, (now() + interval '365 days')::date),
    (user_id_input, pasta_catalog_id, 'Pasta', 1, 'kg', user_shelf_id, user_freezer_id, (now() + interval '365 days')::date),
    (user_id_input, butter_catalog_id, 'Burro', 1, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '30 days')::date),
    (user_id_input, eggs_catalog_id, 'Uova', 12, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '14 days')::date),
    (user_id_input, broccoli_catalog_id, 'Broccoli', 1, 'kg', user_shelf_id, user_freezer_id, (now() + interval '10 days')::date),
    (user_id_input, apples_catalog_id, 'Mele', 6, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '21 days')::date),
    (user_id_input, salmon_catalog_id, 'Filetto di salmone', 0.5, 'kg', user_shelf_id, user_freezer_id, (now() + interval '4 days')::date),
    (user_id_input, yogurt_catalog_id, 'Yogurt', 4, 'pcs', user_shelf_id, user_freezer_id, (now() + interval '10 days')::date);

    RETURN json_build_object('success', true, 'products_created', 10);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
