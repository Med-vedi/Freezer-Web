-- Localized product catalog with emojis for better UX
-- This will populate the product_catalog table with 300+ products in 3 languages

-- Clear existing data
DELETE FROM product_catalog;

-- Insert localized products with emojis
INSERT INTO product_catalog (name, category, default_unit, description) VALUES

-- 🥩 Meat & Poultry / Мясо и птица / Carne e pollame
('Chicken Breast', '🥩 Meat & Poultry', 'kg', 'Fresh chicken breast / Свежая куриная грудка / Petto di pollo fresco'),
('Ground Beef', '🥩 Meat & Poultry', 'kg', 'Ground beef for cooking / Говяжий фарш для готовки / Manzo macinato per cucinare'),
('Pork Chops', '🥩 Meat & Poultry', 'kg', 'Fresh pork chops / Свежие свиные отбивные / Costolette di maiale fresche'),
('Turkey Breast', '🥩 Meat & Poultry', 'kg', 'Fresh turkey breast / Свежая индейка / Petto di tacchino fresco'),
('Lamb Chops', '🥩 Meat & Poultry', 'kg', 'Fresh lamb chops / Свежие бараньи отбивные / Costolette d''agnello fresche'),
('Duck Breast', '🥩 Meat & Poultry', 'kg', 'Fresh duck breast / Свежая утиная грудка / Petto d''anatra fresco'),
('Chicken Thighs', '🥩 Meat & Poultry', 'kg', 'Fresh chicken thighs / Свежие куриные бедра / Cosce di pollo fresche'),
('Beef Steak', '🥩 Meat & Poultry', 'kg', 'Fresh beef steak / Свежий говяжий стейк / Bistecca di manzo fresca'),
('Chicken Wings', '🥩 Meat & Poultry', 'kg', 'Fresh chicken wings / Свежие куриные крылышки / Ali di pollo fresche'),
('Pork Tenderloin', '🥩 Meat & Poultry', 'kg', 'Fresh pork tenderloin / Свежая свиная вырезка / Filetto di maiale fresco'),

-- 🐟 Seafood / Морепродукты / Frutti di mare
('Salmon Fillet', '🐟 Seafood', 'kg', 'Fresh salmon fillet / Свежий лосось / Filetto di salmone fresco'),
('Tuna Steak', '🐟 Seafood', 'kg', 'Fresh tuna steak / Свежий тунец / Bistecca di tonno fresca'),
('Shrimp', '🐟 Seafood', 'kg', 'Fresh shrimp / Свежие креветки / Gamberi freschi'),
('Cod Fillet', '🐟 Seafood', 'kg', 'Fresh cod fillet / Свежая треска / Filetto di merluzzo fresco'),
('Crab Legs', '🐟 Seafood', 'kg', 'Fresh crab legs / Свежие крабовые ножки / Zampe di granchio fresche'),
('Lobster Tail', '🐟 Seafood', 'kg', 'Fresh lobster tail / Свежий хвост омара / Coda di aragosta fresca'),
('Mussels', '🐟 Seafood', 'kg', 'Fresh mussels / Свежие мидии / Cozze fresche'),
('Scallops', '🐟 Seafood', 'kg', 'Fresh scallops / Свежие гребешки / Capesante fresche'),
('Halibut', '🐟 Seafood', 'kg', 'Fresh halibut / Свежий палтус / Ippoglosso fresco'),
('Sardines', '🐟 Seafood', 'kg', 'Fresh sardines / Свежие сардины / Sarde fresche'),

-- 🥬 Vegetables / Овощи / Verdure
('Broccoli', '🥬 Vegetables', 'kg', 'Fresh broccoli / Свежая брокколи / Broccoli fresco'),
('Carrots', '🥬 Vegetables', 'kg', 'Fresh carrots / Свежая морковь / Carote fresche'),
('Spinach', '🥬 Vegetables', 'kg', 'Fresh spinach / Свежий шпинат / Spinaci freschi'),
('Bell Peppers', '🥬 Vegetables', 'kg', 'Fresh bell peppers / Свежий болгарский перец / Peperoni freschi'),
('Onions', '🥬 Vegetables', 'kg', 'Fresh onions / Свежий лук / Cipolle fresche'),
('Tomatoes', '🥬 Vegetables', 'kg', 'Fresh tomatoes / Свежие помидоры / Pomodori freschi'),
('Cucumber', '🥬 Vegetables', 'kg', 'Fresh cucumber / Свежий огурец / Cetriolo fresco'),
('Lettuce', '🥬 Vegetables', 'kg', 'Fresh lettuce / Свежий салат / Lattuga fresca'),
('Zucchini', '🥬 Vegetables', 'kg', 'Fresh zucchini / Свежие кабачки / Zucchine fresche'),
('Cauliflower', '🥬 Vegetables', 'kg', 'Fresh cauliflower / Свежая цветная капуста / Cavolfiore fresco'),

