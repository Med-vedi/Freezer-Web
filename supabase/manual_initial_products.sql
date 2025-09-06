-- Manual function to create initial products for existing users
-- This can be called from the application or manually

-- Function to create initial products for a specific user (can be called manually)
CREATE OR REPLACE FUNCTION create_initial_products_manual(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    freezer_record RECORD;
    shelf_record RECORD;
    catalog_item RECORD;
    product_count INTEGER := 0;
    result JSON;
BEGIN
    -- Check if user exists
    IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id = user_uuid) THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;

    -- Check if user already has products
    IF user_has_products(user_uuid) THEN
        RETURN json_build_object('success', false, 'error', 'User already has products');
    END IF;

    -- Get the first freezer for this user
    SELECT * INTO freezer_record
    FROM freezers
    WHERE user_id = user_uuid
    ORDER BY created_at ASC
    LIMIT 1;

    -- If no freezer exists, create one
    IF freezer_record IS NULL THEN
        INSERT INTO freezers (user_id, name)
        VALUES (user_uuid, 'My Freezer')
        RETURNING * INTO freezer_record;
    END IF;

    -- Get the first shelf for this freezer
    SELECT * INTO shelf_record
    FROM shelves
    WHERE freezer_id = freezer_record.id
    ORDER BY index_in_freezer ASC
    LIMIT 1;

    -- If no shelf exists, create one
    IF shelf_record IS NULL THEN
        INSERT INTO shelves (freezer_id, index_in_freezer, name)
        VALUES (freezer_record.id, 1, 'Shelf 1')
        RETURNING * INTO shelf_record;
    END IF;

    -- Add some common products from catalog
    FOR catalog_item IN
        SELECT * FROM product_catalog
        WHERE name IN (
            'Milk', 'Bread', 'Eggs', 'Chicken Breast', 'Apples',
            'Bananas', 'Cheese', 'Butter', 'Rice', 'Pasta'
        )
        ORDER BY name
        LIMIT 10
    LOOP
        -- Insert product with some realistic data
        INSERT INTO products (
            user_id,
            catalog_id,
            name,
            quantity,
            unit,
            shelf_id,
            freezer_id,
            received_at,
            expiry_date,
            notes
        ) VALUES (
            user_uuid,
            catalog_item.id,
            catalog_item.name,
            CASE
                WHEN catalog_item.default_unit = 'kg' THEN 1
                WHEN catalog_item.default_unit = 'l' THEN 1
                WHEN catalog_item.default_unit = 'pcs' THEN 2
                WHEN catalog_item.default_unit = 'dozen' THEN 1
                WHEN catalog_item.default_unit = 'loaf' THEN 1
                ELSE 1
            END,
            catalog_item.default_unit,
            shelf_record.id,
            freezer_record.id,
            NOW(),
            CASE
                WHEN catalog_item.name IN ('Milk', 'Bread', 'Eggs', 'Butter') THEN (NOW() + INTERVAL '7 days')::date
                WHEN catalog_item.name IN ('Chicken Breast', 'Cheese') THEN (NOW() + INTERVAL '3 days')::date
                WHEN catalog_item.name IN ('Apples', 'Bananas') THEN (NOW() + INTERVAL '5 days')::date
                WHEN catalog_item.name IN ('Rice', 'Pasta') THEN (NOW() + INTERVAL '365 days')::date
                ELSE (NOW() + INTERVAL '14 days')::date
            END,
            'Welcome! This is a sample product to help you get started.'
        );

        product_count := product_count + 1;
    END LOOP;

    result := json_build_object(
        'success', true,
        'products_created', product_count,
        'freezer_id', freezer_record.id,
        'shelf_id', shelf_record.id
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create initial products for all users who don't have any
CREATE OR REPLACE FUNCTION create_initial_products_for_all_users()
RETURNS JSON AS $$
DECLARE
    user_record RECORD;
    total_processed INTEGER := 0;
    total_created INTEGER := 0;
    result JSON;
BEGIN
    -- Process all users who don't have products
    FOR user_record IN
        SELECT DISTINCT u.id
        FROM auth.users u
        LEFT JOIN products p ON u.id = p.user_id
        WHERE p.user_id IS NULL
    LOOP
        total_processed := total_processed + 1;

        -- Create initial products for this user
        PERFORM create_initial_products_manual(user_record.id);

        -- Count products created for this user
        SELECT COUNT(*) INTO total_created
        FROM products
        WHERE user_id = user_record.id;
    END LOOP;

    result := json_build_object(
        'success', true,
        'users_processed', total_processed,
        'total_products_created', total_created
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;
