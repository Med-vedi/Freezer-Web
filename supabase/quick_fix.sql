-- Быстрое исправление всех проблем
-- Выполните этот скрипт для исправления ошибок

-- 1. Исправляем foreign key
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_catalog_id_fkey;
ALTER TABLE products
ADD CONSTRAINT products_catalog_id_fkey
FOREIGN KEY (catalog_id) REFERENCES product_catalog(id);

-- 2. Создаем оптимизированный view
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

-- 3. Создаем оптимизированную функцию для получения продуктов
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
    catalog_name_it TEXT,
    catalog_name_ru TEXT,
    catalog_name_en TEXT,
    catalog_category_it TEXT,
    catalog_category_ru TEXT,
    catalog_category_en TEXT,
    catalog_description_it TEXT,
    catalog_description_ru TEXT,
    catalog_description_en TEXT,
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
        pwc.catalog_name_it,
        pwc.catalog_name_ru,
        pwc.catalog_name_en,
        pwc.catalog_category_it,
        pwc.catalog_category_ru,
        pwc.catalog_category_en,
        pwc.catalog_description_it,
        pwc.catalog_description_ru,
        pwc.catalog_description_en,
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

-- 4. Проверяем что все работает
SELECT 'Foreign key check' as test;
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name='products'
AND tc.constraint_name='products_catalog_id_fkey';

SELECT 'Function check' as test;
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'get_user_products_localized';

SELECT 'View check' as test;
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_name = 'products_with_catalog';
