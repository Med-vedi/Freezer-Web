-- Создание функций для загрузки продуктов из каталога
-- Этот скрипт создает функции для загрузки всех продуктов или только популярных

-- Функция для загрузки всех продуктов из каталога
CREATE OR REPLACE FUNCTION load_all_catalog_products(user_id_input UUID)
RETURNS JSON AS $$
DECLARE
    user_freezer_id UUID;
    user_shelf_id UUID;
    products_count INT;
    inserted_count INT := 0;
    catalog_item RECORD;
    shelf_index INT := 1;
    max_shelf_index INT;
BEGIN
    -- Проверяем, есть ли у пользователя уже продукты
    SELECT COUNT(*) INTO products_count FROM public.products WHERE user_id = user_id_input;
    IF products_count > 0 THEN
        RETURN json_build_object('success', false, 'error', 'User already has products. Cannot add catalog products.');
    END IF;

    -- Получаем или создаем морозильную камеру по умолчанию для пользователя
    SELECT id INTO user_freezer_id
    FROM public.freezers
    WHERE user_id = user_id_input
    LIMIT 1;

    IF user_freezer_id IS NULL THEN
        INSERT INTO public.freezers (user_id, name)
        VALUES (user_id_input, 'My Freezer')
        RETURNING id INTO user_freezer_id;
    END IF;

    -- Получаем максимальный индекс полки
    SELECT MAX(index_in_freezer) INTO max_shelf_index
    FROM public.shelves
    WHERE freezer_id = user_freezer_id;

    IF max_shelf_index IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'No shelves found for the user''s freezer.');
    END IF;

    -- Создаем продукты для всех товаров в каталоге
    FOR catalog_item IN
        SELECT
            id as catalog_id,
            name_it,
            default_unit,
            is_popular,
            is_seasonal
        FROM public.product_catalog
        ORDER BY is_popular DESC, name_it ASC
    LOOP
        -- Получаем ID полки для текущего продукта (распределяем по полкам)
        SELECT id INTO user_shelf_id
        FROM public.shelves
        WHERE freezer_id = user_freezer_id
        AND index_in_freezer = ((inserted_count % max_shelf_index) + 1)
        LIMIT 1;

        -- Определяем количество и дату истечения в зависимости от типа продукта
        DECLARE
            product_quantity NUMERIC;
            product_unit TEXT;
            expiry_days INT;
        BEGIN
            -- Устанавливаем количество и единицы измерения
            product_quantity := CASE
                WHEN catalog_item.default_unit = 'kg' THEN
                    CASE
                        WHEN catalog_item.is_popular THEN 2.0
                        ELSE 1.0
                    END
                WHEN catalog_item.default_unit = 'l' THEN
                    CASE
                        WHEN catalog_item.is_popular THEN 1.5
                        ELSE 1.0
                    END
                WHEN catalog_item.default_unit = 'pcs' THEN
                    CASE
                        WHEN catalog_item.is_popular THEN 6
                        ELSE 3
                    END
                ELSE 1.0
            END;

            product_unit := catalog_item.default_unit;

            -- Устанавливаем срок годности в зависимости от категории
            expiry_days := CASE
                WHEN catalog_item.name_it ILIKE '%latte%' OR catalog_item.name_it ILIKE '%yogurt%' OR catalog_item.name_it ILIKE '%formaggio%' THEN 7
                WHEN catalog_item.name_it ILIKE '%pane%' OR catalog_item.name_it ILIKE '%pasta%' THEN 3
                WHEN catalog_item.name_it ILIKE '%carne%' OR catalog_item.name_it ILIKE '%pesce%' OR catalog_item.name_it ILIKE '%pollo%' THEN 5
                WHEN catalog_item.name_it ILIKE '%verdura%' OR catalog_item.name_it ILIKE '%frutta%' THEN 10
                WHEN catalog_item.name_it ILIKE '%riso%' OR catalog_item.name_it ILIKE '%pasta%' OR catalog_item.name_it ILIKE '%farina%' THEN 365
                WHEN catalog_item.name_it ILIKE '%uova%' THEN 14
                WHEN catalog_item.name_it ILIKE '%burro%' THEN 30
                ELSE 7
            END;

            -- Вставляем продукт
            INSERT INTO public.products (
                user_id,
                catalog_id,
                name,
                quantity,
                unit,
                shelf_id,
                freezer_id,
                expiry_date
            ) VALUES (
                user_id_input,
                catalog_item.catalog_id,
                catalog_item.name_it,
                product_quantity,
                product_unit,
                user_shelf_id,
                user_freezer_id,
                (now() + (expiry_days || ' days')::interval)::date
            );

            inserted_count := inserted_count + 1;
        END;
    END LOOP;

    RETURN json_build_object(
        'success', true,
        'products_created', inserted_count,
        'message', 'All catalog products loaded successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для загрузки только популярных продуктов
CREATE OR REPLACE FUNCTION load_popular_products_only(user_id_input UUID)
RETURNS JSON AS $$
DECLARE
    user_freezer_id UUID;
    user_shelf_id UUID;
    products_count INT;
    inserted_count INT := 0;
    catalog_item RECORD;
BEGIN
    -- Проверяем, есть ли у пользователя уже продукты
    SELECT COUNT(*) INTO products_count FROM public.products WHERE user_id = user_id_input;
    IF products_count > 0 THEN
        RETURN json_build_object('success', false, 'error', 'User already has products. Cannot add popular products.');
    END IF;

    -- Получаем или создаем морозильную камеру по умолчанию для пользователя
    SELECT id INTO user_freezer_id
    FROM public.freezers
    WHERE user_id = user_id_input
    LIMIT 1;

    IF user_freezer_id IS NULL THEN
        INSERT INTO public.freezers (user_id, name)
        VALUES (user_id_input, 'My Freezer')
        RETURNING id INTO user_freezer_id;
    END IF;

    -- Получаем ID первой полки
    SELECT id INTO user_shelf_id
    FROM public.shelves
    WHERE freezer_id = user_freezer_id
    ORDER BY index_in_freezer
    LIMIT 1;

    IF user_shelf_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'No shelves found for the user''s freezer.');
    END IF;

    -- Создаем продукты только для популярных товаров
    FOR catalog_item IN
        SELECT
            id as catalog_id,
            name_it,
            default_unit,
            is_popular
        FROM public.product_catalog
        WHERE is_popular = true
        ORDER BY name_it ASC
        LIMIT 30
    LOOP
        -- Определяем количество и дату истечения
        DECLARE
            product_quantity NUMERIC;
            product_unit TEXT;
            expiry_days INT;
        BEGIN
            product_quantity := CASE
                WHEN catalog_item.default_unit = 'kg' THEN 2.0
                WHEN catalog_item.default_unit = 'l' THEN 1.5
                WHEN catalog_item.default_unit = 'pcs' THEN 6
                ELSE 1.0
            END;

            product_unit := catalog_item.default_unit;

            expiry_days := CASE
                WHEN catalog_item.name_it ILIKE '%latte%' OR catalog_item.name_it ILIKE '%yogurt%' THEN 7
                WHEN catalog_item.name_it ILIKE '%pane%' OR catalog_item.name_it ILIKE '%pasta%' THEN 3
                WHEN catalog_item.name_it ILIKE '%carne%' OR catalog_item.name_it ILIKE '%pesce%' OR catalog_item.name_it ILIKE '%pollo%' THEN 5
                WHEN catalog_item.name_it ILIKE '%verdura%' OR catalog_item.name_it ILIKE '%frutta%' THEN 10
                WHEN catalog_item.name_it ILIKE '%riso%' OR catalog_item.name_it ILIKE '%pasta%' THEN 365
                WHEN catalog_item.name_it ILIKE '%uova%' THEN 14
                WHEN catalog_item.name_it ILIKE '%burro%' THEN 30
                ELSE 7
            END;

            -- Вставляем продукт
            INSERT INTO public.products (
                user_id,
                catalog_id,
                name,
                quantity,
                unit,
                shelf_id,
                freezer_id,
                expiry_date
            ) VALUES (
                user_id_input,
                catalog_item.catalog_id,
                catalog_item.name_it,
                product_quantity,
                product_unit,
                user_shelf_id,
                user_freezer_id,
                (now() + (expiry_days || ' days')::interval)::date
            );

            inserted_count := inserted_count + 1;
        END;
    END LOOP;

    RETURN json_build_object(
        'success', true,
        'products_created', inserted_count,
        'message', 'Popular products loaded successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Проверяем что функции созданы
SELECT 'Functions created successfully' as status;
