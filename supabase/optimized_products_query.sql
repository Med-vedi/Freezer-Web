-- Оптимизированный запрос для получения продуктов с информацией о каталоге
-- Этот запрос заменяет множественные запросы одним JOIN запросом

-- Создаем view для оптимизированного получения продуктов
CREATE OR REPLACE VIEW products_with_catalog AS
SELECT
    p.id,
    p.user_id,
    p.catalog_id,
    p.name,
    p.quantity,
    p.unit,
    p.shelf_id,
    p.freezer_id,
    p.barcode,
    p.received_at,
    p.expiry_date,
    p.notes,
    p.created_at,
    p.updated_at,
    -- Локализованные данные из каталога
    pc.name_it as catalog_name_it,
    pc.name_ru as catalog_name_ru,
    pc.name_en as catalog_name_en,
    pc.category_it as catalog_category_it,
    pc.category_ru as catalog_category_ru,
    pc.category_en as catalog_category_en,
    pc.description_it as catalog_description_it,
    pc.description_ru as catalog_description_ru,
    pc.description_en as catalog_description_en,
    pc.emoji as catalog_emoji,
    pc.is_popular as catalog_is_popular,
    pc.is_seasonal as catalog_is_seasonal,
    pc.default_unit as catalog_default_unit,
    -- Данные о полке
    s.name as shelf_name,
    s.index_in_freezer as shelf_index,
    -- Данные о морозильной камере
    f.name as freezer_name
FROM products p
LEFT JOIN product_catalog pc ON p.catalog_id = pc.id
LEFT JOIN shelves s ON p.shelf_id = s.id
LEFT JOIN freezers f ON p.freezer_id = f.id;

-- Функция для получения локализованных продуктов пользователя
CREATE OR REPLACE FUNCTION get_user_products_localized(
    user_id_input UUID,
    language_code TEXT DEFAULT 'it'
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    catalog_id UUID,
    name TEXT,
    quantity INTEGER,
    unit TEXT,
    shelf_id UUID,
    freezer_id UUID,
    barcode TEXT,
    received_at TIMESTAMPTZ,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    catalog_name TEXT,
    catalog_category TEXT,
    catalog_description TEXT,
    catalog_emoji TEXT,
    catalog_is_popular BOOLEAN,
    catalog_is_seasonal BOOLEAN,
    catalog_default_unit TEXT,
    shelf_name TEXT,
    shelf_index INTEGER,
    freezer_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pwc.id,
        pwc.user_id,
        pwc.catalog_id,
        pwc.name,
        pwc.quantity,
        pwc.unit,
        pwc.shelf_id,
        pwc.freezer_id,
        pwc.barcode,
        pwc.received_at,
        pwc.expiry_date,
        pwc.notes,
        pwc.created_at,
        pwc.updated_at,
        CASE language_code
            WHEN 'ru' THEN pwc.catalog_name_ru
            WHEN 'en' THEN pwc.catalog_name_en
            ELSE pwc.catalog_name_it
        END as catalog_name,
        CASE language_code
            WHEN 'ru' THEN pwc.catalog_category_ru
            WHEN 'en' THEN pwc.catalog_category_en
            ELSE pwc.catalog_category_it
        END as catalog_category,
        CASE language_code
            WHEN 'ru' THEN pwc.catalog_description_ru
            WHEN 'en' THEN pwc.catalog_description_en
            ELSE pwc.catalog_description_it
        END as catalog_description,
        pwc.catalog_emoji,
        pwc.catalog_is_popular,
        pwc.catalog_is_seasonal,
        pwc.catalog_default_unit,
        pwc.shelf_name,
        pwc.shelf_index,
        pwc.freezer_name
    FROM products_with_catalog pwc
    WHERE pwc.user_id = user_id_input
    ORDER BY pwc.created_at DESC;
END;
$$ LANGUAGE plpgsql;
