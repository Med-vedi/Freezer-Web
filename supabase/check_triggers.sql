-- Проверка триггеров в базе данных
-- Этот скрипт покажет все активные триггеры

-- Проверяем триггеры на таблице auth.users
SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth';

-- Проверяем все триггеры в схеме public
SELECT
    trigger_name,
    event_object_table,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Проверяем функцию create_initial_products_for_user
SELECT
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'create_initial_products_for_user'
AND routine_schema = 'public';