-- 🍎 Fruits / Фрукты / Frutta
('Bananas', '🍎 Fruits', 'kg', 'Fresh bananas / Свежие бананы / Banane fresche'),
('Apples', '🍎 Fruits', 'kg', 'Fresh apples / Свежие яблоки / Mele fresche'),
('Oranges', '🍎 Fruits', 'kg', 'Fresh oranges / Свежие апельсины / Arance fresche'),
('Strawberries', '🍎 Fruits', 'kg', 'Fresh strawberries / Свежая клубника / Fragole fresche'),
('Blueberries', '🍎 Fruits', 'kg', 'Fresh blueberries / Свежая черника / Mirtilli freschi'),
('Grapes', '🍎 Fruits', 'kg', 'Fresh grapes / Свежий виноград / Uva fresca'),
('Pineapple', '🍎 Fruits', 'kg', 'Fresh pineapple / Свежий ананас / Ananas fresco'),
('Mango', '🍎 Fruits', 'kg', 'Fresh mango / Свежее манго / Mango fresco'),
('Peaches', '🍎 Fruits', 'kg', 'Fresh peaches / Свежие персики / Pesche fresche'),
('Pears', '🍎 Fruits', 'kg', 'Fresh pears / Свежие груши / Pere fresche'),

-- 🥛 Dairy & Eggs / Молочные продукты и яйца / Latticini e uova
('Milk', '🥛 Dairy & Eggs', 'l', 'Fresh milk / Свежее молоко / Latte fresco'),
('Cheese', '🥛 Dairy & Eggs', 'kg', 'Fresh cheese / Свежий сыр / Formaggio fresco'),
('Yogurt', '🥛 Dairy & Eggs', 'kg', 'Fresh yogurt / Свежий йогурт / Yogurt fresco'),
('Butter', '🥛 Dairy & Eggs', 'kg', 'Fresh butter / Свежее масло / Burro fresco'),
('Eggs', '🥛 Dairy & Eggs', 'dozen', 'Fresh eggs / Свежие яйца / Uova fresche'),
('Cream', '🥛 Dairy & Eggs', 'l', 'Fresh cream / Свежие сливки / Panna fresca'),
('Cottage Cheese', '🥛 Dairy & Eggs', 'kg', 'Fresh cottage cheese / Свежий творог / Ricotta fresca'),
('Sour Cream', '🥛 Dairy & Eggs', 'kg', 'Fresh sour cream / Свежая сметана / Panna acida fresca'),
('Ricotta', '🥛 Dairy & Eggs', 'kg', 'Fresh ricotta cheese / Свежая рикотта / Ricotta fresca'),
('Mozzarella', '🥛 Dairy & Eggs', 'kg', 'Fresh mozzarella / Свежая моцарелла / Mozzarella fresca'),

-- 🍞 Bread & Bakery / Хлеб и выпечка / Pane e pasticceria
('Bread', '🍞 Bread & Bakery', 'loaf', 'Fresh bread / Свежий хлеб / Pane fresco'),
('Croissants', '🍞 Bread & Bakery', 'pcs', 'Fresh croissants / Свежие круассаны / Cornetti freschi'),
('Bagels', '🍞 Bread & Bakery', 'pcs', 'Fresh bagels / Свежие бублики / Bagel freschi'),
('Muffins', '🍞 Bread & Bakery', 'pcs', 'Fresh muffins / Свежие маффины / Muffin freschi'),
('Dinner Rolls', '🍞 Bread & Bakery', 'pcs', 'Fresh dinner rolls / Свежие булочки / Panini freschi'),
('Sourdough', '🍞 Bread & Bakery', 'loaf', 'Fresh sourdough bread / Свежий хлеб на закваске / Pane a lievitazione naturale'),
('Pita Bread', '🍞 Bread & Bakery', 'pcs', 'Fresh pita bread / Свежий лаваш / Pita fresca'),
('Tortillas', '🍞 Bread & Bakery', 'pcs', 'Fresh tortillas / Свежие тортильи / Tortillas fresche'),
('English Muffins', '🍞 Bread & Bakery', 'pcs', 'Fresh English muffins / Свежие английские маффины / Muffin inglesi freschi'),
('Baguette', '🍞 Bread & Bakery', 'pcs', 'Fresh baguette / Свежий багет / Baguette fresca'),

