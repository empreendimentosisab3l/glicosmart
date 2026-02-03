#!/usr/bin/env python3
"""
Parser de Receitas - Extrai receitas dos PDFs "720 Receitas Zero Açúcar e sem Glúten"
Gera um arquivo JSON limpo para uso no aplicativo GlicoSmart

Suporta dois formatos de layout:
1. Layout de uma coluna (Café da Manhã, Sobremesas, etc)
2. Layout de duas colunas (Almoço, Jantar)
"""

import pdfplumber
import os
import sys
import json
import re
from pathlib import Path

# Força UTF-8
if sys.stdout:
    sys.stdout.reconfigure(encoding='utf-8')

# Dicionário de palavras comuns em receitas para segmentação de títulos
RECIPE_WORDS = [
    # Tipos de receitas
    'SANDUÍCHES', 'SANDUÍCHE', 'HAMBURGUERS', 'HAMBURGUER', 'HAMBURGER',
    'SMOOTHIES', 'SMOOTHIE', 'VITAMINAS', 'VITAMINA', 'BLUEBERRIES', 'BLUEBERRY',
    'FRAMBOESAS', 'FRAMBOESA', 'PANQUECAS', 'PANQUECA', 'OMELETES', 'OMELETE',
    'CUPCAKES', 'CUPCAKE', 'BROWNIES', 'BROWNIE', 'COOKIES', 'COOKIE',
    'ALMÔNDEGAS', 'ALMÔNDEGA', 'ALMONDEGA', 'ALMONDEGAS',
    'MUFFINS', 'MUFFIN', 'WAFFLES', 'WAFFLE', 'TAPIOCAS', 'TAPIOCA',
    'CREPES', 'CREPE', 'TORTAS', 'TORTA', 'BOLOS', 'BOLO',
    'PUDINS', 'PUDIM', 'MOUSSE', 'SORVETE', 'GELATINA', 'GELEIA',
    'PIZZAS', 'PIZZA', 'QUICHE', 'RISOTO', 'RISOTOS', 'LASANHA',
    'MACARRÃO', 'MASSAS', 'MASSA', 'WRAPS', 'WRAP', 'TOSTAS', 'TOSTA',
    'SALADAS', 'SALADA', 'SOPAS', 'SOPA', 'CALDOS', 'CALDO',
    'SUCOS', 'SUCO', 'MOLHOS', 'MOLHO', 'MAIONESE', 'PESTO',
    'TEMPEROS', 'TEMPERO', 'MINGAUS', 'MINGAU', 'GRANOLA',
    'PÃES', 'PÃO', 'IOGURTE', 'PEITO', 'FILÉ', 'FILE',

    # Carnes e proteínas
    'CHAMPIGNON', 'CHAMPIGNONS', 'CAMARÕES', 'CAMARÃO', 'BACALHAU',
    'FRANGO', 'SALMÃO', 'PEIXE', 'CARNE', 'PORCO', 'PERU', 'ATUM',
    'TILÁPIA', 'SARDINHA', 'LINGUIÇA', 'BACON', 'PRESUNTO',

    # Frutas
    'TANGERINA', 'TANGERINAS', 'MELANCIA', 'MELANCIAS',
    'ABACAXIS', 'ABACAXI', 'MORANGOS', 'MORANGO', 'BANANAS', 'BANANA',
    'LARANJAS', 'LARANJA', 'LIMÕES', 'LIMÃO', 'MAÇÃS', 'MAÇÃ',
    'MANGAS', 'MANGA', 'MAMÃO', 'MAMÕES', 'PÊSSEGO', 'PÊSSEGOS',
    'UVA', 'UVAS', 'MELÃO', 'MELÕES', 'KIWI', 'KIWIS',
    'ABACATE', 'ABACATES', 'CAQUI', 'CAQUIS', 'FIGO', 'FIGOS',
    'AMEIXA', 'AMEIXAS', 'PERA', 'PERAS', 'GOIABA', 'GOIABAS',
    'MARACUJÁ', 'MARACUJÁS', 'ACEROLA', 'ACEROLAS', 'AÇAÍ',
    'PITAYA', 'JABUTICABA', 'CAJU', 'CAJUS',

    # Vegetais
    'ESPINAFRES', 'ESPINAFRE', 'ABOBRINHAS', 'ABOBRINHA',
    'BERINJELA', 'BERINJELAS', 'CENOURAS', 'CENOURA',
    'BATATAS', 'BATATA', 'BRÓCOLIS', 'COUVE', 'COUVES',
    'ALFACES', 'ALFACE', 'TOMATES', 'TOMATE', 'CEBOLAS', 'CEBOLA',
    'ALHO', 'GENGIBRE', 'PEPINO', 'PEPINOS', 'PIMENTÃO', 'PIMENTÕES',
    'REPOLHO', 'RABANETE', 'BETERRABA', 'BETERRABAS',
    'ASPARGOS', 'ASPARGO', 'ALCACHOFRA', 'PALMITO',
    'ERVILHA', 'ERVILHAS', 'VAGEM', 'VAGENS',
    'MILHO', 'MANDIOCA', 'INHAME', 'CARÁ',

    # Ervas e temperos
    'MANJERICÃO', 'HORTELÃ', 'COENTRO', 'SALSA', 'SALSINHA',
    'CEBOLINHA', 'ORÉGANO', 'TOMILHO', 'ALECRIM', 'LOURO',
    'PÁPRICA', 'COMINHO', 'CURRY', 'AÇAFRÃO', 'MOSTARDA',
    'PIMENTA', 'PIMENTAS', 'ERVAS',

    # Castanhas e oleaginosas
    'CASTANHAS', 'CASTANHA', 'AMÊNDOAS', 'AMÊNDOA', 'AMENDOA',
    'NOZES', 'NOZ', 'AVELÃ', 'AVELÃS', 'PISTACHE', 'PISTACHES',
    'MACADÂMIA', 'PECÃ', 'PECÃS',

    # Doces e sabores
    'CHOCOLATE', 'CHOCOLATES', 'CACAU', 'CANELA', 'BAUNILHA',
    'MEL', 'CARAMELO', 'DOCE', 'DOCES', 'AMARGO', 'AMARGAS',

    # Laticínios
    'QUEIJOS', 'QUEIJO', 'RICOTA', 'COTTAGE', 'MUSSARELA',
    'PARMESÃO', 'CREAM', 'CHEESE', 'REQUEIJÃO',
    'LEITE', 'IOGURTE', 'MANTEIGA', 'CREME', 'NATA',
    'OVOS', 'OVO',

    # Grãos e cereais
    'QUINOA', 'QUINUA', 'AVEIA', 'ARROZ', 'MILHO',
    'CENTEIO', 'CEVADA', 'TRIGO', 'LINHAÇA', 'CHIA',
    'GERGELIM', 'GIRASSOL', 'ABÓBORA',

    # Leguminosas
    'FEIJÃO', 'FEIJÕES', 'LENTILHA', 'LENTILHAS', 'GRÃO', 'GRÃOS',
    'BICO', 'SOJA', 'EDAMAME',

    # Outros ingredientes
    'COCO', 'GOTAS', 'GOTA', 'PEDAÇOS', 'PEDAÇO', 'FATIAS', 'FATIA',
    'RASPAS', 'RASPA', 'RECHEIO', 'COBERTURA', 'CALDA', 'GAS',

    # Adjetivos
    'GRELHADO', 'GRELHADA', 'RECHEADO', 'RECHEADA',
    'CREMOSO', 'CREMOSA', 'CROCANTE', 'ASSADO', 'ASSADA',
    'FRITO', 'FRITA', 'COZIDO', 'COZIDA',
    'REFOGADO', 'REFOGADA', 'LIGHT', 'FIT', 'ZERO',
    'SALGADO', 'SALGADOS', 'INTEGRAL', 'INTEGRAIS',

    # Conectivos (por último)
    'ALHO', 'PORÓ', 'COM', 'SEM', 'DOS', 'DAS', 'DE', 'DO', 'DA', 'EM', 'AO', 'À', 'E',
]

