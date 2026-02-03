#!/usr/bin/env python3
"""
Script de Mesclagem de Receitas
Combina o JSON atual (títulos melhores) com o novo JSON (ingredientes/instruções mais limpos)
"""

import json
import re
import sys
from difflib import SequenceMatcher

sys.stdout.reconfigure(encoding='utf-8')


def normalize_text(text):
    """Normaliza texto para comparação"""
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.lower().strip())


def normalize_title(title):
    """Normaliza título removendo caracteres especiais"""
    if not title:
        return ""
    # Remove caracteres especiais e normaliza
    normalized = re.sub(r'[^\w\s]', '', title.lower())
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return normalized


def similarity(a, b):
    """Calcula similaridade entre duas strings"""
    return SequenceMatcher(None, normalize_text(a), normalize_text(b)).ratio()


def get_ingredients_fingerprint(ingredients):
    """Cria fingerprint dos ingredientes para matching"""
    if not ingredients:
        return ""

    # Junta ingredientes se for lista
    if isinstance(ingredients, list):
        text = ' '.join(ingredients)
    else:
        text = str(ingredients)

    # Extrai palavras-chave (ingredientes principais)
    keywords = []
    important_words = [
        'farinha', 'aveia', 'banana', 'maçã', 'ovo', 'ovos', 'leite', 'coco',
        'amêndoa', 'amendoa', 'chocolate', 'cacau', 'morango', 'blueberry',
        'frango', 'carne', 'peixe', 'salmão', 'camarão', 'batata', 'abobrinha',
        'cenoura', 'espinafre', 'queijo', 'iogurte', 'mel', 'canela', 'baunilha',
        'limão', 'laranja', 'abacaxi', 'manga', 'hortelã', 'manjericão'
    ]

    text_lower = text.lower()
    for word in important_words:
        if word in text_lower:
            keywords.append(word)

    return ' '.join(sorted(keywords))


def find_best_match(recipe, candidates, threshold=0.5):
    """Encontra a melhor correspondência para uma receita"""
    best_match = None
    best_score = 0

    recipe_title = normalize_title(recipe.get('title', ''))
    recipe_fp = get_ingredients_fingerprint(recipe.get('ingredients', []))

    for candidate in candidates:
        # Calcula score baseado em título e ingredientes
        cand_title = normalize_title(candidate.get('title', ''))
        cand_fp = get_ingredients_fingerprint(candidate.get('ingredients', []))

        title_sim = similarity(recipe_title, cand_title)
        ing_sim = similarity(recipe_fp, cand_fp)

        # Score combinado (título tem peso maior)
        score = (title_sim * 0.6) + (ing_sim * 0.4)

        if score > best_score and score >= threshold:
            best_score = score
            best_match = candidate

    return best_match, best_score


def is_good_title(title):
    """Verifica se um título é de boa qualidade"""
    if not title or len(title) < 5:
        return False

    # Títulos ruins têm letras soltas ou padrões estranhos
    bad_patterns = [
        r'\b[A-Z][a-z]?\b',  # Letras soltas como "E" isolado
        r'Deav|Comblu|Deb Et|Defrutas|Eciaria|Deam En|Wafl Es',  # Palavras quebradas
        r'Ec Eitas|Esc Eitas',  # Padrões de parsing ruim
        r'\s[A-Z]\s',  # Letra maiúscula isolada
    ]

    for pattern in bad_patterns:
        if re.search(pattern, title):
            return False

    return True


def choose_best_title(old_title, new_title):
    """Escolhe o melhor título entre duas opções"""
    old_good = is_good_title(old_title)
    new_good = is_good_title(new_title)

    if old_good and not new_good:
        return old_title
    if new_good and not old_good:
        return new_title
    if old_good and new_good:
        # Ambos são bons, prefere o que tem formatação melhor
        # Título atual geralmente está em MAIÚSCULAS, novo em Title Case
        if old_title.isupper():
            return old_title.title()
        return old_title

    # Nenhum é bom, tenta limpar o antigo
    return old_title.title() if old_title else new_title


def clean_title(title):
    """Limpa e formata um título"""
    if not title:
        return ""

    # Remove padrões de lixo
    title = re.sub(r'\s+', ' ', title).strip()

    # Formata como Title Case
    title = title.title()

    # Corrige conectivos para minúsculas
    for word in [' De ', ' Do ', ' Da ', ' Dos ', ' Das ', ' Com ', ' Sem ', ' E ', ' Em ', ' Ao ', ' À ']:
        title = title.replace(word, word.lower())

    # Garante primeira letra maiúscula
    if title:
        title = title[0].upper() + title[1:]

    return title