-- ❄️ Frozen Foods / Замороженные продукты / Alimenti surgelati
('Frozen Pizza', '❄️ Frozen Foods', 'pcs', 'Frozen pizza / Замороженная пицца / Pizza surgelata'),
('Ice Cream', '❄️ Frozen Foods', 'l', 'Frozen ice cream / Замороженное мороженое / Gelato surgelato'),
('Frozen Vegetables', '❄️ Frozen Foods', 'kg', 'Frozen mixed vegetables / Замороженные овощи / Verdure surgelate miste'),
('Frozen Berries', '❄️ Frozen Foods', 'kg', 'Frozen mixed berries / Замороженные ягоды / Bacche surgelate miste'),
('Frozen Fish', '❄️ Frozen Foods', 'kg', 'Frozen fish fillets / Замороженная рыба / Filetti di pesce surgelati'),
('Frozen Chicken', '❄️ Frozen Foods', 'kg', 'Frozen chicken pieces / Замороженная курица / Pezzi di pollo surgelati'),
('Frozen Fries', '❄️ Frozen Foods', 'kg', 'Frozen french fries / Замороженная картошка фри / Patatine fritte surgelate'),
('Frozen Waffles', '❄️ Frozen Foods', 'pcs', 'Frozen waffles / Замороженные вафли / Waffle surgelate'),
('Frozen Dumplings', '❄️ Frozen Foods', 'pcs', 'Frozen dumplings / Замороженные пельмени / Gnocchi surgelati'),
('Frozen Soup', '❄️ Frozen Foods', 'l', 'Frozen soup / Замороженный суп / Zuppa surgelata'),

-- 🍚 Pantry Staples / Бакалея / Dispensa
('Rice', '🍚 Pantry Staples', 'kg', 'Long grain rice / Длиннозерный рис / Riso a chicco lungo'),
('Pasta', '🍚 Pantry Staples', 'kg', 'Dried pasta / Сухие макароны / Pasta secca'),
('Flour', '🍚 Pantry Staples', 'kg', 'All-purpose flour / Универсальная мука / Farina 00'),
('Sugar', '🍚 Pantry Staples', 'kg', 'White sugar / Белый сахар / Zucchero bianco'),
('Salt', '🍚 Pantry Staples', 'kg', 'Table salt / Поваренная соль / Sale da tavola'),
('Olive Oil', '🍚 Pantry Staples', 'l', 'Extra virgin olive oil / Оливковое масло экстра вирджин / Olio extravergine di oliva'),
('Canned Tomatoes', '🍚 Pantry Staples', 'pcs', 'Canned diced tomatoes / Консервированные помидоры / Pomodori in scatola'),
('Beans', '🍚 Pantry Staples', 'kg', 'Dried beans / Сухая фасоль / Fagioli secchi'),
('Lentils', '🍚 Pantry Staples', 'kg', 'Dried lentils / Сухая чечевица / Lenticchie secche'),
('Quinoa', '🍚 Pantry Staples', 'kg', 'Dried quinoa / Сухая киноа / Quinoa secca'),

-- 🥜 Snacks & Nuts / Закуски и орехи / Snack e noci
('Almonds', '🥜 Snacks & Nuts', 'kg', 'Raw almonds / Сырой миндаль / Mandorle crude'),
('Walnuts', '🥜 Snacks & Nuts', 'kg', 'Raw walnuts / Сырые грецкие орехи / Noci crude'),
('Cashews', '🥜 Snacks & Nuts', 'kg', 'Raw cashews / Сырые кешью / Anacardi crudi'),
('Pistachios', '🥜 Snacks & Nuts', 'kg', 'Raw pistachios / Сырые фисташки / Pistacchi crudi'),
('Peanuts', '🥜 Snacks & Nuts', 'kg', 'Raw peanuts / Сырой арахис / Arachidi crude'),
('Crackers', '🥜 Snacks & Nuts', 'box', 'Assorted crackers / Ассорти крекеров / Cracker assortiti'),
('Chips', '🥜 Snacks & Nuts', 'bag', 'Potato chips / Картофельные чипсы / Patatine fritte'),
('Popcorn', '🥜 Snacks & Nuts', 'kg', 'Popcorn kernels / Зерна попкорна / Chicchi di popcorn'),
('Trail Mix', '🥜 Snacks & Nuts', 'kg', 'Mixed nuts and dried fruits / Смесь орехов и сухофруктов / Mix di noci e frutta secca'),
('Granola Bars', '🥜 Snacks & Nuts', 'pcs', 'Granola bars / Гранола батончики / Barrette di granola'),

