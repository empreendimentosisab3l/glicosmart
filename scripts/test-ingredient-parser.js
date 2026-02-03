
const KNOWN_INGREDIENTS = [
    "Frango", "Peito de Frango", "Coxa de Frango", "Carne Moída", "Carne", "Picanha", "Alcatra",
    "Porco", "Lombo", "Bacon", "Linguiça", "Linguiça Calabresa", "Presunto",
    "Peixe", "Tilápia", "Salmão", "Atum", "Sardinha", "Camarão", "Bacalhau",
    "Ovo", "Ovos", "Clara de Ovo", "Gema",
    "Leite", "Leite Desnatado", "Leite Integral", "Leite de Coco", "Leite de Amêndoas", "Leite de Soja", "Leite em Pó",
    "Iogurte", "Iogurte Natural", "Iogurte Grego",
    "Queijo", "Queijo Muçarela", "Queijo Parmesão", "Queijo Minas", "Queijo Cottage", "Ricota", "Cream Cheese", "Requeijão",
    "Manteiga", "Manteiga Ghee", "Creme de Leite", "Nata",
    "Cebola", "Cebola Roxa", "Alho", "Alho-Poró",
    "Tomate", "Tomate Cereja", "Molho de Tomate", "Extrato de Tomate", "Passata de Tomate",
    "Cenoura", "Batata", "Batata Doce", "Batata Inglesa", "Batata Baroa", "Mandioquinha",
    "Abobrinha", "Abóbora", "Cabotiá", "Pepino", "Chuchu", "Berinjela",
    "Pimentão", "Pimentão Vermelho", "Pimentão Amarelo", "Pimentão Verde",
    "Brócolis", "Couve-Flor", "Couve", "Espinafre", "Alface", "Rúcula", "Repolho", "Acelga",
    "Beterraba", "Rabanete", "Nabo", "Vagem", "Quiabo", "Milho", "Ervilha", "Grão de Bico", "Feijão", "Lentilha",
    "Cogumelo", "Shimeji", "Shitake", "Champignon", "Palmito",
    "Limão", "Suco de Limão", "Raspas de Limão",
    "Laranja", "Suco de Laranja",
    "Banana", "Maçã", "Pera", "Uva", "Morango", "Abacaxi", "Manga", "Mamão", "Melancia", "Melão",
    "Abacate", "Coco", "Coco Ralado", "Água de Coco",
    "Maracujá", "Kiwi", "Ameixa", "Pêssego", "Caqui", "Goiaba",
    "Arroz", "Arroz Integral", "Arroz Branco",
    "Aveia", "Farinha de Aveia", "Farelo de Aveia", "Aveia em Flocos",
    "Farinha de Trigo", "Farinha de Trigo Integral",
    "Farinha de Amêndoas", "Farinha de Coco", "Farinha de Arroz", "Farinha de Linhaça",
    "Amido de Milho", "Polvilho", "Polvilho Doce", "Polvilho Azedo", "Tapioca",
    "Quinoa", "Chia", "Linhaça", "Gergelim",
    "Azeite", "Azeite de Oliva",
    "Óleo de Coco", "Óleo de Soja", "Óleo de Girassol", "Óleo de Canola",
    "Banha",
    "Sal", "Pimenta", "Pimenta do Reino", "Pimenta Caiena", "Pimenta Dedo de Moça",
    "Orégano", "Manjericão", "Salsinha", "Cebolinha", "Coentro", "Alecrim", "Tomilho", "Hortelã", "Louro",
    "Açafrão", "Cúrcuma", "Colorau", "Páprica", "Páprica Doce", "Páprica Defumada",
    "Cominho", "Noz-Moscada", "Canela", "Canela em Pó", "Cravo", "Gengibre", "Gengibre em Pó",
    "Vinagre", "Vinagre de Maçã", "Vinagre de Álcool", "Vinagre Balsâmico",
    "Shoyu", "Molho Inglês", "Mostarda", "Ketchup", "Maionese",
    "Açúcar", "Açúcar Demerara", "Açúcar Mascavo", "Açúcar de Coco",
    "Adoçante", "Xilitol", "Eritritol", "Stevia", "Mel", "Melado",
    "Fermento", "Fermento em Pó", "Fermento Biológico", "Bicarbonato de Sódio",
    "Cacau", "Cacau em Pó", "Chocolate", "Chocolate Amargo", "Chocolate em Pó",
    "Essência de Baunilha", "Extrato de Baunilha",
    "Água", "Gelo",
    "Amêndoas", "Castanha de Caju", "Castanha do Pará", "Nozes", "Amendoim", "Pasta de Amendoim",
    "Avelã", "Pistache"
];

// Sort matches longest first
const SORTED = [...KNOWN_INGREDIENTS].sort((a, b) => b.length - a.length);

function testParser(raw) {
    if (!raw || raw.trim().length === 0) return null;
    const text = raw.toLowerCase();

    for (const ingredient of SORTED) {
        // Create regex for whole word match
        const escaped = ingredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');

        if (regex.test(text)) {
            return ingredient;
        }
    }
    return null;
}

const testCases = [
    // Previous Good Cases
    "1 xícara de farinha de aveia",
    "2 ovos",
    "1/2 xícara de leite de amêndoas sem açúcar",
    "Sal a gosto",

    // User Reported Failures
    "Abobrinha em",
    "Abobrinhas",
    "Amassos os abacates com um",
    "Amêndoas queijo parmesão",
    "As mãos",
    "Azeite de",
    "Refogue a cebola e o alho até ficarem",
    "Tomilho seco",
    "Cabeça de couve-flor média em floretes",
    "Caseiro e sem sal)"
];

console.log("=== Running Whitelist Parser Simulation ===\n");

testCases.forEach(input => {
    const output = testParser(input);
    console.log(`Input:  "${input}"`);
    console.log(`Output: "${output}"`);
    console.log('---');
});