def merge_recipe(old_recipe, new_recipe):
    """Mescla duas receitas pegando o melhor de cada uma"""
    merged = {}

    # Título: escolhe o melhor
    old_title = old_recipe.get('title', '')
    new_title = new_recipe.get('title', '') if new_recipe else ''
    merged['title'] = clean_title(choose_best_title(old_title, new_title))

    # File: mantém do antigo (categorização)
    merged['file'] = old_recipe.get('file', new_recipe.get('file', '') if new_recipe else '')

    # Metadados: prefere do novo (mais completo)
    if new_recipe and new_recipe.get('metadata', {}).get('time'):
        merged['metadata'] = new_recipe['metadata']
    else:
        merged['metadata'] = old_recipe.get('metadata', {})

    # Ingredientes: prefere do novo se existir e for melhor
    old_ingredients = old_recipe.get('ingredients', [])
    new_ingredients = new_recipe.get('ingredients', []) if new_recipe else []

    # Converte para lista se necessário
    if isinstance(old_ingredients, str):
        old_ingredients = [line.strip() for line in old_ingredients.split('\n') if line.strip()]
    if isinstance(new_ingredients, str):
        new_ingredients = [line.strip() for line in new_ingredients.split('\n') if line.strip()]

    # Escolhe o conjunto com menos problemas
    old_has_tabs = any('\t' in str(i) for i in old_ingredients)
    new_has_tabs = any('\t' in str(i) for i in new_ingredients)

    if new_ingredients and not new_has_tabs and (old_has_tabs or len(new_ingredients) >= len(old_ingredients) * 0.7):
        merged['ingredients'] = new_ingredients
    else:
        merged['ingredients'] = old_ingredients

    # Instruções: prefere do novo se existir e for melhor
    old_instructions = old_recipe.get('instructions', [])
    new_instructions = new_recipe.get('instructions', []) if new_recipe else []

    # Converte para lista se necessário
    if isinstance(old_instructions, str):
        old_instructions = [line.strip() for line in old_instructions.split('\n') if line.strip()]
    if isinstance(new_instructions, str):
        new_instructions = [line.strip() for line in new_instructions.split('\n') if line.strip()]

    # Escolhe o conjunto mais completo
    if new_instructions and len(new_instructions) >= len(old_instructions):
        merged['instructions'] = new_instructions
    else:
        merged['instructions'] = old_instructions

    return merged


def main():
    # Carrega os JSONs
    print("Carregando JSONs...")

    with open('src/data/recipes.json', 'r', encoding='utf-8') as f:
        old_recipes = json.load(f)

    with open('src/data/recipes_new.json', 'r', encoding='utf-8') as f:
        new_recipes = json.load(f)

    print(f"Receitas antigas: {len(old_recipes)}")
    print(f"Receitas novas: {len(new_recipes)}")

    # Agrupa receitas novas por arquivo para facilitar matching
    new_by_file = {}
    for recipe in new_recipes:
        file_key = recipe.get('file', 'unknown')
        if file_key not in new_by_file:
            new_by_file[file_key] = []
        new_by_file[file_key].append(recipe)

    # Mescla receitas
    merged_recipes = []
    matched_count = 0
    unmatched_count = 0

    for old_recipe in old_recipes:
        old_file = old_recipe.get('file', '')

        # Tenta encontrar correspondência no novo JSON
        candidates = new_by_file.get(old_file, []) + new_recipes  # Prioriza mesmo arquivo
        new_match, score = find_best_match(old_recipe, candidates)

        if new_match and score >= 0.4:
            merged = merge_recipe(old_recipe, new_match)
            matched_count += 1
        else:
            merged = merge_recipe(old_recipe, None)
            unmatched_count += 1

        merged_recipes.append(merged)

    # Adiciona receitas novas que não foram matched
    old_titles = set(normalize_title(r.get('title', '')) for r in old_recipes)

    for new_recipe in new_recipes:
        new_title_norm = normalize_title(new_recipe.get('title', ''))

        # Verifica se já existe
        if new_title_norm and new_title_norm not in old_titles:
            # Verifica se é uma receita válida
            if new_recipe.get('ingredients') and len(new_recipe.get('title', '')) > 5:
                merged = merge_recipe(new_recipe, None)
                merged_recipes.append(merged)

    print(f"\nResultado da mesclagem:")
    print(f"  Receitas com match: {matched_count}")
    print(f"  Receitas sem match: {unmatched_count}")
    print(f"  Total final: {len(merged_recipes)}")

    # Estatísticas de qualidade
    good_titles = sum(1 for r in merged_recipes if is_good_title(r.get('title', '')))
    with_metadata = sum(1 for r in merged_recipes if r.get('metadata', {}).get('time'))
    with_instructions = sum(1 for r in merged_recipes if r.get('instructions'))

    print(f"\nQualidade:")
    print(f"  Títulos bons: {good_titles} ({100*good_titles/len(merged_recipes):.1f}%)")
    print(f"  Com metadados: {with_metadata} ({100*with_metadata/len(merged_recipes):.1f}%)")
    print(f"  Com instruções: {with_instructions} ({100*with_instructions/len(merged_recipes):.1f}%)")

    # Salva o resultado
    output_path = 'src/data/recipes_merged.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged_recipes, f, ensure_ascii=False, indent=2)

    print(f"\nSalvo em: {output_path}")

    # Amostra
    print("\n=== AMOSTRA (5 receitas mescladas) ===")
    for recipe in merged_recipes[:5]:
        print(f"\nTítulo: {recipe['title']}")
        print(f"Metadados: {recipe.get('metadata', {})}")
        ings = recipe.get('ingredients', [])
        if isinstance(ings, list):
            print(f"Ingredientes ({len(ings)}): {ings[:2]}...")
        insts = recipe.get('instructions', [])
        if isinstance(insts, list):
            print(f"Instruções ({len(insts)})")


if __name__ == '__main__':
    main()
