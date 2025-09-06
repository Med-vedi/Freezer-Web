-- Добавление полей для отслеживания пользователя и времени добавления продукта
-- Эти поля помогут отслеживать, кто и когда добавил продукт на полку

-- Добавляем поля для отслеживания пользователя
ALTER TABLE products
ADD COLUMN IF NOT EXISTS added_by_user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS added_at TIMESTAMPTZ DEFAULT NOW();

-- Создаем индекс для быстрого поиска по пользователю, который добавил продукт
CREATE INDEX IF NOT EXISTS idx_products_added_by_user_id ON products(added_by_user_id);

-- Обновляем существующие записи, устанавливая added_by_user_id = user_id и added_at = created_at
UPDATE products
SET
    added_by_user_id = user_id,
    added_at = created_at
WHERE added_by_user_id IS NULL;

-- Создаем функцию для автоматического заполнения полей при создании продукта
CREATE OR REPLACE FUNCTION set_product_user_tracking()
RETURNS TRIGGER AS $$
BEGIN
    -- Если added_by_user_id не установлен, используем текущего пользователя
    IF NEW.added_by_user_id IS NULL THEN
        NEW.added_by_user_id = auth.uid();
    END IF;

    -- Если added_at не установлен, используем текущее время
    IF NEW.added_at IS NULL THEN
        NEW.added_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического заполнения полей
DROP TRIGGER IF EXISTS trigger_set_product_user_tracking ON products;
CREATE TRIGGER trigger_set_product_user_tracking
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION set_product_user_tracking();

-- Обновляем RLS политики для новых полей
-- Пользователи могут видеть информацию о том, кто добавил продукт
-- Но не могут изменять эти поля напрямую

-- Добавляем комментарии к полям
COMMENT ON COLUMN products.added_by_user_id IS 'ID пользователя, который добавил продукт на полку';
COMMENT ON COLUMN products.added_at IS 'Время добавления продукта на полку';
