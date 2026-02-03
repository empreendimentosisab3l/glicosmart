# Planejamento Landing Page - GlicoSmart

## Visão Geral

**Produto:** GlicoSmart — Plano Alimentar Inteligente para Diabéticos
**Preço:** R$ 29,90/mês (ou R$ 0,99/dia)
**Modelo:** Baseado na estrutura SoulSync + elementos visuais de apps de diabetes
**Tecnologia:** HTML + PHP + Tailwind CSS (CDN) + Payt One-Click

---

## Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde Esmeralda (Primary) | `#10B981` | CTAs, destaques, ícones |
| Verde Escuro | `#059669` | Gradientes, hover states |
| Teal | `#14B8A6` | Acentos, badges |
| Cinza Escuro | `#1F2937` | Textos principais |
| Cinza Claro | `#F9FAFB` | Backgrounds |
| Branco | `#FFFFFF` | Cards, containers |
| Vermelho (Header Urgência) | `#DC2626` | Header sticky de urgência |

---

## Estrutura da Página (Seções)

### 1. STICKY HEADER (Urgência)
**Cor de fundo:** Vermelho (#DC2626) ou Verde Escuro (#065F46)

**Elementos:**
- Timer regressivo (15:00 minutos)
- Texto: "AVISO: Não feche esta página! Oferta expira em XX:XX"
- Botão CTA: "COMEÇAR AGORA" (verde)

**Código do Timer:** JavaScript countdown 15 minutos

---

### 2. HERO SECTION

**Badge Superior:**
```
🍽️ Mais de 525 receitas para diabéticos
```

**Headline Principal:**
```
Controle seu diabetes com um
PLANO ALIMENTAR PERSONALIZADO
que você vai amar seguir.
```

**Subheadline:**
```
O método mais simples para estabilizar sua glicose,
emagrecer e comer com prazer — sem dietas restritivas.
```

**Imagem Hero:**
- Mockup do celular mostrando o app GlicoSmart
- Ou imagem similar à do medidor de glicose (GlucoWave) que você enviou
- Fundo roxo/gradiente com o app em destaque

**Card de Preço (Hero):**
```
┌─────────────────────────────────────┐
│   MELHOR PREÇO: R$ 0,99/DIA        │
├─────────────────────────────────────┤
│  PLANO MENSAL          R$ 29,90    │
│  ───────────────       ─────────   │
│  De R$ 97,00           por mês     │
│                                     │
│  🎁 Bônus: Lista de Compras        │
│     Semanal Automática             │
│                                     │
│  [✅ QUERO MEU PLANO AGORA]        │
│                                     │
│  Não, obrigado. Prefiro continuar  │
│  sem um plano alimentar.           │
└─────────────────────────────────────┘
```

---

### 3. PROBLEMA & DOR (Conexão Emocional)

**Headline:**
```
Você está cansado de...
```

**Cards de Dor (Grid 2x2):**

1. **Confusão Alimentar**
   - Ícone: 🤯
   - "Não saber o que pode ou não comer sem prejudicar sua glicose"

2. **Dietas Impossíveis**
   - Ícone: 🚫
   - "Seguir dietas restritivas que tiram todo prazer de comer"

3. **Picos de Glicose**
   - Ícone: 📈
   - "Ver sua glicose subir mesmo tentando se alimentar bem"

4. **Falta de Tempo**
   - Ícone: ⏰
   - "Não ter tempo para planejar refeições saudáveis todo dia"

---

### 4. SOLUÇÃO (Apresentação do App)

**Headline:**
```
Apresentamos o GlicoSmart
Seu assistente de alimentação para diabetes
```

**Subheadline:**
```
Um plano alimentar 100% personalizado baseado no seu tipo de
diabetes, preferências e objetivos.
```

**Mockup do App:**
- Screenshot do Dashboard mostrando:
  - "Olá, Usuário"
  - Sugestões do dia (Café, Almoço, Jantar)
  - Cards de receitas com calorias

---

### 5. FUNCIONALIDADES (Feature Showcase)

**Headline:**
```
Tudo que você precisa em um só lugar
```

**Cards de Funcionalidades (alternando imagem esquerda/direita):**

#### 5.1 Plano Semanal Automático
```
┌──────────────────────────────────────────────┐
│ [MOCKUP PLANO]  │  📅 Plano Semanal         │
│                 │  Automático                │
│                 │                            │
│                 │  7 dias de refeições       │
│                 │  planejadas automaticamente│
│                 │  com base no seu perfil.   │
│                 │                            │
│                 │  ✓ 4 refeições por dia     │
│                 │  ✓ Troque receitas fácil   │
│                 │  ✓ Lista de compras pronta │
└──────────────────────────────────────────────┘
```

#### 5.2 +525 Receitas Low Carb
```
┌──────────────────────────────────────────────┐
│ 🍳 Mais de 525 Receitas  │  [MOCKUP RECEITAS]│
│ Deliciosas               │                   │
│                          │                   │
│ Todas com índice         │                   │
│ glicêmico controlado     │                   │
│ e informações            │                   │
│ nutricionais completas.  │                   │
│                          │                   │
│ ✓ Café da manhã          │                   │
│ ✓ Almoço e jantar        │                   │
│ ✓ Lanches e sobremesas   │                   │
└──────────────────────────────────────────────┘
```

#### 5.3 Banco de Alimentos
```
┌──────────────────────────────────────────────┐
│ [MOCKUP ALIMENTOS] │ 🥗 Banco de Alimentos   │
│                    │ com Índice Glicêmico    │
│                    │                         │
│                    │ Consulte mais de 150    │
│                    │ alimentos e descubra    │
│                    │ quais são seguros para  │
│                    │ sua dieta.              │
│                    │                         │
│                    │ ✓ Filtro por categoria  │
│                    │ ✓ IG Baixo/Médio/Alto   │
│                    │ ✓ Compare alimentos     │
└──────────────────────────────────────────────┘
```

#### 5.4 Simulador de Glicose
```
┌──────────────────────────────────────────────┐
│ 📊 Acompanhe sua      │  [MOCKUP MEDIR]      │
│ Glicose               │                      │
│                       │                      │
│ Registre suas         │                      │
│ medições e acompanhe  │                      │
│ a evolução da sua     │                      │
│ glicose ao longo      │                      │
│ do tempo.             │                      │
│                       │                      │
│ ✓ Registros diários   │                      │
│ ✓ Histórico visual    │                      │
│ ✓ Alertas de níveis   │                      │
└──────────────────────────────────────────────┘
```

---

### 6. COMO FUNCIONA (3 Passos)

**Headline:**
```
Comece em 3 passos simples
```

**Steps:**

```
┌─────┐
│  1  │  Responda o Quiz
└─────┘
Conte-nos sobre seu diabetes, preferências
alimentares e objetivos de saúde.

┌─────┐
│  2  │  Receba seu Plano
└─────┘
Nosso algoritmo cria um plano semanal
personalizado só para você.

┌─────┐
│  3  │  Siga e Veja Resultados
└─────┘
Acompanhe suas refeições e veja sua
glicose se estabilizar naturalmente.
```

---

### 7. SOCIAL PROOF (Resultados)

**Headline:**
```
Mais de 1.000 diabéticos já transformaram
sua alimentação com o GlicoSmart
```

**Stats Bar:**
```
┌─────────────┬─────────────┬─────────────┐
│   525+      │   1.000+    │    4.8★     │
│  Receitas   │  Usuários   │  Avaliação  │
└─────────────┴─────────────┴─────────────┘
```

**Depoimentos (Cards):**

```
┌────────────────────────────────────────┐
│ ★★★★★                    15 de janeiro │
│                                        │
│ "Finalmente um app que entende         │
│ diabetes! As receitas são deliciosas   │
│ e minha glicose estabilizou em         │
│ 2 semanas."                            │
│                                        │
│ Maria S. • ✓ VERIFICADO                │
│ Diabetes Tipo 2                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ ★★★★★                    22 de janeiro │
│                                        │
│ "O plano semanal é incrível! Não       │
│ preciso mais pensar no que comer.      │
│ Já perdi 4kg em 1 mês."               │
│                                        │
│ João P. • ✓ VERIFICADO                 │
│ Pré-diabetes                           │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ ★★★★★                    28 de janeiro │
│                                        │
│ "A lista de compras automática         │
│ mudou minha vida. Economizo tempo      │
│ e dinheiro toda semana."               │
│                                        │
│ Ana C. • ✓ VERIFICADO                  │
│ Diabetes Tipo 1                        │
└────────────────────────────────────────┘
```

---

### 8. O QUE VOCÊ RECEBE (Value Stack)

**Headline:**
```
Tudo isso incluso no seu plano
```

**Items:**

```
✅ Plano Semanal Personalizado ............... R$ 47,00
   7 dias de refeições adaptadas ao seu perfil

✅ +525 Receitas Low Carb .................... R$ 67,00
   Banco completo de receitas para diabéticos

✅ Banco de 150+ Alimentos ................... R$ 27,00
   Com índice glicêmico de cada alimento

✅ Lista de Compras Automática ............... R$ 17,00
   Gerada automaticamente do seu plano

✅ Simulador de Glicose ...................... R$ 27,00
   Registre e acompanhe suas medições

✅ Quiz Personalizado ........................ R$ 17,00
   Adapta o plano ao seu tipo de diabetes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VALOR TOTAL:                    R$ 202,00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Bônus Exclusivo:**
```
┌────────────────────────────────────────────┐
│ 🎁 BÔNUS GRÁTIS                           │
│                                            │
│ Guia "7 Dias para Estabilizar sua Glicose" │
│                                            │
│ Protocolo intensivo com as melhores        │
│ práticas para ver resultados na primeira   │
│ semana.                                    │
│                                            │
│ Valor: R$ 47,00 → GRÁTIS                   │
└────────────────────────────────────────────┘
```

---

### 9. OFERTA FINAL (Pricing Card)

**Background:** Escuro (#1F2937)

```
┌─────────────────────────────────────────────┐
│         VALOR TOTAL: R$ 249,00              │
│              (riscado)                      │
│                                             │
│         SOMENTE HOJE POR:                   │
│                                             │
│           R$ 29,90                          │
│            /mês                             │
│                                             │
│    Menos de R$ 1,00 por dia!                │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   ✅ QUERO MEU PLANO AGORA          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🔒 Compra 100% Segura                      │
│  ✓ Garantia de 7 Dias                       │
│  ✓ Cancele quando quiser                    │
│                                             │
│  Não, obrigado. Prefiro continuar sem       │
│  um plano alimentar personalizado.          │
└─────────────────────────────────────────────┘
```

---

### 10. FAQ (Perguntas Frequentes)

**Perguntas:**

1. **O GlicoSmart serve para qual tipo de diabetes?**
   > O GlicoSmart foi desenvolvido para pessoas com diabetes tipo 1, tipo 2 e pré-diabetes. O quiz inicial personaliza todas as receitas e planos de acordo com seu tipo específico.

2. **Como funciona o plano semanal?**
   > Após responder o quiz, nosso algoritmo gera automaticamente 7 dias de refeições (café da manhã, almoço, lanche e jantar) baseadas nas suas preferências e restrições alimentares. Você pode trocar qualquer receita a qualquer momento.

3. **As receitas são realmente gostosas?**
   > Sim! Temos mais de 525 receitas desenvolvidas por nutricionistas especializados em diabetes. Todas são low carb, saborosas e fáceis de preparar.

4. **Como cancelo minha assinatura?**
   > Você pode cancelar a qualquer momento diretamente pelo painel da Payt ou entrando em contato conosco por email. Sem burocracia, sem perguntas.

5. **E se eu não gostar?**
   > Oferecemos garantia de 7 dias. Se você não estiver satisfeito, devolvemos 100% do seu dinheiro.

6. **Preciso de algum equipamento especial?**
   > Não! O GlicoSmart funciona 100% no seu celular ou computador. Basta ter acesso à internet.

---

### 11. GARANTIA

```
┌─────────────────────────────────────────────┐
│                                             │
│    [SELO DE GARANTIA 7 DIAS]                │
│                                             │
│    GARANTIA INCONDICIONAL                   │
│                                             │
│    Se você não amar o GlicoSmart em 7       │
│    dias, devolvemos 100% do seu dinheiro.   │
│    Sem perguntas, sem burocracia.           │
│                                             │
│    Você não tem nada a perder.              │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 12. CTA FINAL

```
┌─────────────────────────────────────────────┐
│                                             │
│   Não deixe o diabetes controlar           │
│   sua vida. Tome o controle agora.         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   ✅ QUERO MEU PLANO AGORA          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│   🔒 Compra 100% Segura • Cancele quando   │
│   quiser • Garantia de 7 dias              │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 13. FOOTER

```
GlicoSmart © 2026 — Todos os direitos reservados

Termos de Uso | Política de Privacidade | Contato

suporte@glicosmart.com.br

AVISO: O GlicoSmart é uma ferramenta de apoio alimentar e
não substitui acompanhamento médico. Sempre consulte seu
médico antes de fazer mudanças na sua dieta.
```

---

## Elementos Visuais Necessários

### Imagens a Criar/Obter:

1. **Hero Image:**
   - Mockup do celular com o app GlicoSmart
   - Estilo similar à imagem do GlucoWave (fundo roxo/gradiente)

2. **Screenshots do App:**
   - Dashboard (sugestões do dia)
   - Plano Semanal
   - Banco de Alimentos
   - Tela de Receita
   - Simulador de Glicose

3. **Ícones:**
   - Usar Lucide React ou Heroicons via SVG inline

4. **Selo de Garantia:**
   - Badge "7 Dias de Garantia"

5. **Logos de Autoridade:**
   - "Como visto em..." (opcional para v1)

---

## Integrações Técnicas

### Payt One-Click Buy:

```html
<!-- Script Global -->
<script src="https://checkout.payt.com.br/multiple-oneclickbuyscript/[SEU_ID].js" async></script>

<!-- Botão de Compra -->
<a href="#"
   payt_action="oneclick_buy"
   data-object="[PRODUCT_ID]"
   class="btn-comprar">
    ✅ QUERO MEU PLANO AGORA
</a>
<select payt_element="installment" style="display: none;" data-object="[PRODUCT_ID]"></select>
```

### Webhook Payt (já implementado):
- URL: `https://glicosmart.com.br/api/webhook/payt`
- Eventos: venda, recorrência, cancelamento, reembolso

---

## Arquivos a Criar

```
/landing/
├── index.php          # Página principal
├── downsell.php       # Página de downsell (opcional)
├── obrigado.php       # Página de agradecimento (redireciona para app)
├── assets/
│   ├── images/
│   │   ├── hero-mockup.png
│   │   ├── screenshot-dashboard.png
│   │   ├── screenshot-plano.png
│   │   ├── screenshot-alimentos.png
│   │   ├── screenshot-receitas.png
│   │   ├── selo-garantia.png
│   │   └── favicon.ico
│   └── css/
│       └── custom.css (se necessário)
└── README.md
```

---

## Checklist de Implementação

- [ ] Criar estrutura HTML base
- [ ] Implementar sticky header com timer
- [ ] Criar hero section com mockup
- [ ] Implementar seções de dor/problema
- [ ] Criar cards de funcionalidades
- [ ] Implementar seção "como funciona"
- [ ] Criar área de depoimentos
- [ ] Implementar value stack
- [ ] Criar pricing card
- [ ] Implementar FAQ accordion
- [ ] Adicionar seção de garantia
- [ ] Integrar Payt One-Click
- [ ] Testar responsividade mobile
- [ ] Otimizar imagens
- [ ] Testar fluxo completo de compra

---

## Próximos Passos

1. **Aprovar este planejamento**
2. **Obter/criar screenshots do app**
3. **Configurar produto no Payt**
4. **Implementar a landing page**
5. **Testar em staging**
6. **Deploy para produção**
