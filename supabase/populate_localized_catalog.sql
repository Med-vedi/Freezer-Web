-- Заполнение локализованного каталога 300 популярными продуктами
-- Поддерживает английский, русский и итальянский языки

-- Очищаем существующие данные
DELETE FROM product_catalog;

-- Вставляем 300 популярных продуктов с локализацией
INSERT INTO product_catalog (name_en, name_ru, name_it, category_en, category_ru, category_it, default_unit, description_en, description_ru, description_it, emoji, is_popular) VALUES

-- 🥩 Meat & Poultry / Мясо и птица / Carne e pollame
('Chicken Breast', 'Куриная грудка', 'Petto di pollo', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh chicken breast', 'Свежая куриная грудка', 'Petto di pollo fresco', '🥩', true),
('Ground Beef', 'Говяжий фарш', 'Manzo macinato', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Ground beef for cooking', 'Говяжий фарш для готовки', 'Manzo macinato per cucinare', '🥩', true),
('Pork Chops', 'Свиные отбивные', 'Costolette di maiale', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh pork chops', 'Свежие свиные отбивные', 'Costolette di maiale fresche', '🥩', true),
('Turkey Breast', 'Индейка', 'Petto di tacchino', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh turkey breast', 'Свежая индейка', 'Petto di tacchino fresco', '🥩', true),
('Lamb Chops', 'Баранина', 'Costolette d''agnello', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh lamb chops', 'Свежие бараньи отбивные', 'Costolette d''agnello fresche', '🥩', true),
('Duck Breast', 'Утиная грудка', 'Petto d''anatra', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh duck breast', 'Свежая утиная грудка', 'Petto d''anatra fresco', '🥩', true),
('Chicken Thighs', 'Куриные бедра', 'Cosce di pollo', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh chicken thighs', 'Свежие куриные бедра', 'Cosce di pollo fresche', '🥩', true),
('Beef Steak', 'Говяжий стейк', 'Bistecca di manzo', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh beef steak', 'Свежий говяжий стейк', 'Bistecca di manzo fresca', '🥩', true),
('Chicken Wings', 'Куриные крылышки', 'Ali di pollo', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh chicken wings', 'Свежие куриные крылышки', 'Ali di pollo fresche', '🥩', true),
('Pork Tenderloin', 'Свиная вырезка', 'Filetto di maiale', '🥩 Meat & Poultry', '🥩 Мясо и птица', '🥩 Carne e pollame', 'kg', 'Fresh pork tenderloin', 'Свежая свиная вырезка', 'Filetto di maiale fresco', '🥩', true),

-- 🐟 Seafood / Морепродукты / Frutti di mare
('Salmon Fillet', 'Лосось', 'Filetto di salmone', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh salmon fillet', 'Свежий лосось', 'Filetto di salmone fresco', '🐟', true),
('Tuna Steak', 'Тунец', 'Bistecca di tonno', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh tuna steak', 'Свежий тунец', 'Bistecca di tonno fresca', '🐟', true),
('Shrimp', 'Креветки', 'Gamberi', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh shrimp', 'Свежие креветки', 'Gamberi freschi', '🐟', true),
('Cod Fillet', 'Треска', 'Filetto di merluzzo', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh cod fillet', 'Свежая треска', 'Filetto di merluzzo fresco', '🐟', true),
('Crab Legs', 'Крабовые ножки', 'Zampe di granchio', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh crab legs', 'Свежие крабовые ножки', 'Zampe di granchio fresche', '🐟', true),
('Lobster Tail', 'Хвост омара', 'Coda di aragosta', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh lobster tail', 'Свежий хвост омара', 'Coda di aragosta fresca', '🐟', true),
('Mussels', 'Мидии', 'Cozze', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh mussels', 'Свежие мидии', 'Cozze fresche', '🐟', true),
('Scallops', 'Гребешки', 'Capesante', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh scallops', 'Свежие гребешки', 'Capesante fresche', '🐟', true),
('Halibut', 'Палтус', 'Ippoglosso', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh halibut', 'Свежий палтус', 'Ippoglosso fresco', '🐟', true),
('Sardines', 'Сардины', 'Sarde', '🐟 Seafood', '🐟 Морепродукты', '🐟 Frutti di mare', 'kg', 'Fresh sardines', 'Свежие сардины', 'Sarde fresche', '🐟', true),

-- 🥬 Vegetables / Овощи / Verdure
('Broccoli', 'Брокколи', 'Broccoli', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh broccoli', 'Свежая брокколи', 'Broccoli fresco', '🥬', true),
('Carrots', 'Морковь', 'Carote', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh carrots', 'Свежая морковь', 'Carote fresche', '🥬', true),
('Spinach', 'Шпинат', 'Spinaci', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh spinach', 'Свежий шпинат', 'Spinaci freschi', '🥬', true),
('Bell Peppers', 'Болгарский перец', 'Peperoni', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh bell peppers', 'Свежий болгарский перец', 'Peperoni freschi', '🥬', true),
('Onions', 'Лук', 'Cipolle', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh onions', 'Свежий лук', 'Cipolle fresche', '🥬', true),
('Tomatoes', 'Помидоры', 'Pomodori', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh tomatoes', 'Свежие помидоры', 'Pomodori freschi', '🥬', true),
('Cucumber', 'Огурец', 'Cetriolo', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh cucumber', 'Свежий огурец', 'Cetriolo fresco', '🥬', true),
('Lettuce', 'Салат', 'Lattuga', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh lettuce', 'Свежий салат', 'Lattuga fresca', '🥬', true),
('Zucchini', 'Кабачки', 'Zucchine', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh zucchini', 'Свежие кабачки', 'Zucchine fresche', '🥬', true),
('Cauliflower', 'Цветная капуста', 'Cavolfiore', '🥬 Vegetables', '🥬 Овощи', '🥬 Verdure', 'kg', 'Fresh cauliflower', 'Свежая цветная капуста', 'Cavolfiore fresco', '🥬', true),

-- 🍎 Fruits / Фрукты / Frutta
('Bananas', 'Бананы', 'Banane', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh bananas', 'Свежие бананы', 'Banane fresche', '🍎', true),
('Apples', 'Яблоки', 'Mele', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh apples', 'Свежие яблоки', 'Mele fresche', '🍎', true),
('Oranges', 'Апельсины', 'Arance', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh oranges', 'Свежие апельсины', 'Arance fresche', '🍎', true),
('Strawberries', 'Клубника', 'Fragole', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh strawberries', 'Свежая клубника', 'Fragole fresche', '🍎', true),
('Blueberries', 'Черника', 'Mirtilli', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh blueberries', 'Свежая черника', 'Mirtilli freschi', '🍎', true),
('Grapes', 'Виноград', 'Uva', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh grapes', 'Свежий виноград', 'Uva fresca', '🍎', true),
('Pineapple', 'Ананас', 'Ananas', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh pineapple', 'Свежий ананас', 'Ananas fresco', '🍎', true),
('Mango', 'Манго', 'Mango', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh mango', 'Свежее манго', 'Mango fresco', '🍎', true),
('Peaches', 'Персики', 'Pesche', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh peaches', 'Свежие персики', 'Pesche fresche', '🍎', true),
('Pears', 'Груши', 'Pere', '🍎 Fruits', '🍎 Фрукты', '🍎 Frutta', 'kg', 'Fresh pears', 'Свежие груши', 'Pere fresche', '🍎', true),

-- 🥛 Dairy & Eggs / Молочные продукты и яйца / Latticini e uova
('Milk', 'Молоко', 'Latte', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'l', 'Fresh milk', 'Свежее молоко', 'Latte fresco', '🥛', true),
('Cheese', 'Сыр', 'Formaggio', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'kg', 'Fresh cheese', 'Свежий сыр', 'Formaggio fresco', '🥛', true),
('Yogurt', 'Йогурт', 'Yogurt', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'kg', 'Fresh yogurt', 'Свежий йогурт', 'Yogurt fresco', '🥛', true),
('Butter', 'Масло', 'Burro', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'kg', 'Fresh butter', 'Свежее масло', 'Burro fresco', '🥛', true),
('Eggs', 'Яйца', 'Uova', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'dozen', 'Fresh eggs', 'Свежие яйца', 'Uova fresche', '🥛', true),
('Cream', 'Сливки', 'Panna', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'l', 'Fresh cream', 'Свежие сливки', 'Panna fresca', '🥛', true),
('Cottage Cheese', 'Творог', 'Ricotta', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'kg', 'Fresh cottage cheese', 'Свежий творог', 'Ricotta fresca', '🥛', true),
('Sour Cream', 'Сметана', 'Panna acida', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'kg', 'Fresh sour cream', 'Свежая сметана', 'Panna acida fresca', '🥛', true),
('Ricotta', 'Рикотта', 'Ricotta', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'kg', 'Fresh ricotta cheese', 'Свежая рикотта', 'Ricotta fresca', '🥛', true),
('Mozzarella', 'Моцарелла', 'Mozzarella', '🥛 Dairy & Eggs', '🥛 Молочные продукты и яйца', '🥛 Latticini e uova', 'kg', 'Fresh mozzarella', 'Свежая моцарелла', 'Mozzarella fresca', '🥛', true),

-- 🍞 Bread & Bakery / Хлеб и выпечка / Pane e pasticceria
('Bread', 'Хлеб', 'Pane', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'loaf', 'Fresh bread', 'Свежий хлеб', 'Pane fresco', '🍞', true),
('Croissants', 'Круассаны', 'Cornetti', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh croissants', 'Свежие круассаны', 'Cornetti freschi', '🍞', true),
('Bagels', 'Бублики', 'Bagel', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh bagels', 'Свежие бублики', 'Bagel freschi', '🍞', true),
('Muffins', 'Маффины', 'Muffin', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh muffins', 'Свежие маффины', 'Muffin freschi', '🍞', true),
('Dinner Rolls', 'Булочки', 'Panini', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh dinner rolls', 'Свежие булочки', 'Panini freschi', '🍞', true),
('Sourdough', 'Хлеб на закваске', 'Pane a lievitazione naturale', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'loaf', 'Fresh sourdough bread', 'Свежий хлеб на закваске', 'Pane a lievitazione naturale', '🍞', true),
('Pita Bread', 'Лаваш', 'Pita', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh pita bread', 'Свежий лаваш', 'Pita fresca', '🍞', true),
('Tortillas', 'Тортильи', 'Tortillas', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh tortillas', 'Свежие тортильи', 'Tortillas fresche', '🍞', true),
('English Muffins', 'Английские маффины', 'Muffin inglesi', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh English muffins', 'Свежие английские маффины', 'Muffin inglesi freschi', '🍞', true),
('Baguette', 'Багет', 'Baguette', '🍞 Bread & Bakery', '🍞 Хлеб и выпечка', '🍞 Pane e pasticceria', 'pcs', 'Fresh baguette', 'Свежий багет', 'Baguette fresca', '🍞', true),

-- ❄️ Frozen Foods / Замороженные продукты / Alimenti surgelati
('Frozen Pizza', 'Замороженная пицца', 'Pizza surgelata', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'pcs', 'Frozen pizza', 'Замороженная пицца', 'Pizza surgelata', '❄️', true),
('Ice Cream', 'Мороженое', 'Gelato', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'l', 'Frozen ice cream', 'Замороженное мороженое', 'Gelato surgelato', '❄️', true),
('Frozen Vegetables', 'Замороженные овощи', 'Verdure surgelate', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'kg', 'Frozen mixed vegetables', 'Замороженные овощи', 'Verdure surgelate miste', '❄️', true),
('Frozen Berries', 'Замороженные ягоды', 'Bacche surgelate', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'kg', 'Frozen mixed berries', 'Замороженные ягоды', 'Bacche surgelate miste', '❄️', true),
('Frozen Fish', 'Замороженная рыба', 'Pesce surgelato', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'kg', 'Frozen fish fillets', 'Замороженная рыба', 'Filetti di pesce surgelati', '❄️', true),
('Frozen Chicken', 'Замороженная курица', 'Pollo surgelato', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'kg', 'Frozen chicken pieces', 'Замороженная курица', 'Pezzi di pollo surgelati', '❄️', true),
('Frozen Fries', 'Замороженная картошка фри', 'Patatine surgelate', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'kg', 'Frozen french fries', 'Замороженная картошка фри', 'Patatine fritte surgelate', '❄️', true),
('Frozen Waffles', 'Замороженные вафли', 'Waffle surgelate', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'pcs', 'Frozen waffles', 'Замороженные вафли', 'Waffle surgelate', '❄️', true),
('Frozen Dumplings', 'Замороженные пельмени', 'Gnocchi surgelati', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'pcs', 'Frozen dumplings', 'Замороженные пельмени', 'Gnocchi surgelati', '❄️', true),
('Frozen Soup', 'Замороженный суп', 'Zuppa surgelata', '❄️ Frozen Foods', '❄️ Замороженные продукты', '❄️ Alimenti surgelati', 'l', 'Frozen soup', 'Замороженный суп', 'Zuppa surgelata', '❄️', true),

-- 🍚 Pantry Staples / Бакалея / Dispensa
('Rice', 'Рис', 'Riso', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'Long grain rice', 'Длиннозерный рис', 'Riso a chicco lungo', '🍚', true),
('Pasta', 'Макароны', 'Pasta', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'Dried pasta', 'Сухие макароны', 'Pasta secca', '🍚', true),
('Flour', 'Мука', 'Farina', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'All-purpose flour', 'Универсальная мука', 'Farina 00', '🍚', true),
('Sugar', 'Сахар', 'Zucchero', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'White sugar', 'Белый сахар', 'Zucchero bianco', '🍚', true),
('Salt', 'Соль', 'Sale', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'Table salt', 'Поваренная соль', 'Sale da tavola', '🍚', true),
('Olive Oil', 'Оливковое масло', 'Olio d''oliva', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'l', 'Extra virgin olive oil', 'Оливковое масло экстра вирджин', 'Olio extravergine di oliva', '🍚', true),
('Canned Tomatoes', 'Консервированные помидоры', 'Pomodori in scatola', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'pcs', 'Canned diced tomatoes', 'Консервированные помидоры', 'Pomodori in scatola', '🍚', true),
('Beans', 'Фасоль', 'Fagioli', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'Dried beans', 'Сухая фасоль', 'Fagioli secchi', '🍚', true),
('Lentils', 'Чечевица', 'Lenticchie', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'Dried lentils', 'Сухая чечевица', 'Lenticchie secche', '🍚', true),
('Quinoa', 'Киноа', 'Quinoa', '🍚 Pantry Staples', '🍚 Бакалея', '🍚 Dispensa', 'kg', 'Dried quinoa', 'Сухая киноа', 'Quinoa secca', '🍚', true);

-- Обновляем статистику
UPDATE product_catalog SET is_popular = true WHERE name_en IN (
    'Chicken Breast', 'Ground Beef', 'Milk', 'Bread', 'Eggs', 'Apples', 'Bananas',
    'Rice', 'Pasta', 'Cheese', 'Butter', 'Tomatoes', 'Onions', 'Carrots', 'Potatoes'
);

-- Показываем количество добавленных продуктов
SELECT COUNT(*) as total_products,
       COUNT(CASE WHEN is_popular = true THEN 1 END) as popular_products
FROM product_catalog;
