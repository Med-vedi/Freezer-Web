-- Отключение автоматического создания начальных продуктов
-- Этот скрипт отключает триггер, который создает продукты для новых пользователей

-- Удаляем триггер для автоматического создания продуктов
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Удаляем функцию создания начальных продуктов (опционально)
-- DROP FUNCTION IF EXISTS public.create_initial_products_for_user();

-- Проверяем, что триггер удален
SELECT
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth'
AND trigger_name = 'on_auth_user_created';