RECIPE_WORDS = sorted(RECIPE_WORDS, key=len, reverse=True)


def remove_consecutive_duplicates(text):
    """Remove letras duplicadas consecutivas. Ex: 'PPAA' -> 'PA'"""
    result = []
    for i, char in enumerate(text):
        if i == 0 or char != text[i-1]:
            result.append(char)
    return ''.join(result)


def segment_title(raw_title):
    """Segmenta um título sem espaços em palavras conhecidas."""
    raw = raw_title.upper()
    result = []
    i = 0

    while i < len(raw):
        found = False
        for word in RECIPE_WORDS:
            if raw[i:].startswith(word):
                result.append(word)
                i += len(word)
                found = True
                break

        if not found:
            if result and len(result[-1]) < 15:
                result[-1] = result[-1] + raw[i]
            else:
                result.append(raw[i])
            i += 1

    text = ' '.join(result)
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.title()

    # Formata conectivos em minúsculas
    for word in ['De', 'Do', 'Da', 'Dos', 'Das', 'Com', 'Sem', 'E', 'Em', 'Ao', 'À']:
        text = re.sub(rf'\b{word}\b', word.lower(), text)

    if text:
        text = text[0].upper() + text[1:]

    return text


def clean_decorative_title(text_before_difficulty):
    """Limpa título decorativo do PDF."""
    lines = text_before_difficulty.split('\n')
    all_chars = []

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if '720' in line or 'RECEITAS' in line or 'CEITAS' in line:
            continue
        if 'Licensed' in line:
            continue
        if re.match(r'^\d+$', line):
            continue

        if re.match(r'^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÊ\s]+$', line):
            chars = line.replace(' ', '')
            all_chars.append(chars)

    if not all_chars:
        return None

    raw = ''.join(all_chars)
    raw = remove_consecutive_duplicates(raw)

    return segment_title(raw)


