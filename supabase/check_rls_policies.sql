-- Проверка RLS политик для таблиц
-- Этот скрипт покажет все RLS политики и их настройки

-- Проверяем RLS для таблицы shelves
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'shelves'
AND schemaname = 'public';

-- Проверяем RLS для таблицы freezers
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'freezers'
AND schemaname = 'public';

-- Проверяем RLS для таблицы products
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products'
AND schemaname = 'public';

-- Проверяем, включен ли RLS для таблиц
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('shelves', 'freezers', 'products')
AND schemaname = 'public';