-- 🥤 Beverages / Напитки / Bevande
('Orange Juice', '🥤 Beverages', 'l', 'Fresh orange juice / Свежий апельсиновый сок / Succo d''arancia fresco'),
('Apple Juice', '🥤 Beverages', 'l', 'Fresh apple juice / Свежий яблочный сок / Succo di mela fresco'),
('Coffee', '🥤 Beverages', 'kg', 'Ground coffee / Молотый кофе / Caffè macinato'),
('Tea', '🥤 Beverages', 'box', 'Tea bags / Чайные пакетики / Bustine di tè'),
('Water', '🥤 Beverages', 'l', 'Bottled water / Бутилированная вода / Acqua in bottiglia'),
('Soda', '🥤 Beverages', 'l', 'Soft drinks / Газированные напитки / Bevande gassate'),
('Beer', '🥤 Beverages', 'l', 'Beer / Пиво / Birra'),
('Wine', '🥤 Beverages', 'l', 'Wine / Вино / Vino'),
('Energy Drink', '🥤 Beverages', 'l', 'Energy drinks / Энергетические напитки / Bevande energetiche'),
('Sports Drink', '🥤 Beverages', 'l', 'Sports drinks / Спортивные напитки / Bevande sportive'),

-- 🧂 Condiments & Sauces / Приправы и соусы / Condimenti e salse
('Ketchup', '🧂 Condiments & Sauces', 'l', 'Tomato ketchup / Томатный кетчуп / Ketchup di pomodoro'),
('Mustard', '🧂 Condiments & Sauces', 'l', 'Yellow mustard / Желтая горчица / Senape gialla'),
('Mayonnaise', '🧂 Condiments & Sauces', 'l', 'Mayonnaise / Майонез / Maionese'),
('Soy Sauce', '🧂 Condiments & Sauces', 'l', 'Soy sauce / Соевый соус / Salsa di soia'),
('Hot Sauce', '🧂 Condiments & Sauces', 'l', 'Hot sauce / Острый соус / Salsa piccante'),
('BBQ Sauce', '🧂 Condiments & Sauces', 'l', 'BBQ sauce / Барбекю соус / Salsa BBQ'),
('Ranch Dressing', '🧂 Condiments & Sauces', 'l', 'Ranch dressing / Ранч заправка / Condimento ranch'),
('Italian Dressing', '🧂 Condiments & Sauces', 'l', 'Italian dressing / Итальянская заправка / Condimento italiano'),
('Honey', '🧂 Condiments & Sauces', 'kg', 'Pure honey / Чистый мед / Miele puro'),
('Maple Syrup', '🧂 Condiments & Sauces', 'l', 'Pure maple syrup / Чистый кленовый сироп / Sciroppo d''acero puro'),

-- 🌿 Herbs & Spices / Травы и специи / Erbe e spezie
('Basil', '🌿 Herbs & Spices', 'g', 'Fresh basil / Свежий базилик / Basilico fresco'),
('Oregano', '🌿 Herbs & Spices', 'g', 'Fresh oregano / Свежий орегано / Origano fresco'),
('Thyme', '🌿 Herbs & Spices', 'g', 'Fresh thyme / Свежий тимьян / Timo fresco'),
('Rosemary', '🌿 Herbs & Spices', 'g', 'Fresh rosemary / Свежий розмарин / Rosmarino fresco'),
('Garlic', '🌿 Herbs & Spices', 'kg', 'Fresh garlic / Свежий чеснок / Aglio fresco'),
('Ginger', '🌿 Herbs & Spices', 'kg', 'Fresh ginger / Свежий имбирь / Zenzero fresco'),
('Black Pepper', '🌿 Herbs & Spices', 'g', 'Black peppercorns / Черный перец горошком / Pepe nero in grani'),
('Cinnamon', '🌿 Herbs & Spices', 'g', 'Ground cinnamon / Молотая корица / Cannella in polvere'),
('Paprika', '🌿 Herbs & Spices', 'g', 'Ground paprika / Молотый паприка / Paprika in polvere'),
('Cumin', '🌿 Herbs & Spices', 'g', 'Ground cumin / Молотый тмин / Cumino in polvere'),