def merge_lines(lines, is_ingredient=False):
    """Junta linhas quebradas."""
    merged = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if is_ingredient:
            # Ingredientes: nova linha se começa com número/medida
            if re.match(r'^(\d|½|¼|¾|Uma|Um|Sal|Óleo|Água|Pitada)', line, re.IGNORECASE):
                merged.append(line)
            elif merged and line and line[0].islower():
                merged[-1] = merged[-1] + ' ' + line
            elif merged and merged[-1].rstrip().endswith(('sem', 'de', 'com', 'em', 'para')):
                merged[-1] = merged[-1] + ' ' + line
            else:
                merged.append(line)
        else:
            # Instruções: junta se começa com minúscula ou anterior não termina com pontuação
            if merged and line and line[0].islower():
                merged[-1] = merged[-1] + ' ' + line
            elif merged and merged[-1] and merged[-1][-1] not in '.!?':
                merged[-1] = merged[-1] + ' ' + line
            else:
                merged.append(line)

    return merged


def clean_text_lines(text, section_type='general'):
    """Limpa texto removendo lixo e retornando linhas."""
    lines = []
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
        if '720 RECEITAS' in line or '720 REC' in line:
            continue
        if 'CEITAS' == line:
            continue
        if 'Licensed to' in line:
            continue
        if 'ZERO E GLÚTEN' in line:
            continue
        if re.match(r'^\d+$', line):
            continue
        if re.match(r'^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÊ]{1,3}(\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÊ]{1,3})+$', line):
            continue
        if line.startswith('HP') or line.startswith('P2'):
            continue
        lines.append(line)
    return lines


