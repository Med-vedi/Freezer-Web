-- Тестовый скрипт для проверки обновлений базы данных
-- Выполните этот скрипт после применения update_database.sql и populate_300_products.sql

-- 1. Проверка структуры таблицы
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'product_catalog'
ORDER BY ordinal_position;

-- 2. Проверка количества продуктов
SELECT
    'Total products' as metric,
    COUNT(*) as count
FROM product_catalog
UNION ALL
SELECT
    'Popular products' as metric,
    COUNT(*) as count
FROM product_catalog
WHERE is_popular = true
UNION ALL
SELECT
    'Seasonal products' as metric,
    COUNT(*) as count
FROM product_catalog
WHERE is_seasonal = true;

-- 3. Проверка категорий на итальянском
SELECT
    'Categories (Italian)' as metric,
    COUNT(DISTINCT category_it) as count
FROM product_catalog
WHERE category_it IS NOT NULL;

-- 4. Тест поиска продуктов
SELECT 'Search test - pollo' as test_name;
SELECT * FROM search_products_localized('pollo', 'it', NULL, 5);

-- 5. Тест категорий
SELECT 'Categories test' as test_name;
SELECT * FROM get_categories_localized('it') LIMIT 10;

-- 6. Тест популярных продуктов
SELECT 'Popular products test' as test_name;
SELECT * FROM get_popular_products_localized('it', 5);

-- 7. Тест локализованных функций
SELECT 'Localized functions test' as test_name;
SELECT
    id,
    get_localized_product_name(id, 'it') as name_it,
    get_localized_category(id, 'it') as category_it
FROM product_catalog
WHERE is_popular = true
LIMIT 3;

-- 8. Проверка индексов
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'product_catalog';

-- 9. Проверка RLS политик
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'product_catalog';

-- 10. Проверка функций
SELECT
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%localized%'
ORDER BY routine_name;
