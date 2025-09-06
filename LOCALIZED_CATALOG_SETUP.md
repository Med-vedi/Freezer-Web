# Настройка локализованного каталога продуктов

## Обзор

Система теперь поддерживает локализованный каталог продуктов с 300+ популярными продуктами на 3 языках: итальянском (основной), русском и английском. Все запросы используют ID продуктов, а названия и категории отображаются на выбранном языке. По умолчанию используется итальянский язык.

## Структура базы данных

### Таблица product_catalog

```sql
CREATE TABLE product_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Локализованные названия
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    name_it TEXT NOT NULL,
    -- Локализованные категории
    category_en TEXT NOT NULL,
    category_ru TEXT NOT NULL,
    category_it TEXT NOT NULL,
    -- Метаданные
    default_unit TEXT NOT NULL DEFAULT 'pcs',
    description_en TEXT,
    description_ru TEXT,
    description_it TEXT,
    -- Дополнительные поля
    emoji TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Настройка

### 1. Выполните SQL скрипты

```sql
-- Создание таблицы и функций
\i supabase/create_localized_catalog.sql

-- Заполнение каталога продуктами
\i supabase/populate_300_products.sql
```

### 2. Проверьте данные

```sql
-- Количество продуктов
SELECT COUNT(*) FROM product_catalog;

-- Популярные продукты
SELECT COUNT(*) FROM product_catalog WHERE is_popular = true;

-- Категории на разных языках
SELECT DISTINCT category_en, category_ru, category_it FROM product_catalog;
```

## API функции

### Поиск продуктов

```sql
SELECT * FROM search_products_localized('pollo', 'it', '🥩 Carne e pollame', 20);
```

### Получение категорий

```sql
SELECT * FROM get_categories_localized('it');
```

### Популярные продукты

```sql
SELECT * FROM get_popular_products_localized('it', 10);
```

### Локализованные данные

```sql
SELECT get_localized_product_name('product-id', 'it');
SELECT get_localized_category('product-id', 'it');
```

## Использование в приложении

### CatalogStore

```typescript
const { searchCatalog, getCategories, getPopularProducts } = useCatalogStore();

// Поиск продуктов на итальянском языке (по умолчанию)
const results = await searchCatalog('pollo');

// Получение категорий на итальянском (по умолчанию)
const categories = await getCategories();

// Популярные продукты на итальянском (по умолчанию)
const popular = await getPopularProducts();

// Поиск на других языках
const resultsRu = await searchCatalog('курица', 'ru');
const resultsEn = await searchCatalog('chicken', 'en');
```

### Типы данных

```typescript
interface LocalizedProductCatalog {
  id: string;
  name: string; // Локализованное название
  category: string; // Локализованная категория
  default_unit: string;
  description?: string; // Локализованное описание
  emoji?: string;
  is_popular?: boolean;
  is_seasonal?: boolean;
}
```

## Категории продуктов

### 🥩 Carne e pollame / Мясо и птица / Meat & Poultry

- Petto di pollo, manzo macinato, costolette di maiale, tacchino, agnello и др.

### 🐟 Frutti di mare / Морепродукты / Seafood

- Salmone, tonno, gamberi, merluzzo, granchio, aragosta и др.

### 🥬 Verdure / Овощи / Vegetables

- Broccoli, carote, spinaci, peperoni, cipolle, pomodori и др.

### 🍎 Frutta / Фрукты / Fruits

- Banane, mele, arance, fragole, mirtilli, uva и др.

### 🥛 Latticini e uova / Молочные продукты / Dairy & Eggs

- Latte, formaggio, yogurt, burro, uova, panna и др.

### 🍞 Pane e pasticceria / Хлеб и выпечка / Bread & Bakery

- Pane, cornetti, bagel, muffin, panini и др.

### ❄️ Alimenti surgelati / Замороженные продукты / Frozen Foods

- Pizza surgelata, gelato, verdure surgelate и др.

### 🍚 Dispensa / Бакалея / Pantry Staples

- Riso, pasta, farina, zucchero, sale, olio d'oliva и др.

## Преимущества

1. **Производительность** - поиск по ID вместо текста
2. **Локализация** - полная поддержка 3 языков с итальянским как основным
3. **Масштабируемость** - легко добавить новые языки
4. **Гибкость** - эмодзи, популярные продукты, сезонные товары
5. **Поиск** - полнотекстовый поиск на любом языке
6. **UX** - итальянские названия по умолчанию для лучшего пользовательского опыта

## Добавление новых продуктов

```sql
INSERT INTO product_catalog (
    name_en, name_ru, name_it,
    category_en, category_ru, category_it,
    default_unit, description_en, description_ru, description_it,
    emoji, is_popular
) VALUES (
    'New Product', 'Новый продукт', 'Nuovo prodotto',
    '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame',
    'kg', 'Description', 'Описание', 'Descrizione',
    '🥩', true
);
```

## Обновление существующих продуктов

```sql
UPDATE product_catalog
SET name_ru = 'Новое название', description_ru = 'Новое описание'
WHERE id = 'product-id';
```

## Безопасность

- RLS политики защищают данные
- Только чтение для обычных пользователей
- Администраторы могут управлять каталогом
- Все функции проверяют права доступа
