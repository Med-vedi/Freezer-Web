-- Исправление функций загрузки продуктов
-- Убираем привязку к полкам и морозильным камерам

-- Исправленная функция для загрузки всех продуктов из каталога
CREATE OR REPLACE FUNCTION load_all_catalog_products(user_id_input UUID)
RETURNS JSON AS $$
DECLARE
    products_count INT;
    inserted_count INT := 0;
    catalog_item RECORD;
    product_quantity INT;
    product_unit TEXT;
    expiry_days INT;
BEGIN
    -- Проверяем, есть ли у пользователя уже продукты
    SELECT COUNT(*) INTO products_count FROM public.products WHERE user_id = user_id_input;
    IF products_count > 0 THEN
        RETURN json_build_object('success', false, 'error', 'User already has products. Cannot add catalog products.');
    END IF;

    -- Создаем продукты для всех товаров в каталоге БЕЗ привязки к полкам
    FOR catalog_item IN
        SELECT
            id as catalog_id,
            name_it,
            default_unit,
            is_popular,
            is_seasonal
        FROM public.product_catalog
        ORDER BY name_it ASC
    LOOP
        -- Определяем количество и дату истечения
        product_quantity := CASE
            WHEN catalog_item.default_unit = 'kg' THEN 1
            WHEN catalog_item.default_unit = 'l' THEN 1
            WHEN catalog_item.default_unit = 'pcs' THEN 2
            WHEN catalog_item.default_unit = 'dozen' THEN 1
            WHEN catalog_item.default_unit = 'loaf' THEN 1
            ELSE 1
        END;

        product_unit := COALESCE(catalog_item.default_unit, 'pcs');

        expiry_days := CASE
            WHEN catalog_item.name_it IN ('Latte', 'Burro') THEN 7
            WHEN catalog_item.name_it IN ('Petto di pollo', 'Filetto di salmone') THEN 3
            WHEN catalog_item.name_it IN ('Mele', 'Broccoli') THEN 5
            WHEN catalog_item.name_it IN ('Riso', 'Pasta') THEN 365
            WHEN catalog_item.is_seasonal = true THEN 14
            ELSE 30
        END;

        -- Вставляем продукт БЕЗ привязки к полкам
        INSERT INTO public.products (
            user_id,
            catalog_id,
            name,
            quantity,
            unit,
            shelf_id,    -- NULL - не привязан к полке
            freezer_id,  -- NULL - не привязан к морозильной камере
            expiry_date,
            notes
        ) VALUES (
            user_id_input,
            catalog_item.catalog_id,
            catalog_item.name_it,
            product_quantity,
            product_unit,
            NULL, -- Не привязан к полке
            NULL, -- Не привязан к морозильной камере
            (now() + (expiry_days || ' days')::interval)::date,
            'Продукт из каталога - добавьте в морозильную камеру'
        );

        inserted_count := inserted_count + 1;
    END LOOP;

    RETURN json_build_object(
        'success', true,
        'products_created', inserted_count,
        'message', 'Все продукты из каталога загружены в коллекцию'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Исправленная функция для загрузки только популярных продуктов
CREATE OR REPLACE FUNCTION load_popular_products_only(user_id_input UUID)
RETURNS JSON AS $$
DECLARE
    products_count INT;
    inserted_count INT := 0;
    catalog_item RECORD;
    product_quantity INT;
    product_unit TEXT;
    expiry_days INT;
BEGIN
    -- Проверяем, есть ли у пользователя уже продукты
    SELECT COUNT(*) INTO products_count FROM public.products WHERE user_id = user_id_input;
    IF products_count > 0 THEN
        RETURN json_build_object('success', false, 'error', 'User already has products. Cannot add popular products.');
    END IF;

    -- Создаем продукты только для популярных товаров БЕЗ привязки к полкам
    FOR catalog_item IN
        SELECT
            id as catalog_id,
            name_it,
            default_unit,
            is_popular,
            is_seasonal
        FROM public.product_catalog
        WHERE is_popular = true
        ORDER BY name_it ASC
        LIMIT 30
    LOOP
        -- Определяем количество и дату истечения
        product_quantity := CASE
            WHEN catalog_item.default_unit = 'kg' THEN 1
            WHEN catalog_item.default_unit = 'l' THEN 1
            WHEN catalog_item.default_unit = 'pcs' THEN 2
            WHEN catalog_item.default_unit = 'dozen' THEN 1
            WHEN catalog_item.default_unit = 'loaf' THEN 1
            ELSE 1
        END;

        product_unit := COALESCE(catalog_item.default_unit, 'pcs');

        expiry_days := CASE
            WHEN catalog_item.name_it IN ('Latte', 'Burro') THEN 7
            WHEN catalog_item.name_it IN ('Petto di pollo', 'Filetto di salmone') THEN 3
            WHEN catalog_item.name_it IN ('Mele', 'Broccoli') THEN 5
            WHEN catalog_item.name_it IN ('Riso', 'Pasta') THEN 365
            WHEN catalog_item.is_seasonal = true THEN 14
            ELSE 30
        END;

        -- Вставляем продукт БЕЗ привязки к полкам
        INSERT INTO public.products (
            user_id,
            catalog_id,
            name,
            quantity,
            unit,
            shelf_id,    -- NULL - не привязан к полке
            freezer_id,  -- NULL - не привязан к морозильной камере
            expiry_date,
            notes
        ) VALUES (
            user_id_input,
            catalog_item.catalog_id,
            catalog_item.name_it,
            product_quantity,
            product_unit,
            NULL, -- Не привязан к полке
            NULL, -- Не привязан к морозильной камере
            (now() + (expiry_days || ' days')::interval)::date,
            'Популярный продукт - добавьте в морозильную камеру'
        );

        inserted_count := inserted_count + 1;
    END LOOP;

    RETURN json_build_object(
        'success', true,
        'products_created', inserted_count,
        'message', 'Популярные продукты загружены в коллекцию'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Проверяем результат
SELECT 'Функции загрузки продуктов исправлены - продукты создаются без привязки к полкам' as status;
