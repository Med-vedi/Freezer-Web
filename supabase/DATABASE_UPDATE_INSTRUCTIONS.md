# Инструкции по обновлению базы данных

## Обзор

Этот документ содержит инструкции по обновлению базы данных для поддержки локализованного каталога продуктов с итальянским языком как основным.

## Шаги обновления

### 1. Применить обновления структуры базы данных

Выполните SQL скрипт `update_database.sql` в Supabase:

```sql
-- Выполните весь файл supabase/update_database.sql
```

Этот скрипт:

- ✅ Удаляет старую таблицу `product_catalog`
- ✅ Создает новую таблицу с поддержкой локализации (3 языка)
- ✅ Создает все необходимые индексы
- ✅ Настраивает RLS политики
- ✅ Создает локализованные функции
- ✅ Создает функции для начальных продуктов пользователей

### 2. Заполнить каталог продуктами

После применения структуры, заполните каталог 300+ продуктами:

```sql
-- Выполните файл supabase/populate_300_products.sql
```

### 3. Проверить работу функций

После заполнения каталога, проверьте работу функций:

```sql
-- Проверка поиска продуктов на итальянском
SELECT * FROM search_products_localized('pollo', 'it', NULL, 10);

-- Проверка категорий на итальянском
SELECT * FROM get_categories_localized('it');

-- Проверка популярных продуктов
SELECT * FROM get_popular_products_localized('it', 10);

-- Проверка локализованных данных
SELECT get_localized_product_name('product-id', 'it');
SELECT get_localized_category('product-id', 'it');
```

## Что изменилось

### Таблица product_catalog

**Старая структура:**

```sql
CREATE TABLE product_catalog (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    default_unit TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Новая структура:**

```sql
CREATE TABLE product_catalog (
    id UUID PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    name_it TEXT NOT NULL,
    category_en TEXT,
    category_ru TEXT,
    category_it TEXT,
    default_unit TEXT,
    description_en TEXT,
    description_ru TEXT,
    description_it TEXT,
    emoji TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Новые функции

1. **search_products_localized()** - поиск продуктов с локализацией
2. **get_categories_localized()** - получение категорий с локализацией
3. **get_popular_products_localized()** - популярные продукты с локализацией
4. **get_localized_product_name()** - локализованное название продукта
5. **get_localized_category()** - локализованная категория
6. **get_localized_description()** - локализованное описание
7. **create_initial_products_for_user()** - автоматическое создание начальных продуктов
8. **create_initial_products_manual()** - ручное создание начальных продуктов

### Автоматические функции

- **Триггер при регистрации** - автоматически создает морозильную камеру, полки и начальные продукты для новых пользователей
- **Ручное создание** - функция `create_initial_products_manual()` для существующих пользователей

## Проверка после обновления

### 1. Проверка структуры

```sql
-- Проверить структуру таблицы
\d product_catalog

-- Проверить индексы
\di product_catalog*

-- Проверить функции
\df search_products_localized
\df get_categories_localized
\df get_popular_products_localized
```

### 2. Проверка данных

```sql
-- Проверить количество продуктов в каталоге
SELECT COUNT(*) FROM product_catalog;

-- Проверить популярные продукты
SELECT COUNT(*) FROM product_catalog WHERE is_popular = true;

-- Проверить категории
SELECT DISTINCT category_it FROM product_catalog WHERE category_it IS NOT NULL;
```

### 3. Проверка функций

```sql
-- Тест поиска
SELECT * FROM search_products_localized('pollo', 'it', NULL, 5);

-- Тест категорий
SELECT * FROM get_categories_localized('it') LIMIT 10;

-- Тест популярных продуктов
SELECT * FROM get_popular_products_localized('it', 5);
```

## Откат изменений

Если нужно откатить изменения:

```sql
-- Удалить новые функции
DROP FUNCTION IF EXISTS search_products_localized(TEXT, TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_categories_localized(TEXT);
DROP FUNCTION IF EXISTS get_popular_products_localized(TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_localized_product_name(UUID, TEXT);
DROP FUNCTION IF EXISTS get_localized_category(UUID, TEXT);
DROP FUNCTION IF EXISTS get_localized_description(UUID, TEXT);
DROP FUNCTION IF EXISTS create_initial_products_for_user();
DROP FUNCTION IF EXISTS create_initial_products_manual(UUID);

-- Удалить триггеры
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_product_catalog_updated_at ON product_catalog;

-- Восстановить старую структуру product_catalog
-- (потребуется восстановить из резервной копии)
```

## Поддержка

После обновления базы данных:

1. ✅ Все существующие продукты пользователей останутся без изменений
2. ✅ Новые пользователи получат начальные продукты автоматически
3. ✅ Существующие пользователи могут создать начальные продукты через UI
4. ✅ Поиск и категории работают на итальянском языке по умолчанию
5. ✅ Поддерживаются все 3 языка (итальянский, русский, английский)

## Следующие шаги

1. Применить `update_database.sql`
2. Применить `populate_300_products.sql`
3. Протестировать функции
4. Обновить приложение (если нужно)
5. Протестировать полный функционал
