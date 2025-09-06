-- Исправление RLS политик для правильной изоляции данных пользователей
-- Этот скрипт пересоздает RLS политики для обеспечения правильной изоляции

-- Удаляем существующие политики
DROP POLICY IF EXISTS "Freezers: users can manage their freezers" ON public.freezers;
DROP POLICY IF EXISTS "Shelves: users can manage shelves in their freezers" ON public.shelves;
DROP POLICY IF EXISTS "Products: users can manage their products" ON public.products;

-- Пересоздаем политики с правильными настройками

-- Freezers: пользователи могут управлять только своими морозильными камерами
CREATE POLICY "Freezers: users can manage their freezers" ON public.freezers
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Shelves: пользователи могут управлять полками только в своих морозильных камерах
CREATE POLICY "Shelves: users can manage shelves in their freezers" ON public.shelves
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.freezers f
            WHERE f.id = freezer_id
            AND f.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.freezers f
            WHERE f.id = freezer_id
            AND f.user_id = auth.uid()
        )
    );

-- Products: пользователи могут управлять только своими продуктами
CREATE POLICY "Products: users can manage their products" ON public.products
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Проверяем, что RLS включен
ALTER TABLE public.freezers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Проверяем результат
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename IN ('shelves', 'freezers', 'products')
AND schemaname = 'public'
ORDER BY tablename, policyname;
