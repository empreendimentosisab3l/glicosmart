const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_DIR = 'C:\\Users\\Lucas\\Downloads\\720 Receitas Zero Açúcar e sem Glúten';
const OUTPUT_FILE = path.join(__dirname, '../src/data/recipes.json');
const DISCARD_LOG = path.join(__dirname, '../src/data/discarded_log.txt');

function cleanTitle(rawTitle) {
    if (!rawTitle) return null;
    let title = rawTitle.replace(/[0-9]/g, '').trim(); // Remove numbers

    // Fix "PANQUECAS PANQUECAS"
    // Split by tab or space
    // If we split by space, we might break composite titles "BOLO DE CENOURA" -> "BOLO" "DE" "CENOURA"
    // Heuristic: Check for repeated half
    const len = title.length;
    const mid = Math.floor(len / 2);
    // Be lenient with spacing
    const firstHalf = title.substring(0, mid).trim();
    const secondHalf = title.substring(len - firstHalf.length).trim();

    if (firstHalf.length > 3 && firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
        return firstHalf;
    }

    // Check for tab duplication
    const parts = title.split(/\t+/);
    if (parts.length > 1 && parts[0].trim() === parts[1].trim()) {
        return parts[0].trim();
    }

    return title;
}

async function extractRecipes() {
    const files = fs.readdirSync(PDF_DIR).filter(file => file.endsWith('.pdf'));
    let allRecipes = [];
    let discardedLog = [];

    console.log(`Found ${files.length} PDF files. Starting V2 Extraction...`);

    for (const file of files) {
        console.log(`Processing: ${file}`);
        const filePath = path.join(PDF_DIR, file);
        const dataBuffer = fs.readFileSync(filePath);

        try {
            const PDFParseClass = pdf.PDFParse || pdf.default?.PDFParse || pdf;
            if (typeof PDFParseClass !== 'function' && typeof PDFParseClass?.constructor !== 'function') {
                // Fallback for different environments
                throw new Error('PDF Driver Error');
            }

            const parser = new PDFParseClass({ data: dataBuffer });
            const data = await parser.getText();
            const text = data.text;

            // Split by "Licensed to" (Footer) - Consume rest of line to avoid residues
            const rawPages = text.split(/Licensed to Maria.*/i);

            rawPages.forEach((pageText, index) => {
                const pageId = `${file} - Page ${index}`;

                // 1. Basic Clean
                let lines = pageText.split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 0)
                    .filter(l => !l.match(/-- \d+ of \d+ --/))
                    .filter(l => !l.match(/Aviso Legal/i))
                    .filter(l => !l.match(/^\d+$/)) // Page numbers
                    .filter(l => !l.match(/^Jose dos Santos/i)) // Extra safety
                    .filter(l => !l.match(/^yun09863/i));

                if (lines.length < 5) {
                    discardedLog.push(`[${pageId}] Too short (probably Intro/Cover)`);
                    return;
                }

                const recipe = {
                    file: file,
                    ingredients: [],
                    instructions: [],
                    metadata: {}
                };

                // V4: Pure Content Classification (Ignore structure)
                let allLines = pageText.split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 0)
                    .filter(l => !l.match(/-- \d+ of \d+ --/))
                    .filter(l => !l.match(/Aviso Legal/i))
                    .filter(l => !l.match(/^\d+$/))
                    .filter(l => !l.match(/^Licensed to/i))
                    .filter(l => !l.match(/720 RECEITAS/i))
                    .filter(l => !l.match(/ZERO E GLÚTEN/i));

                let titleCandidates = [];

                for (let line of allLines) {
                    // 1. Metadata (High Confidence)
                    if (line.match(/^Dificuldade:/i)) { recipe.metadata.difficulty = line.split(':')[1]?.trim(); continue; }
                    if (line.match(/^Tempo de Preparo:/i)) { recipe.metadata.time = line.split(':')[1]?.trim(); continue; }
                    if (line.match(/^Rendimento:/i)) { recipe.metadata.yield = line.split(':')[1]?.trim(); continue; }

                    // 2. Ignore Labels
                    if (line.match(/^INGREDIENTES/i) || line.match(/^MODO DE PREPARO/i)) continue;

                    // 3. Classification
                    const isDigitStart = line.match(/^[\d½¼¾]/);
                    const isIngredKeyword = line.match(/^(Sal|Pimenta|Azeite|Óleo|Salsinha|Cebolinha|Coentro|Hortelã|Gengibre|Canela|Cravo|Noz-moscada|Vinagre|Limão|Adoçante|Xilitol|Eritritol|Farinha|Ovos|Leite|Água|Manteiga|Banha)/i);
                    const isInstructionKeyword = line.match(/^(Misture|Bata|Adicione|Leve|Asse|Sirva|Aqueça|Despeje|Unte|Cozinhe|Mexa|Retire|Deixe|Espere|Corte|Pique|Refogue|Coloque|Transfira|Decore|Forre|Modele)/i);
                    const upperRatio = (line.replace(/[^A-Z]/g, '').length) / (line.replace(/[^a-zA-Z]/g, '').length || 1);
                    const isAllUpper = upperRatio > 0.8 && line.length > 3;

                    if (isDigitStart || (isIngredKeyword && !isInstructionKeyword)) {
                        recipe.ingredients.push(line);
                    } else if (isInstructionKeyword) {
                        recipe.instructions.push(line);
                    } else if (isAllUpper && !isInstructionKeyword) {
                        // Likely Title
                        // Filter out garbage "COM" or "E"
                        if (line.length > 2 && !line.match(/^COM$/i) && !line.match(/^E$/i)) {
                            titleCandidates.push(line);
                        }
                    } else {
                        // Ambiguous Line
                        // If long and ends with period, likely instruction text (sentences)
                        if (line.length > 30 && line.match(/\.$/)) {
                            recipe.instructions.push(line);
                        } else if (recipe.instructions.length > 0) {
                            // If we already have instructions, assume this is part of them
                            recipe.instructions.push(line);
                        } else if (recipe.ingredients.length > 0) {
                            // If we have ingredients but no instructions yet, assume ingredient continuation
                            recipe.ingredients.push(line);
                        }
                    }
                }

                // Title Assembly
                if (titleCandidates.length > 0) {
                    const cleanCandidates = titleCandidates.filter(t => !t.match(/Jose dos Santos/i));
                    // Dedupe candidates (PANQUECAS, PANQUECAS)
                    const uniqueTitles = [...new Set(cleanCandidates.map(t => cleanTitle(t)))];
                    recipe.title = uniqueTitles.join(' ');
                }

                // Validation
                if (recipe.title && recipe.ingredients.length > 2) {
                    allRecipes.push(recipe);
                } else {
                    discardedLog.push(`[${pageId}] Failed Validation. Title: ${recipe.title}, Ingreds: ${recipe.ingredients.length}`);
                }
            });

        } catch (error) {
            console.error(`Error parsing ${file}:`, error);
        }
    }

    // Deduplicate
    const uniqueRecipes = allRecipes.filter((r, index, self) =>
        index === self.findIndex((t) => (
            t.title === r.title && r.title !== undefined
        ))
    );

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueRecipes, null, 2));
    fs.writeFileSync(DISCARD_LOG, discardedLog.join('\n'));

    console.log(`V2 COMPLETE.`);
    console.log(`Total PDF Pages Processed (approx): ${discardedLog.length + allRecipes.length}`);
    console.log(`Successful Recipes: ${uniqueRecipes.length}`);
    console.log(`Discarded Pages: ${discardedLog.length} (See src/data/discarded_log.txt)`);
}

extractRecipes();
