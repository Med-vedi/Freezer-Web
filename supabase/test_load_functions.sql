-- Тест функций загрузки продуктов
-- Выполните этот скрипт для проверки работы функций

-- 1. Проверяем что функции существуют
SELECT 'Checking functions...' as test;

SELECT
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_name IN ('load_all_catalog_products', 'load_popular_products_only')
AND routine_schema = 'public';

-- 2. Проверяем что каталог заполнен
SELECT 'Checking catalog...' as test;

SELECT
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_popular = true THEN 1 END) as popular_products
FROM product_catalog;

-- 3. Проверяем структуру таблицы products
SELECT 'Checking products table...' as test;

SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Проверяем foreign key
SELECT 'Checking foreign key...' as test;

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

-- 5. Тест функции (закомментировано, чтобы не создавать продукты)
-- Раскомментируйте и замените 'test-user-id' на реальный ID пользователя для тестирования
/*
SELECT 'Testing load_popular_products_only...' as test;
SELECT load_popular_products_only('test-user-id'::uuid);
*/