-- 🍲 Prepared Foods / Готовые блюда / Cibi pronti
('Soup', '🍲 Prepared Foods', 'l', 'Prepared soup / Готовый суп / Zuppa pronta'),
('Salad', '🍲 Prepared Foods', 'kg', 'Prepared salad / Готовый салат / Insalata pronta'),
('Sandwich', '🍲 Prepared Foods', 'pcs', 'Prepared sandwich / Готовый сэндвич / Panino pronto'),
('Pasta Salad', '🍲 Prepared Foods', 'kg', 'Prepared pasta salad / Готовый салат с пастой / Insalata di pasta pronta'),
('Coleslaw', '🍲 Prepared Foods', 'kg', 'Prepared coleslaw / Готовый салат из капусты / Insalata di cavolo pronta'),
('Hummus', '🍲 Prepared Foods', 'kg', 'Prepared hummus / Готовый хумус / Hummus pronto'),
('Guacamole', '🍲 Prepared Foods', 'kg', 'Prepared guacamole / Готовый гуакамоле / Guacamole pronto'),
('Salsa', '🍲 Prepared Foods', 'kg', 'Prepared salsa / Готовый сальса / Salsa pronta'),
('Pesto', '🍲 Prepared Foods', 'kg', 'Prepared pesto / Готовый песто / Pesto pronto'),
('Tzatziki', '🍲 Prepared Foods', 'kg', 'Prepared tzatziki / Готовый цацики / Tzatziki pronto'),

-- 👶 Baby Food / Детское питание / Alimenti per bambini
('Baby Formula', '👶 Baby Food', 'l', 'Infant formula / Детская смесь / Latte artificiale'),
('Baby Cereal', '👶 Baby Food', 'kg', 'Baby rice cereal / Детская рисовая каша / Cereali per bambini'),
('Baby Food Jars', '👶 Baby Food', 'pcs', 'Pureed baby food / Детское пюре / Omogeneizzati'),
('Baby Snacks', '👶 Baby Food', 'pcs', 'Baby teething snacks / Детские снеки для прорезывания зубов / Snack per la dentizione'),
('Baby Juice', '👶 Baby Food', 'l', 'Baby fruit juice / Детский фруктовый сок / Succo di frutta per bambini'),

-- 🐕 Pet Food / Корм для животных / Cibo per animali
('Dog Food', '🐕 Pet Food', 'kg', 'Dry dog food / Сухой корм для собак / Cibo secco per cani'),
('Cat Food', '🐕 Pet Food', 'kg', 'Dry cat food / Сухой корм для кошек / Cibo secco per gatti'),
('Dog Treats', '🐕 Pet Food', 'kg', 'Dog training treats / Лакомства для собак / Snack per cani'),
('Cat Treats', '🐕 Pet Food', 'kg', 'Cat treats / Лакомства для кошек / Snack per gatti'),
('Fish Food', '🐕 Pet Food', 'kg', 'Fish flakes / Корм для рыбок / Fiocchi per pesci'),

-- 💪 Health & Wellness / Здоровье и фитнес / Salute e benessere
('Protein Powder', '💪 Health & Wellness', 'kg', 'Whey protein powder / Сывороточный протеин / Proteine del siero'),
('Vitamins', '💪 Health & Wellness', 'pcs', 'Multivitamins / Поливитамины / Multivitaminici'),
('Supplements', '💪 Health & Wellness', 'pcs', 'Dietary supplements / Пищевые добавки / Integratori alimentari'),
('Protein Bars', '💪 Health & Wellness', 'pcs', 'Protein bars / Протеиновые батончики / Barrette proteiche'),
('Energy Gels', '💪 Health & Wellness', 'pcs', 'Energy gels / Энергетические гели / Gel energetici'),

