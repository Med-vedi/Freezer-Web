-- Создание локализованного каталога продуктов
-- Поддерживает 3 языка: английский (en), русский (ru), итальянский (it)

-- Удаляем старую таблицу если существует
DROP TABLE IF EXISTS product_catalog CASCADE;

-- Создаем новую таблицу каталога с локализацией
CREATE TABLE product_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Основные поля (используются для поиска и фильтрации)
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    name_it TEXT NOT NULL,
    category_en TEXT NOT NULL,
    category_ru TEXT NOT NULL,
    category_it TEXT NOT NULL,
    -- Метаданные
    default_unit TEXT NOT NULL DEFAULT 'pcs',
    description_en TEXT,
    description_ru TEXT,
    description_it TEXT,
    -- Дополнительные поля
    emoji TEXT, -- Эмодзи для категории
    is_popular BOOLEAN DEFAULT false, -- Популярные продукты
    is_seasonal BOOLEAN DEFAULT false, -- Сезонные продукты
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем индексы для быстрого поиска
CREATE INDEX idx_product_catalog_name_en ON product_catalog(name_en);
CREATE INDEX idx_product_catalog_name_ru ON product_catalog(name_ru);
CREATE INDEX idx_product_catalog_name_it ON product_catalog(name_it);
CREATE INDEX idx_product_catalog_category_en ON product_catalog(category_en);
CREATE INDEX idx_product_catalog_category_ru ON product_catalog(category_ru);
CREATE INDEX idx_product_catalog_category_it ON product_catalog(category_it);
CREATE INDEX idx_product_catalog_popular ON product_catalog(is_popular);
CREATE INDEX idx_product_catalog_seasonal ON product_catalog(is_seasonal);

-- Включаем RLS
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;

-- Политика: все аутентифицированные пользователи могут читать каталог
CREATE POLICY "Catalog read for authenticated" ON product_catalog
    FOR SELECT USING (auth.role() IS NOT NULL);

-- Политика: обычные пользователи не могут изменять каталог
CREATE POLICY "Catalog no writes for users" ON product_catalog
    FOR ALL USING (false) WITH CHECK (false);

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

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_catalog_updated_at_trigger
    BEFORE UPDATE ON product_catalog
    FOR EACH ROW
    EXECUTE FUNCTION update_catalog_updated_at();