def extract_recipe_single_column(text, file_name):
    """Extrai receita de layout de uma coluna."""
    recipe = {
        'title': '',
        'file': file_name,
        'metadata': {'difficulty': '', 'time': '', 'yield': ''},
        'ingredients': [],
        'instructions': []
    }

    # Título
    diff_pos = text.find('Dificuldade:')
    if diff_pos > 0:
        title = clean_decorative_title(text[:diff_pos])
        if title:
            recipe['title'] = title

    # Metadados
    diff_match = re.search(r'Dificuldade:\s*(Fácil|Médio|Difícil)', text, re.IGNORECASE)
    if diff_match:
        recipe['metadata']['difficulty'] = diff_match.group(1).title()

    time_match = re.search(r'Tempo de Preparo:\s*(\d+\s*[Mm]inutos?)', text)
    if time_match:
        recipe['metadata']['time'] = time_match.group(1)

    yield_match = re.search(r'Rendimento:\s*(.+?)(?:\n|INGREDIENTES)', text, re.DOTALL)
    if yield_match:
        recipe['metadata']['yield'] = yield_match.group(1).strip()

    # Ingredientes
    ing_match = re.search(r'INGREDIENTES\s*\n(.+?)MODO DE PREPARO', text, re.DOTALL)
    if ing_match:
        ing_lines = clean_text_lines(ing_match.group(1))
        recipe['ingredients'] = merge_lines(ing_lines, is_ingredient=True)

    # Instruções
    inst_match = re.search(r'MODO DE PREPARO:?\s*\n(.+?)(?:Dica:|Licensed to|$)', text, re.DOTALL)
    if inst_match:
        inst_lines = clean_text_lines(inst_match.group(1))
        recipe['instructions'] = merge_lines(inst_lines, is_ingredient=False)

    return recipe


def extract_recipe_two_columns(page, file_name):
    """Extrai receita de layout de duas colunas (ingredientes à esquerda, instruções à direita)."""
    recipe = {
        'title': '',
        'file': file_name,
        'metadata': {'difficulty': '', 'time': '', 'yield': ''},
        'ingredients': [],
        'instructions': []
    }

    # Dimensões
    width = page.width
    bbox = page.bbox

    # Extrai colunas
    left_page = page.crop((bbox[0], bbox[1], width/2, bbox[3]))
    right_page = page.crop((width/2, bbox[1], bbox[2], bbox[3]))

    left_text = left_page.extract_text() or ""
    right_text = right_page.extract_text() or ""

    # Título (da coluna esquerda, antes de Dificuldade)
    diff_pos = left_text.find('Dificuldade:')
    if diff_pos > 0:
        title = clean_decorative_title(left_text[:diff_pos])
        if title:
            recipe['title'] = title

    # Metadados (coluna esquerda)
    diff_match = re.search(r'Dificuldade:\s*(Fácil|Médio|Difícil)', left_text, re.IGNORECASE)
    if diff_match:
        recipe['metadata']['difficulty'] = diff_match.group(1).title()

    time_match = re.search(r'Tempo de Preparo:\s*(\d+\s*[Mm]inutos?)', left_text)
    if time_match:
        recipe['metadata']['time'] = time_match.group(1)

    yield_match = re.search(r'Rendimento:\s*(.+?)(?:\n|INGREDIENTES)', left_text, re.DOTALL)
    if yield_match:
        recipe['metadata']['yield'] = yield_match.group(1).strip()

    # Ingredientes (coluna esquerda, após INGREDIENTES)
    ing_match = re.search(r'INGREDIENTES[^\n]*\n(.+?)(?:Dica:|$)', left_text, re.DOTALL)
    if ing_match:
        ing_lines = clean_text_lines(ing_match.group(1))
        recipe['ingredients'] = merge_lines(ing_lines, is_ingredient=True)

    # Instruções (coluna direita, após MODO DE PREPARO)
    inst_match = re.search(r'MODO DE PREPARO[^\n]*\n(.+?)(?:$)', right_text, re.DOTALL)
    if inst_match:
        inst_lines = clean_text_lines(inst_match.group(1))
        recipe['instructions'] = merge_lines(inst_lines, is_ingredient=False)

    return recipe