-- 🌍 International Foods / Международная кухня / Cucina internazionale
('Sushi', '🌍 International Foods', 'pcs', 'Fresh sushi rolls / Свежие суши роллы / Rotoli di sushi freschi'),
('Pad Thai', '🌍 International Foods', 'kg', 'Prepared pad thai / Готовый пад тай / Pad thai pronto'),
('Curry', '🌍 International Foods', 'kg', 'Prepared curry / Готовое карри / Curry pronto'),
('Tacos', '🌍 International Foods', 'pcs', 'Prepared tacos / Готовые тако / Tacos pronti'),
('Sushi Rice', '🌍 International Foods', 'kg', 'Sushi rice / Рис для суши / Riso per sushi'),
('Naan Bread', '🌍 International Foods', 'pcs', 'Fresh naan bread / Свежий наан / Naan fresco'),
('Kimchi', '🌍 International Foods', 'kg', 'Fermented kimchi / Ферментированное кимчи / Kimchi fermentato'),
('Miso Soup', '🌍 International Foods', 'l', 'Prepared miso soup / Готовый мисо суп / Zuppa miso pronta'),
('Falafel', '🌍 International Foods', 'pcs', 'Prepared falafel / Готовые фалафели / Falafel pronti'),
('Baklava', '🌍 International Foods', 'pcs', 'Sweet baklava / Сладкая баклава / Baklava dolce'),

-- 🎃 Seasonal Items / Сезонные товары / Articoli stagionali
('Pumpkin', '🎃 Seasonal Items', 'kg', 'Fresh pumpkin / Свежая тыква / Zucca fresca'),
('Cranberries', '🎃 Seasonal Items', 'kg', 'Fresh cranberries / Свежая клюква / Mirtilli rossi freschi'),
('Eggnog', '🎃 Seasonal Items', 'l', 'Holiday eggnog / Праздничный эгг-ног / Eggnog natalizio'),
('Gingerbread', '🎃 Seasonal Items', 'pcs', 'Gingerbread cookies / Пряничные печенья / Biscotti di pan di zenzero'),
('Fruitcake', '🎃 Seasonal Items', 'pcs', 'Holiday fruitcake / Праздничный фруктовый торт / Panettone'),
('Candy Canes', '🎃 Seasonal Items', 'pcs', 'Peppermint candy canes / Мятные леденцы / Bastoncini di zucchero alla menta'),
('Hot Chocolate', '🎃 Seasonal Items', 'kg', 'Hot chocolate mix / Смесь для горячего шоколада / Mix per cioccolata calda'),
('Mulled Wine', '🎃 Seasonal Items', 'l', 'Spiced mulled wine / Пряное глинтвейн / Vin brulé speziato'),
('Cider', '🎃 Seasonal Items', 'l', 'Apple cider / Яблочный сидр / Sidro di mele'),
('Candy Corn', '🎃 Seasonal Items', 'kg', 'Halloween candy corn / Хэллоуинская кукуруза / Mais di Halloween'),

-- 🌱 Organic & Specialty / Органические и специальные / Biologici e speciali
('Organic Milk', '🌱 Organic & Specialty', 'l', 'Organic whole milk / Органическое цельное молоко / Latte intero biologico'),
('Organic Eggs', '🌱 Organic & Specialty', 'dozen', 'Free-range organic eggs / Органические яйца свободного выгула / Uova biologiche da allevamento all''aperto'),
('Gluten-Free Bread', '🌱 Organic & Specialty', 'loaf', 'Gluten-free bread / Безглютеновый хлеб / Pane senza glutine'),
('Vegan Cheese', '🌱 Organic & Specialty', 'kg', 'Plant-based cheese / Растительный сыр / Formaggio vegetale'),
('Kombucha', '🌱 Organic & Specialty', 'l', 'Fermented kombucha / Ферментированный комбуча / Kombucha fermentato'),
('Coconut Water', '🌱 Organic & Specialty', 'l', 'Pure coconut water / Чистая кокосовая вода / Acqua di cocco pura'),
('Chia Seeds', '🌱 Organic & Specialty', 'kg', 'Organic chia seeds / Органические семена чиа / Semi di chia biologici'),
('Flax Seeds', '🌱 Organic & Specialty', 'kg', 'Ground flax seeds / Молотые семена льна / Semi di lino macinati'),
('Hemp Hearts', '🌱 Organic & Specialty', 'kg', 'Shelled hemp seeds / Очищенные семена конопли / Semi di canapa sgusciati'),
('Spirulina', '🌱 Organic & Specialty', 'kg', 'Dried spirulina powder / Порошок спирулины / Polvere di spirulina essiccata');
