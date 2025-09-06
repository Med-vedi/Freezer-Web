-- Исправленный скрипт создания начальных продуктов
-- Создает только коллекцию продуктов без привязки к полкам и морозильным камерам

-- Сначала отключаем старый триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Удаляем старую функцию
DROP FUNCTION IF EXISTS public.create_initial_products_for_user();

-- Создаем новую функцию для создания коллекции продуктов
CREATE OR REPLACE FUNCTION create_initial_product_collection(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    catalog_item RECORD;
    product_count INTEGER := 0;
    result JSON;
BEGIN
    -- Проверяем, есть ли у пользователя уже продукты
    IF EXISTS(SELECT 1 FROM products WHERE user_id = user_uuid) THEN
        RETURN json_build_object('success', false, 'error', 'User already has products');
    END IF;

    -- Добавляем популярные продукты из каталога БЕЗ привязки к полкам
    FOR catalog_item IN
        SELECT * FROM product_catalog
        WHERE name_it IN (
            'Latte', 'Petto di pollo', 'Riso', 'Pasta', 'Burro',
            'Uova', 'Broccoli', 'Mele', 'Filetto di salmone', 'Yogurt'
        )
        ORDER BY name_it
        LIMIT 10
    LOOP
        -- Вставляем продукт БЕЗ shelf_id и freezer_id
        INSERT INTO products (
            user_id,
            catalog_id,
            name,
            quantity,
            unit,
            shelf_id,  -- NULL - не привязан к полке
            freezer_id, -- NULL - не привязан к морозильной камере
            received_at,
            expiry_date,
            notes
        ) VALUES (
            user_uuid,
            catalog_item.id,
            catalog_item.name_it,
            CASE
                WHEN catalog_item.default_unit = 'kg' THEN 1
                WHEN catalog_item.default_unit = 'l' THEN 1
                WHEN catalog_item.default_unit = 'pcs' THEN 2
                WHEN catalog_item.default_unit = 'dozen' THEN 1
                WHEN catalog_item.default_unit = 'loaf' THEN 1
                ELSE 1
            END,
            catalog_item.default_unit,
            NULL, -- Не привязан к полке
            NULL, -- Не привязан к морозильной камере
            NOW(),
            CASE
                WHEN catalog_item.name_it IN ('Latte', 'Burro') THEN (NOW() + INTERVAL '7 days')::date
                WHEN catalog_item.name_it IN ('Petto di pollo', 'Filetto di salmone') THEN (NOW() + INTERVAL '3 days')::date
                WHEN catalog_item.name_it IN ('Mele', 'Broccoli') THEN (NOW() + INTERVAL '5 days')::date
                WHEN catalog_item.name_it IN ('Riso', 'Pasta') THEN (NOW() + INTERVAL '365 days')::date
                ELSE (NOW() + INTERVAL '14 days')::date
            END,
            'Добро пожаловать! Это образец продукта для начала работы.'
        );

        product_count := product_count + 1;
    END LOOP;

    result := json_build_object(
        'success', true,
        'products_created', product_count,
        'message', 'Создана коллекция продуктов. Пользователь может теперь добавлять их в морозильные камеры.'
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического создания коллекции продуктов при регистрации
CREATE OR REPLACE FUNCTION trigger_create_product_collection()
RETURNS TRIGGER AS $$
BEGIN
    -- Создаем коллекцию продуктов для нового пользователя
    PERFORM create_initial_product_collection(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем триггер
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE trigger_create_product_collection();

-- Проверяем результат
SELECT 'Триггер создания коллекции продуктов настроен успешно' as status;