def detect_layout(page):
    """Detecta se a página usa layout de uma ou duas colunas."""
    text = page.extract_text() or ""

    # Se tem "INGREDIENTES MODO" na mesma linha, é layout de duas colunas
    if 'INGREDIENTES MODO' in text or 'INGREDIENTES M' in text:
        return 'two_columns'

    # Se tem "MODO DE PREPARO" separado, é uma coluna
    if re.search(r'INGREDIENTES\s*\n', text) and re.search(r'MODO DE PREPARO', text):
        return 'single_column'

    return 'single_column'


def process_pdf(pdf_path):
    """Processa um arquivo PDF e extrai todas as receitas."""
    file_name = os.path.basename(pdf_path)
    print(f"Processando: {file_name}")

    recipes = []

    with pdfplumber.open(pdf_path) as pdf:
        # Verifica layout na primeira página com receita
        layout = 'single_column'
        for page in pdf.pages[2:5]:
            text = page.extract_text() or ""
            if 'Dificuldade:' in text:
                layout = detect_layout(page)
                break

        print(f"  Layout detectado: {layout}")

        if layout == 'two_columns':
            # Cada página é uma receita
            for page in pdf.pages:
                text = page.extract_text() or ""
                if 'Dificuldade:' not in text:
                    continue

                recipe = extract_recipe_two_columns(page, file_name)
                if recipe['title'] and recipe['ingredients']:
                    recipes.append(recipe)
        else:
            # Layout de uma coluna - extrai texto completo e divide por receitas
            all_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_text += text + "\n"

            # Divide por "Dificuldade:"
            boundaries = [m.start() for m in re.finditer(r'Dificuldade:\s*(?:Fácil|Médio|Difícil)', all_text, re.IGNORECASE)]

            for i, start in enumerate(boundaries):
                end = boundaries[i + 1] if i + 1 < len(boundaries) else len(all_text)
                context_start = max(0, start - 500)
                recipe_text = all_text[context_start:end]

                recipe = extract_recipe_single_column(recipe_text, file_name)
                if recipe['title'] and len(recipe['title']) > 3 and recipe['ingredients']:
                    recipes.append(recipe)

    print(f"  -> {len(recipes)} receitas extraídas")
    return recipes


def main():
    pdf_folder = r"C:\Users\Lucas\Downloads\720 Receitas Zero Açúcar e sem Glúten"
    output_folder = r"C:\Users\Lucas\Documents\App-receitas\app-receitas-next\src\data"

    all_recipes = []
    pdf_files = sorted([f for f in os.listdir(pdf_folder) if f.endswith('.pdf')])

    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_folder, pdf_file)
        recipes = process_pdf(pdf_path)
        all_recipes.extend(recipes)

    print(f"\nTotal de receitas: {len(all_recipes)}")

    # Salva JSON
    output_path = os.path.join(output_folder, 'recipes_new.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_recipes, f, ensure_ascii=False, indent=2)

    print(f"Salvo em: {output_path}")

    # Amostra
    print("\n=== AMOSTRA (5 receitas) ===")
    for recipe in all_recipes[:5]:
        print(f"\nTítulo: {recipe['title']}")
        print(f"Arquivo: {recipe['file']}")
        print(f"Metadados: {recipe['metadata']}")
        print(f"Ingredientes ({len(recipe['ingredients'])}): {recipe['ingredients'][:2]}...")
        print(f"Instruções ({len(recipe['instructions'])}): {recipe['instructions'][:1]}...")


if __name__ == '__main__':
    main()
