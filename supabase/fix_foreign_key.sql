-- Быстрое исправление foreign key для products -> product_catalog
-- Выполните этот скрипт если получили ошибку связи между таблицами

-- 1. Удаляем старый foreign key constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_catalog_id_fkey;

-- 2. Добавляем новый foreign key constraint
ALTER TABLE products
ADD CONSTRAINT products_catalog_id_fkey
FOREIGN KEY (catalog_id) REFERENCES product_catalog(id);

-- 3. Проверяем что constraint создан
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
