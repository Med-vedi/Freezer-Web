# Инструкции по применению функций загрузки продуктов

## ❌ Проблема

Функции `load_all_catalog_products` и `load_popular_products_only` не найдены в базе данных.

## ✅ Решение

### 1. Применить функции в Supabase

Выполните SQL скрипт в Supabase SQL Editor:

```sql
-- Скопируйте и выполните весь файл:
-- supabase/create_load_functions.sql
```

### 2. Проверить создание функций

После выполнения скрипта проверьте, что функции созданы:

```sql
-- Проверка функций
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('load_all_catalog_products', 'load_popular_products_only')
AND routine_schema = 'public';
```

### 3. Тестирование функций

```sql
-- Тест функции загрузки популярных продуктов
SELECT load_popular_products_only('your-user-id-here');

-- Тест функции загрузки всех продуктов
SELECT load_all_catalog_products('your-user-id-here');
```

## 📁 Файлы

- **`supabase/create_load_functions.sql`** - содержит функции для загрузки продуктов
- **`supabase/load_all_catalog_products.sql`** - полная версия (если нужна)

## 🚀 После применения

1. Функции будут доступны в Supabase
2. Приложение сможет вызывать `load_all_catalog_products` и `load_popular_products_only`
3. Пользователи смогут выбирать между загрузкой популярных или всех продуктов

## ⚠️ Важно

- Убедитесь, что каталог `product_catalog` заполнен данными
- Функции проверяют, что у пользователя нет существующих продуктов
- Продукты автоматически распределяются по полкам
