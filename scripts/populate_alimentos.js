const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../src/data/alimentos.json');

const foods = [
    // FRUTAS
    { name: "Abacate", category: "frutas", serving_size: "100g", net_carbs: 2, calories: 160, glycemic_index: 15, fiber: 7, protein: 2, fat: 15 },
    { name: "Abacaxi", category: "frutas", serving_size: "1 fatia (80g)", net_carbs: 11, calories: 48, glycemic_index: 59, fiber: 1.2, protein: 0.5, fat: 0.1 },
    { name: "Ameixa (Fresca)", category: "frutas", serving_size: "1 unidade (60g)", net_carbs: 7, calories: 30, glycemic_index: 35, fiber: 1, protein: 0.5, fat: 0.2 },
    { name: "Banana Prata", category: "frutas", serving_size: "1 unidade (70g)", net_carbs: 16, calories: 68, glycemic_index: 52, fiber: 1.4, protein: 0.9, fat: 0.2 },
    { name: "Banana Nanica (Madura)", category: "frutas", serving_size: "1 unidade (70g)", net_carbs: 18, calories: 75, glycemic_index: 60, fiber: 1.4, protein: 0.9, fat: 0.2 },
    { name: "Caqui", category: "frutas", serving_size: "1 unidade (100g)", net_carbs: 15, calories: 70, glycemic_index: 50, fiber: 2.5, protein: 0.6, fat: 0.2 },
    { name: "Cereja", category: "frutas", serving_size: "10 unidades (50g)", net_carbs: 8, calories: 32, glycemic_index: 22, fiber: 1, protein: 0.5, fat: 0.1 },
    { name: "Coco (Polpa)", category: "frutas", serving_size: "100g", net_carbs: 5, calories: 354, glycemic_index: 45, fiber: 9, protein: 3, fat: 33 },
    { name: "Goiaba", category: "frutas", serving_size: "1 unidade (100g)", net_carbs: 9, calories: 54, glycemic_index: 28, fiber: 5.4, protein: 1.3, fat: 0.5 },
    { name: "Kiwi", category: "frutas", serving_size: "1 unidade (70g)", net_carbs: 8, calories: 42, glycemic_index: 53, fiber: 2, protein: 0.8, fat: 0.4 },
    { name: "Laranja", category: "frutas", serving_size: "1 unidade (130g)", net_carbs: 12, calories: 62, glycemic_index: 43, fiber: 3.1, protein: 1.2, fat: 0.2 },
    { name: "Limão", category: "frutas", serving_size: "1 unidade (50g)", net_carbs: 3, calories: 15, glycemic_index: 20, fiber: 1.4, protein: 0.6, fat: 0.2 },
    { name: "Maçã", category: "frutas", serving_size: "1 unidade (130g)", net_carbs: 14, calories: 72, glycemic_index: 36, fiber: 2.6, protein: 0.3, fat: 0.2 },
    { name: "Mamão Papaia", category: "frutas", serving_size: "1/2 unidade (140g)", net_carbs: 13, calories: 60, glycemic_index: 56, fiber: 2.5, protein: 0.8, fat: 0.2 },
    { name: "Manga", category: "frutas", serving_size: "1/2 unidade (150g)", net_carbs: 22, calories: 90, glycemic_index: 51, fiber: 2.6, protein: 0.8, fat: 0.5 },
    { name: "Maracujá", category: "frutas", serving_size: "1 unidade (40g)", net_carbs: 4, calories: 25, glycemic_index: 30, fiber: 3, protein: 0.9, fat: 0.3 },
    { name: "Melancia", category: "frutas", serving_size: "1 fatia (200g)", net_carbs: 15, calories: 60, glycemic_index: 72, fiber: 0.8, protein: 1.2, fat: 0.4 },
    { name: "Melão", category: "frutas", serving_size: "1 fatia (150g)", net_carbs: 11, calories: 50, glycemic_index: 65, fiber: 1.2, protein: 1, fat: 0.2 },
    { name: "Morango", category: "frutas", serving_size: "1 xícara (150g)", net_carbs: 8, calories: 48, glycemic_index: 40, fiber: 3, protein: 1, fat: 0.5 },
    { name: "Pera", category: "frutas", serving_size: "1 unidade (130g)", net_carbs: 15, calories: 75, glycemic_index: 38, fiber: 4, protein: 0.5, fat: 0.3 },
    { name: "Pêssego", category: "frutas", serving_size: "1 unidade (100g)", net_carbs: 8, calories: 39, glycemic_index: 42, fiber: 1.5, protein: 0.9, fat: 0.3 },
    { name: "Uva (Verde/Rubi)", category: "frutas", serving_size: "10 unidades (50g)", net_carbs: 8, calories: 35, glycemic_index: 45, fiber: 0.5, protein: 0.4, fat: 0.1 },

    // VEGETAIS
    { name: "Abóbora Cabotiá", category: "vegetais", serving_size: "100g (cozida)", net_carbs: 7, calories: 40, glycemic_index: 64, fiber: 1.5, protein: 1.2, fat: 0.3 },
    { name: "Abobrinha", category: "vegetais", serving_size: "100g", net_carbs: 2, calories: 17, glycemic_index: 15, fiber: 1, protein: 1, fat: 0 },
    { name: "Alface", category: "vegetais", serving_size: "À vontade", net_carbs: 1, calories: 15, glycemic_index: 15, fiber: 1.3, protein: 1.4, fat: 0.2 },
    { name: "Alho Poró", category: "vegetais", serving_size: "100g", net_carbs: 12, calories: 61, glycemic_index: 15, fiber: 1.8, protein: 1.5, fat: 0.3 },
    { name: "Aspargos", category: "vegetais", serving_size: "5 unidades", net_carbs: 2, calories: 20, glycemic_index: 15, fiber: 2, protein: 2.2, fat: 0.1 },
    { name: "Batata Baroa (Mandioquinha)", category: "vegetais", serving_size: "100g (cozida)", net_carbs: 17, calories: 80, glycemic_index: 70, fiber: 1.8, protein: 0.9, fat: 0.2 },
    { name: "Batata Doce", category: "vegetais", serving_size: "100g (cozida)", net_carbs: 18, calories: 86, glycemic_index: 44, fiber: 3, protein: 1.6, fat: 0.1 },
    { name: "Batata Inglesa", category: "vegetais", serving_size: "100g (cozida)", net_carbs: 19, calories: 85, glycemic_index: 80, fiber: 1.6, protein: 1.8, fat: 0.1 },
    { name: "Berinjela", category: "vegetais", serving_size: "100g", net_carbs: 3, calories: 24, glycemic_index: 15, fiber: 2.5, protein: 1, fat: 0.2 },
    { name: "Beterraba", category: "vegetais", serving_size: "100g (cozida)", net_carbs: 8, calories: 44, glycemic_index: 64, fiber: 2, protein: 1.7, fat: 0.2 },
    { name: "Brócolis", category: "vegetais", serving_size: "100g", net_carbs: 4, calories: 34, glycemic_index: 10, fiber: 2.6, protein: 2.8, fat: 0.4 },
    { name: "Cenoura", category: "vegetais", serving_size: "100g (crua)", net_carbs: 7, calories: 41, glycemic_index: 47, fiber: 2.8, protein: 0.9, fat: 0.2 },
    { name: "Cenoura (Cozida)", category: "vegetais", serving_size: "100g", net_carbs: 7, calories: 45, glycemic_index: 85, fiber: 3, protein: 1, fat: 0.2 },
    { name: "Chuchu", category: "vegetais", serving_size: "100g (cozido)", net_carbs: 4, calories: 19, glycemic_index: 50, fiber: 1, protein: 0.6, fat: 0.1 },
    { name: "Couve-Flor", category: "vegetais", serving_size: "100g (cozida)", net_carbs: 2, calories: 23, glycemic_index: 15, fiber: 2.3, protein: 1.8, fat: 0.5 },
    { name: "Couve Manteiga", category: "vegetais", serving_size: "100g (refogada)", net_carbs: 5, calories: 90, glycemic_index: 15, fiber: 3.5, protein: 3, fat: 5 },
    { name: "Espinafre", category: "vegetais", serving_size: "1 xícara (cru)", net_carbs: 1, calories: 7, glycemic_index: 15, fiber: 0.7, protein: 0.9, fat: 0.1 },
    { name: "Inhame", category: "vegetais", serving_size: "100g (cozido)", net_carbs: 27, calories: 118, glycemic_index: 55, fiber: 4, protein: 1.5, fat: 0.2 },
    { name: "Mandioca (Aipim)", category: "vegetais", serving_size: "100g (cozido)", net_carbs: 30, calories: 125, glycemic_index: 75, fiber: 1.8, protein: 0.6, fat: 0.3 },
    { name: "Pepino", category: "vegetais", serving_size: "100g", net_carbs: 2, calories: 15, glycemic_index: 15, fiber: 0.5, protein: 0.7, fat: 0.1 },
    { name: "Pimentão", category: "vegetais", serving_size: "100g", net_carbs: 4, calories: 20, glycemic_index: 15, fiber: 1.7, protein: 0.9, fat: 0.2 },
    { name: "Quiabo", category: "vegetais", serving_size: "100g", net_carbs: 4, calories: 33, glycemic_index: 20, fiber: 3.2, protein: 1.9, fat: 0.2 },
    { name: "Repolho", category: "vegetais", serving_size: "100g", net_carbs: 3, calories: 25, glycemic_index: 15, fiber: 2, protein: 1.3, fat: 0.1 },
    { name: "Tomate", category: "vegetais", serving_size: "1 unidade (100g)", net_carbs: 3, calories: 18, glycemic_index: 15, fiber: 1.2, protein: 0.9, fat: 0.2 },
    { name: "Vagem", category: "vegetais", serving_size: "100g", net_carbs: 4, calories: 31, glycemic_index: 15, fiber: 2.7, protein: 1.8, fat: 0.2 },

    // GRÃOS E LEGUMINOSAS
    { name: "Arroz Branco", category: "graos_leguminosas", serving_size: "100g (cozido)", net_carbs: 28, calories: 130, glycemic_index: 72, fiber: 0.4, protein: 2.7, fat: 0.3 },
    { name: "Arroz Integral", category: "graos_leguminosas", serving_size: "100g (cozido)", net_carbs: 23, calories: 110, glycemic_index: 50, fiber: 1.8, protein: 2.6, fat: 0.9 },
    { name: "Aveia (Flocos)", category: "graos_leguminosas", serving_size: "30g", net_carbs: 17, calories: 104, glycemic_index: 55, fiber: 3, protein: 4.3, fat: 2.2 },
    { name: "Chia", category: "oleaginosas_sementes", serving_size: "1 col. sopa (15g)", net_carbs: 1, calories: 73, glycemic_index: 15, fiber: 5, protein: 2.5, fat: 4.5 },
    { name: "Ervilha", category: "graos_leguminosas", serving_size: "100g (cozida)", net_carbs: 10, calories: 81, glycemic_index: 48, fiber: 5, protein: 5.4, fat: 0.4 },
    { name: "Feijão Carioca", category: "graos_leguminosas", serving_size: "100g (cozido)", net_carbs: 13, calories: 76, glycemic_index: 35, fiber: 8, protein: 4.8, fat: 0.5 },
    { name: "Feijão Preto", category: "graos_leguminosas", serving_size: "100g (cozido)", net_carbs: 14, calories: 132, glycemic_index: 30, fiber: 8.7, protein: 8.8, fat: 0.5 },
    { name: "Grão de Bico", category: "graos_leguminosas", serving_size: "100g (cozido)", net_carbs: 27, calories: 164, glycemic_index: 33, fiber: 7.6, protein: 8.9, fat: 2.6 },
    { name: "Lentilha", category: "graos_leguminosas", serving_size: "100g (cozida)", net_carbs: 12, calories: 116, glycemic_index: 29, fiber: 7.9, protein: 9, fat: 0.4 },
    { name: "Milho Verde", category: "graos_leguminosas", serving_size: "100g", net_carbs: 17, calories: 96, glycemic_index: 52, fiber: 2.4, protein: 3.2, fat: 1.2 },
    { name: "Pão Branco", category: "graos_leguminosas", serving_size: "1 fatia (25g)", net_carbs: 12, calories: 67, glycemic_index: 75, fiber: 0.6, protein: 2, fat: 0.8 },
    { name: "Pão Integral", category: "graos_leguminosas", serving_size: "1 fatia (25g)", net_carbs: 10, calories: 65, glycemic_index: 50, fiber: 1.7, protein: 2.5, fat: 1.1 },
    { name: "Pipoca", category: "graos_leguminosas", serving_size: "1 xícara (estourada)", net_carbs: 6, calories: 31, glycemic_index: 65, fiber: 1.2, protein: 1, fat: 0.3 },
    { name: "Quinoa", category: "graos_leguminosas", serving_size: "100g (cozida)", net_carbs: 18, calories: 120, glycemic_index: 53, fiber: 2.8, protein: 4.4, fat: 1.9 },
    { name: "Tapioca", category: "graos_leguminosas", serving_size: "1 disco (60g)", net_carbs: 33, calories: 140, glycemic_index: 85, fiber: 0, protein: 0, fat: 0 },
    { name: "Trigo (Farinha)", category: "graos_leguminosas", serving_size: "100g", net_carbs: 73, calories: 364, glycemic_index: 85, fiber: 2.7, protein: 10, fat: 1 },

    // CARNES E PROTEÍNAS
    { name: "Alcatra", category: "carnes", serving_size: "100g (grelhada)", net_carbs: 0, calories: 240, glycemic_index: 0, fiber: 0, protein: 31, fat: 12 },
    { name: "Carne Moída (Patinho)", category: "carnes", serving_size: "100g", net_carbs: 0, calories: 219, glycemic_index: 0, fiber: 0, protein: 35, fat: 7 },
    { name: "Contrafilé", category: "carnes", serving_size: "100g (grelhado)", net_carbs: 0, calories: 270, glycemic_index: 0, fiber: 0, protein: 29, fat: 16 },
    { name: "Frango (Peito)", category: "carnes", serving_size: "100g (cozido)", net_carbs: 0, calories: 165, glycemic_index: 0, fiber: 0, protein: 31, fat: 3.6 },
    { name: "Frango (Sobrecoxa)", category: "carnes", serving_size: "100g (cozida)", net_carbs: 0, calories: 230, glycemic_index: 0, fiber: 0, protein: 24, fat: 14 },
    { name: "Porco (Lombo)", category: "carnes", serving_size: "100g (assado)", net_carbs: 0, calories: 160, glycemic_index: 0, fiber: 0, protein: 28, fat: 5 },
    { name: "Peixe (Salmão)", category: "frutos_do_mar", serving_size: "100g (grelhado)", net_carbs: 0, calories: 206, glycemic_index: 0, fiber: 0, protein: 22, fat: 12 },
    { name: "Peixe (Tilápia)", category: "frutos_do_mar", serving_size: "100g (assado)", net_carbs: 0, calories: 128, glycemic_index: 0, fiber: 0, protein: 26, fat: 2.7 },
    { name: "Camarão", category: "frutos_do_mar", serving_size: "100g (cozido)", net_carbs: 0, calories: 99, glycemic_index: 0, fiber: 0, protein: 24, fat: 0.3 },
    { name: "Bacon", category: "carnes", serving_size: "1 fatia (15g)", net_carbs: 0.2, calories: 80, glycemic_index: 0, fiber: 0, protein: 5, fat: 6 },
    { name: "Salsicha", category: "carnes", serving_size: "1 unidade (50g)", net_carbs: 2, calories: 150, glycemic_index: 28, fiber: 0, protein: 6, fat: 13 },

    // OVOS E LATICINIOS
    { name: "Ovo", category: "ovos_laticinios", serving_size: "1 unidade (50g)", net_carbs: 0.6, calories: 78, glycemic_index: 0, fiber: 0, protein: 6.3, fat: 5.3 },
    { name: "Clara de Ovo", category: "ovos_laticinios", serving_size: "1 unidade", net_carbs: 0.2, calories: 17, glycemic_index: 0, fiber: 0, protein: 3.6, fat: 0.1 },
    { name: "Iogurte Natural", category: "ovos_laticinios", serving_size: "1 pote (170g)", net_carbs: 12, calories: 100, glycemic_index: 27, fiber: 0, protein: 6, fat: 3 },
    { name: "Iogurte Grego", category: "ovos_laticinios", serving_size: "1 pote (100g)", net_carbs: 4, calories: 95, glycemic_index: 15, fiber: 0, protein: 10, fat: 5 },
    { name: "Leite Integral", category: "ovos_laticinios", serving_size: "1 copo (200ml)", net_carbs: 9, calories: 122, glycemic_index: 27, fiber: 0, protein: 6, fat: 6 },
    { name: "Leite Desnatado", category: "ovos_laticinios", serving_size: "1 copo (200ml)", net_carbs: 10, calories: 66, glycemic_index: 32, fiber: 0, protein: 6.5, fat: 0.2 },
    { name: "Leite de Amêndoas", category: "ovos_laticinios", serving_size: "1 copo (200ml)", net_carbs: 1, calories: 30, glycemic_index: 15, fiber: 1, protein: 1, fat: 2.5 },
    { name: "Manteiga", category: "ovos_laticinios", serving_size: "1 col. sopa (10g)", net_carbs: 0, calories: 72, glycemic_index: 0, fiber: 0, protein: 0.1, fat: 8.1 },
    { name: "Queijo Muçarela", category: "ovos_laticinios", serving_size: "1 fatia (30g)", net_carbs: 1, calories: 84, glycemic_index: 0, fiber: 0, protein: 6, fat: 6 },
    { name: "Queijo Minas Frescal", category: "ovos_laticinios", serving_size: "1 fatia (30g)", net_carbs: 1, calories: 65, glycemic_index: 0, fiber: 0, protein: 5, fat: 4.5 },
    { name: "Queijo Parmesão", category: "ovos_laticinios", serving_size: "1 col. sopa (15g)", net_carbs: 0.5, calories: 60, glycemic_index: 0, fiber: 0, protein: 5, fat: 4 },
    { name: "Requeijão", category: "ovos_laticinios", serving_size: "1 col. sopa (30g)", net_carbs: 1, calories: 75, glycemic_index: 0, fiber: 0, protein: 3, fat: 7 },

    // OLEAGINOSAS E OUTROS
    { name: "Amendoim", category: "oleaginosas_sementes", serving_size: "1 punhado (30g)", net_carbs: 4, calories: 170, glycemic_index: 15, fiber: 2.5, protein: 7, fat: 14 },
    { name: "Castanha de Caju", category: "oleaginosas_sementes", serving_size: "1 punhado (30g)", net_carbs: 9, calories: 165, glycemic_index: 25, fiber: 1, protein: 5, fat: 13 },
    { name: "Castanha do Pará", category: "oleaginosas_sementes", serving_size: "2 unidades (10g)", net_carbs: 1, calories: 65, glycemic_index: 15, fiber: 0.7, protein: 1.4, fat: 6.6 },
    { name: "Nozes", category: "oleaginosas_sementes", serving_size: "4 metades", net_carbs: 1, calories: 90, glycemic_index: 15, fiber: 1, protein: 2, fat: 9 },
    { name: "Azeite de Oliva", category: "oleaginosas_sementes", serving_size: "1 col. sopa (13ml)", net_carbs: 0, calories: 119, glycemic_index: 0, fiber: 0, protein: 0, fat: 13.5 },
    { name: "Mel", category: "acucares", serving_size: "1 col. sopa (20g)", net_carbs: 17, calories: 64, glycemic_index: 61, fiber: 0, protein: 0, fat: 0 },
    { name: "Açúcar Branco", category: "acucares", serving_size: "1 col. sopa (12g)", net_carbs: 12, calories: 48, glycemic_index: 65, fiber: 0, protein: 0, fat: 0 }
];

// Enrich with ID and GI Level
const enrichedFoods = foods.map((f, index) => {
    let level = 'low';
    if (f.glycemic_index >= 70) level = 'high';
    else if (f.glycemic_index >= 56) level = 'medium';

    return {
        id: index + 1,
        ...f,
        gi_level: level
    };
});

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enrichedFoods, null, 2));

console.log(`Successfully generated ${enrichedFoods.length} food items.`);
