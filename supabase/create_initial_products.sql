-- Function to create initial products for new users
-- This will add some common products to help users get started

CREATE OR REPLACE FUNCTION create_initial_products_for_user(user_uuid UUID)
RETURNS void AS $$
DECLARE
    freezer_record RECORD;
    shelf_record RECORD;
    catalog_item RECORD;
    product_count INTEGER := 0;
BEGIN
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
    -- We'll add a few popular items to get users started
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

    -- Log the creation
    RAISE NOTICE 'Created % initial products for user %', product_count, user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has any products
CREATE OR REPLACE FUNCTION user_has_products(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(SELECT 1 FROM products WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql;

-- Function to create initial products if user doesn't have any
CREATE OR REPLACE FUNCTION ensure_initial_products()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run for new user registrations
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'auth.users' THEN
        -- Wait a bit to ensure the user is fully created
        PERFORM pg_sleep(1);

        -- Check if user already has products (in case of multiple triggers)
        IF NOT user_has_products(NEW.id) THEN
            PERFORM create_initial_products_for_user(NEW.id);
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user registrations
-- Note: This trigger runs on auth.users table
DROP TRIGGER IF EXISTS create_initial_products_trigger ON auth.users;
CREATE TRIGGER create_initial_products_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_initial_products();
