-- Очистка неправильно созданных продуктов
-- Удаляет продукты, которые были привязаны к полкам автоматически

-- Удаляем все продукты, которые были созданы автоматически (с привязкой к полкам)
DELETE FROM products
WHERE shelf_id IS NOT NULL
AND freezer_id IS NOT NULL
AND notes LIKE '%Welcome%'
OR notes LIKE '%Добро пожаловать%'
OR notes LIKE '%sample%'
OR notes LIKE '%образец%';

-- Проверяем результат
SELECT
    COUNT(*) as total_products,
    COUNT(CASE WHEN shelf_id IS NULL THEN 1 END) as unassigned_products,
    COUNT(CASE WHEN shelf_id IS NOT NULL THEN 1 END) as assigned_products
FROM products;

-- Показываем оставшиеся продукты
SELECT
    user_id,
    name,
    shelf_id,
    freezer_id,
    notes
FROM products
ORDER BY user_id, created_at;
