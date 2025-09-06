# 🔧 Настройка переменных окружения

## Проблема

Ошибка `Failed to construct 'URL': Invalid URL` возникает из-за неправильно настроенных переменных окружения Supabase.

## Решение

### 1. Получите данные из Supabase Dashboard

1. Зайдите в ваш проект на [supabase.com](https://supabase.com)
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - **Project URL** (например: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (длинная строка, начинающаяся с `eyJ...`)

### 2. Настройте локальные переменные (для разработки)

Создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=https://ваш-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-anon-key
```

### 3. Настройте переменные в Vercel

#### Вариант A: Через Vercel CLI

```bash
vercel env add VITE_SUPABASE_URL
# Введите ваш Supabase URL когда спросят

vercel env add VITE_SUPABASE_ANON_KEY
# Введите ваш Supabase anon key когда спросят
```

#### Вариант B: Через Vercel Dashboard

1. Зайдите в [Vercel Dashboard](https://vercel.com/med-vedis-projects/freezer-web/settings/environment-variables)
2. Добавьте переменные:
   - `VITE_SUPABASE_URL` = ваш Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = ваш Supabase anon key
3. Выберите все окружения (Production, Preview, Development)

### 4. Передеплойте проект

```bash
vercel --prod
```

## Проверка

После настройки переменных:

1. Откройте консоль браузера на вашем сайте
2. Должны появиться логи с переменными окружения
3. Ошибка `Invalid URL` должна исчезнуть

## Важно

- URL должен начинаться с `https://` и заканчиваться на `.supabase.co`
- Anon key должен быть длинной строкой, начинающейся с `eyJ`
- Не используйте кавычки в значениях переменных
