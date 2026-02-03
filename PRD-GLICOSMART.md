# PRD — GlicoSmart v2.0

## Product Requirements Document

**Produto:** GlicoSmart — Plano Alimentar Inteligente para Diabéticos
**Versão:** 2.0 (Comercial)
**Data:** Janeiro 2026
**Autor:** Equipe GlicoSmart

---

## 1. Visão do Produto

### 1.1 O que é o GlicoSmart?

O GlicoSmart é uma plataforma web mobile-first que ajuda pessoas com diabetes (tipo 1, tipo 2 e pré-diabetes) a controlar sua alimentação com um plano alimentar 100% personalizado. O app oferece receitas saudáveis, plano semanal automático, registro de glicose e banco de alimentos com índice glicêmico.

### 1.2 Público-alvo

- Pessoas com diabetes tipo 2 (principal)
- Pessoas com pré-diabetes
- Pessoas com diabetes tipo 1
- Faixa etária: 30–65 anos
- Brasil (português)

### 1.3 Proposta de Valor

> "A dieta mais simples para controlar o diabetes. Coma o que gosta e melhore seus níveis de açúcar."

### 1.4 Modelo de Negócio

- **Plano mensal**: Página de vendas → Pagamento →  quiz → criação do perfil → Acesso completo personalizado
- **Pagamento**: Payt (checkout externo + webhook)
- **Planos**: Mensal (29,90)

---

## 2. Estado Atual do Projeto (v1.0)

### 2.1 O que já está funcionando ✅

| Feature | Status | Descrição |
|---------|--------|-----------|
| Quiz de Onboarding | ✅ Completo | 8 etapas: diabetes → disclaimer → dieta → alergias → alimentos → benefícios → refeições → peso/objetivo |
| Dashboard | ✅ Completo | Sugestão diária (café/almoço/jantar), seções horizontais de receitas, lazy loading |
| Catálogo de Receitas | ✅ Completo | 525+ receitas com busca, paginação (20/página), página de detalhe por slug |
| Plano Semanal | ✅ Completo | 7 dias, 4 refeições/dia, troca de receitas, lista de compras, meta calórica |
| Banco de Alimentos | ✅ Completo | 150+ alimentos com índice glicêmico, filtro por categoria, comparação |
| Simulador de Glicose | ✅ Completo | Onboarding → medição simulada → resultado com status |
| Perfil | ✅ Completo | Exibe dados do quiz, peso, objetivo, restrições |
| Navegação | ✅ Completo | BottomNav com 5 tabs (Início, Medir, Alimentos, Plano, Perfil) |
| Responsividade Desktop | ✅ Completo | Phone frame 430px centralizado com dot pattern |
| Performance | ✅ Otimizado | Cache de receitas, lazy sections, paginação, imagens otimizadas |

### 2.2 O que NÃO existe ainda ❌

| Feature | Prioridade | Necessário para lançar? |
|---------|-----------|------------------------|
| Autenticação (login/registro) | 🔴 Crítico | dSIM |
| Banco de dados (PostgreSQL) | 🔴 Crítico | SIM |
| Integração de pagamento (Payt) | 🔴 Crítico | SIM |
| Landing page / Página de vendas (HTML externo) | 🔴 Crítico | SIM (fora do Next.js) |
| Proteção de rotas (middleware) | 🔴 Crítico | SIM |
| Email automatizado | 🟡 Alto | SIM |
| Página "Obrigado" (pós-compra) | 🟡 Alto | SIM |
| Recuperação de senha | 🟡 Alto | SIM |
| Admin dashboard | 🟠 Médio | NÃO (v2.1) |
| PWA (offline) | 🟠 Médio | NÃO (v2.1) |
| Testes automatizados | 🟠 Médio | NÃO (v2.1) |
| Error Boundaries | 🟠 Médio | NÃO (v2.1) |
| Analytics (GA4) | 🟢 Baixo | NÃO (v2.1) |
| Notificações push | 🟢 Baixo | NÃO (v3.0) |

### 2.3 Tech Stack Atual

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| UI | Lucide React (ícones) |
| Estado | React Context API (RecipeContext + MealPlanContext) |
| Persistência | localStorage |
| Imagens | Next.js Image + Unsplash (remotePatterns) |
| Dados | JSON estático (recipes.json + alimentos.json) |

---

## 3. Arquitetura Alvo (v2.0)

### 3.1 Tech Stack Adicional

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Database | PostgreSQL (Prisma ORM) | Persistência real de dados |
| Auth | JWT (jose) + HTTP-only cookies | Seguro, sem dependência externa |
| Hash | bcryptjs | Hashing de senhas |
| Email | Resend | Email transacional moderno |
| Pagamento | Payt (webhook) | Processador de pagamento |
| Validação | Zod | Validação de schemas type-safe |
| Deploy | Vercel | Optimizado para Next.js |
| Monitoring | Sentry | Error tracking em produção |
| Analytics | Google Analytics 4 | Rastreamento de comportamento |

### 3.2 Estrutura de Pastas (Alvo)

```
app-receitas-next/
├── app/
│   ├── api/                          # 🆕 API Routes
│   │   ├── auth/
│   │   │   ├── register/route.ts     # Registro de usuário
│   │   │   ├── login/route.ts        # Login
│   │   │   ├── logout/route.ts       # Logout
│   │   │   ├── me/route.ts           # Sessão atual
│   │   │   └── reset-password/route.ts # Reset de senha
│   │   ├── webhook/
│   │   │   └── payt/route.ts         # Webhook do Payt
│   │   ├── user/
│   │   │   ├── profile/route.ts      # CRUD de perfil
│   │   │   └── progress/route.ts     # Salvar progresso
│   │   └── admin/                    # 🆕 (v2.1)
│   │       └── users/route.ts        # Gestão de usuários
│   │
│   ├── (public)/                     # 🆕 Rotas públicas (sem auth)
│   │   ├── login/page.tsx            # 🆕 Login
│   │   └── obrigado/page.tsx         # 🆕 Pós-compra
│   │
│   ├── (protected)/                  # 🆕 Rotas protegidas (com auth)
│   │   ├── quiz/                     # Quiz de perfil (onboarding pós-compra)
│   │   │   ├── page.tsx              # Quiz steps (atual, movido para área protegida)
│   │   │   ├── resultado/page.tsx    # 🆕 Conclusão do quiz
│   │   │   └── loading/page.tsx      # 🆕 Tela de loading animada
│   │   ├── dashboard/page.tsx        # Dashboard (atual)
│   │   ├── receitas/page.tsx         # Catálogo (atual)
│   │   ├── receitas/[slug]/page.tsx  # Detalhe (atual)
│   │   ├── plano-semanal/page.tsx    # Plano (atual)
│   │   ├── alimentos/page.tsx        # Banco (atual)
│   │   ├── medir/page.tsx            # Glicose (atual)
│   │   └── perfil/page.tsx           # Perfil (atual)
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── (existentes)                  # Todos os componentes atuais
│   ├── auth/                         # 🆕
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ResetPasswordForm.tsx
│   └── common/                       # 🆕
│       ├── ErrorBoundary.tsx
│       └── LoadingScreen.tsx
│
├── contexts/
│   ├── RecipeContext.tsx              # (atual)
│   ├── MealPlanContext.tsx            # (atual)
│   └── AuthContext.tsx                # 🆕
│
├── lib/
│   ├── (existentes)
│   ├── auth/                         # 🆕
│   │   ├── jwt.ts                    # Token creation/validation
│   │   ├── password.ts               # Hash/verify
│   │   └── session.ts                # Cookie management
│   ├── email/                        # 🆕
│   │   ├── sendWelcomeEmail.ts
│   │   ├── sendResetEmail.ts
│   │   └── templates/
│   │       ├── welcome.ts
│   │       └── reset-password.ts
│   ├── prisma.ts                     # 🆕 Prisma client singleton
│   ├── validations.ts                # 🆕 Zod schemas
│   └── analytics.ts                  # 🆕 GA4 helpers
│
├── prisma/
│   ├── schema.prisma                 # 🆕
│   └── seed.ts                       # 🆕
│
├── middleware.ts                      # 🆕 Proteção de rotas
└── ...
```

### 3.3 Schema do Banco de Dados (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // bcrypt hash
  plan          String    @default("free")    // free, standard, premium
  status        String    @default("active")  // active, inactive, pending

  // Dados do Quiz
  diabetesType  String?   // type1, type2, pre_diabetes, unknown
  dietType      String?   // omnivore, vegetarian, vegan
  allergies     String[]  // array de alergias
  dislikedFoods String[]  // alimentos que não gosta
  goal          String?   // lose_weight, reeducation, gain_muscle
  weight        Float?
  mealsPerDay   Int       @default(3)

  // Progresso
  completedRecipes String[] // IDs de receitas feitas
  glucoseReadings  GlucoseReading[]

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  // Pagamento
  paytCustomerId String?
  paidAt         DateTime?
  planExpiresAt  DateTime?
}

model GlucoseReading {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  value       Float    // mg/dL
  status      String   // low, normal, pre_diabetic, high
  measuredAt  DateTime @default(now())
  notes       String?
}

model PaymentLog {
  id          String   @id @default(cuid())
  email       String
  event       String   // sale, subscription, cancellation
  amount      Float?
  plan        String?
  paytPayload Json     // payload completo para debug
  createdAt   DateTime @default(now())
}
```

---

## 4. Features a Implementar — Roadmap por Fases

---

### FASE 1: Infraestrutura de Autenticação e Pagamento (MVP Comercial)

> **Objetivo**: Transformar o app gratuito em produto comercializável
> **Prazo estimado**: 2-3 semanas

#### 4.1.1 — Sistema de Autenticação

**Descrição**: Implementar autenticação completa com JWT em HTTP-only cookies, idêntica à arquitetura do Hypnozio mas com melhorias.

**Requisitos**:
- [ ] Instalar dependências: `prisma`, `@prisma/client`, `jose`, `bcryptjs`, `zod`
- [ ] Criar schema Prisma e configurar PostgreSQL
- [ ] `POST /api/auth/register` — Registro com email + senha
  - Validação com Zod (email válido, senha mínima 8 chars)
  - Hash da senha com bcryptjs
  - Criação de JWT com `jose`
  - Set HTTP-only cookie `session_token`
  - Retorna user data (sem senha)
- [ ] `POST /api/auth/login` — Login com email + senha
  - Verifica credenciais
  - Gera JWT
  - Set cookie
- [ ] `POST /api/auth/logout` — Limpa cookie
- [ ] `GET /api/auth/me` — Retorna sessão atual (valida JWT)
- [ ] `POST /api/auth/reset-password` — Envia email de reset
- [ ] `POST /api/auth/reset-password/confirm` — Confirma novo password com token

**Melhorias sobre o Hypnozio**:
- ✅ JWT_SECRET **obrigatório** — sem fallback inseguro
- ✅ Validação com Zod (não manual)
- ✅ Rate limiting nos endpoints de auth (max 5 tentativas/minuto)
- ✅ Fluxo de reset de senha desde o dia 1 (Hypnozio não tem)
- ✅ Email de verificação opcional (v2.1)

#### 4.1.2 — AuthContext (Frontend)

**Descrição**: Context global de autenticação que gerencia estado do usuário.

**Requisitos**:
- [ ] `AuthContext.tsx` com:
  - `user` — dados do usuário logado
  - `isAuthenticated` — boolean
  - `isLoading` — carregando sessão
  - `login(email, password)` — chama API
  - `register(email, password, name)` — chama API
  - `logout()` — chama API + limpa estado
  - `refreshSession()` — valida cookie no mount
- [ ] Wrap no `layout.tsx` como provider mais externo
- [ ] Sem `console.log` em produção (usar variável `NODE_ENV`)

**Melhorias sobre o Hypnozio**:
- ✅ Sem debug logs em produção
- ✅ Loading skeleton enquanto valida sessão (não tela em branco)

#### 4.1.3 — Middleware de Proteção de Rotas

**Descrição**: Middleware Next.js que protege rotas da área logada.

**Requisitos**:
- [ ] `middleware.ts` na raiz do projeto
- [ ] Rotas protegidas: `/quiz`, `/dashboard`, `/receitas`, `/plano-semanal`, `/alimentos`, `/medir`, `/perfil`
- [ ] Rotas públicas: `/`, `/obrigado`, `/login`
- [ ] Se autenticado + perfil incompleto → redireciona para `/quiz` (onboarding obrigatório)
- [ ] Se não autenticado → redireciona para `/login`
- [ ] Se autenticado + acessa `/login` → redireciona para `/dashboard`
- [ ] Valida JWT usando `jose` (mesmo secret do backend)

#### 4.1.4 — Integração Payt (Pagamento)

**Descrição**: Webhook que recebe eventos do Payt e cria/atualiza usuário no banco.

**Requisitos**:
- [ ] `POST /api/webhook/payt` — Endpoint de webhook
  - Valida access key via header ou body (em env var, **não hardcoded**)
  - Eventos suportados: `Venda`, `Recorrência`, `Cancelamento`, `Reembolso`
  - Na **Venda**: cria user no banco (ou atualiza se já existe), define plano, envia email de boas-vindas
  - No **Cancelamento/Reembolso**: atualiza status para `inactive`
- [ ] Salvar payload completo em `PaymentLog` para debug
- [ ] Enviar email de boas-vindas com link de acesso

**Melhorias sobre o Hypnozio**:
- ✅ Access key em env var (não hardcoded)
- ✅ Google Sheets logging **opcional** (não obrigatório)
- ✅ Log de pagamento no banco (PaymentLog) para auditoria
- ✅ Validação de signature do webhook (se Payt suportar)

#### 4.1.5 — Sistema de Email (Resend)

**Descrição**: Emails transacionais bonitos e funcionais.

**Requisitos**:
- [ ] Instalar `resend`
- [ ] Email de boas-vindas (pós-compra)
  - Template HTML com branding GlicoSmart (emerald/teal)
  - Link direto para login
  - Lista de features do plano
  - Senha temporária ou link de criação de senha
- [ ] Email de reset de senha
  - Link com token temporário (expira em 1h)
  - Instruções claras
- [ ] Todas as env vars necessárias:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL` (ex: `GlicoSmart <noreply@glicosmart.com.br>`)

**Melhorias sobre o Hypnozio**:
- ✅ Templates tipados (não string HTML solta)
- ✅ Preview em desenvolvimento (Resend tem preview mode)
- ✅ Sender com domínio próprio (não `@resend.dev`)

---

### FASE 2: Onboarding Pós-Compra + Páginas de Suporte

> **Objetivo**: Configurar o fluxo pós-compra e páginas auxiliares dentro do app
> **Prazo estimado**: 1-2 semanas

#### 4.2.1 — Landing Page (Externa — HTML)

**Descrição**: A página de vendas será desenvolvida separadamente em HTML puro, fora do projeto Next.js.

**Observações**:
- A landing page **não faz parte** deste projeto Next.js
- Será construída em HTML/CSS/JS estático posteriormente
- O CTA da landing page direcionará para o checkout do Payt (externo)
- Após o pagamento, o webhook do Payt cria o usuário no banco e envia email de boas-vindas
- O usuário acessa o app pelo link no email ou pela página `/obrigado`

#### 4.2.2 — Quiz de Perfil (Pós-Compra / Onboarding)

**Descrição**: O quiz é executado **após a compra**, como parte do onboarding do usuário já pagante. Serve para construir o perfil alimentar e personalizar o plano.

**O quiz atual já funciona bem.** Ajustes necessários:

- [ ] **Mover quiz para área protegida** — só acessível após login
- [ ] **Quiz como onboarding obrigatório** — se o perfil não estiver completo, redirecionar para `/quiz`
- [ ] **Tela de loading animada** ("Montando seu plano personalizado..." com progress bar)
- [ ] **Página de conclusão** mostrando:
  - Resumo do perfil criado
  - Preview do plano alimentar gerado
  - CTA "Ir para meu Dashboard"
- [ ] **Persistir respostas no banco** — salvar perfil do quiz diretamente no banco de dados (não só localStorage)
- [ ] **Analytics events** em cada step (quiz_step_1, quiz_step_2, etc.)

**Diferenças em relação ao fluxo anterior**:
- ✅ Quiz não é ferramenta de conversão — é onboarding real
- ✅ Sem captura de email (usuário já está logado)
- ✅ Sem blur/paywall (usuário já pagou)
- ✅ Dados salvos no banco desde o início (não localStorage temporário)

#### 4.2.3 — Página Obrigado (Pós-Compra)

**Descrição**: Página que recebe o usuário após o pagamento no Payt.

**Requisitos**:
- [ ] **Página obrigado** (`/obrigado`):
  - Confirmação do pedido
  - Formulário de criação de senha (se não tiver ainda)
  - Instruções de próximos passos
  - Botão para acessar o app → redireciona para `/quiz` (onboarding)
  - Auto-redirect após 5s se já logado

---

### FASE 3: Melhorias de Produto (pós-lançamento)

> **Objetivo**: Melhorar retenção e experiência do usuário
> **Prazo estimado**: Contínuo

#### 4.3.1 — Persistência de Dados no Servidor

**Descrição**: Migrar dados do localStorage para banco de dados.

**Requisitos**:
- [ ] Salvar perfil do quiz no banco (não só localStorage)
- [ ] Salvar plano semanal no banco
- [ ] Salvar plano diário no banco
- [ ] Salvar leituras de glicose no banco
- [ ] Salvar receitas favoritas no banco
- [ ] Sync bidirecional: banco ↔ localStorage (offline-first)
- [ ] API endpoints:
  - `GET/PUT /api/user/profile`
  - `GET/POST /api/user/meal-plan`
  - `GET/POST /api/user/glucose-readings`
  - `GET/POST /api/user/favorites`

#### 4.3.2 — Receitas Reais com Fotos Próprias

**Descrição**: Substituir imagens placeholder do Unsplash por fotos próprias.

**Requisitos**:
- [ ] Fotografar (ou gerar com IA) fotos das receitas
- [ ] Upload para Cloudinary ou Vercel Blob
- [ ] Atualizar `recipes.json` com URLs permanentes
- [ ] Adicionar dados nutricionais reais (carboidratos, proteínas, gorduras, fibras)
- [ ] Revisar textos das receitas com nutricionista

#### 4.3.3 — Cálculo Nutricional Real

**Descrição**: Substituir estimativas por dados nutricionais reais.

**Requisitos**:
- [ ] Adicionar macros à interface `Recipe`: `carbs`, `protein`, `fat`, `fiber`
- [ ] Calcular macros baseado em ingredientes (tabela TACO/IBGE)
- [ ] Atualizar `calculateDayTotals()` para usar dados reais
- [ ] Mostrar breakdown de macros no plano diário e semanal
- [ ] Meta de carboidratos personalizada por tipo de diabetes

#### 4.3.4 — PWA (Progressive Web App)

**Descrição**: Transformar em PWA para funcionar como app nativo.

**Requisitos**:
- [ ] `manifest.json` com ícones, nome, cores
- [ ] Service Worker para cache de assets estáticos
- [ ] Cache de receitas para acesso offline
- [ ] Prompt de instalação ("Adicionar à tela inicial")
- [ ] Splash screen personalizada
- [ ] Notificações push (lembrete de refeições, medição de glicose)

#### 4.3.5 — Error Boundaries e Monitoring

**Requisitos**:
- [ ] Error Boundaries em cada seção do app
- [ ] Fallback UI amigável (não tela branca)
- [ ] Integração com Sentry para error tracking
- [ ] Vercel Analytics para Web Vitals
- [ ] Google Analytics 4 para comportamento do usuário

#### 4.3.6 — Admin Dashboard (v2.1)

**Requisitos**:
- [ ] `/admin` protegido por role
- [ ] Lista de usuários com busca e filtros
- [ ] Detalhes do usuário (plano, status, última atividade)
- [ ] Métricas: total de usuários, receita, churn, conversão do quiz
- [ ] Gestão de planos (ativar/desativar)
- [ ] Log de pagamentos

---

### FASE 4: Crescimento e Retenção (v3.0)

> **Objetivo**: Features avançadas para escalar o produto

#### 4.4.1 — Gamificação

- [ ] Sistema de streaks (dias consecutivos usando o app)
- [ ] Badges/conquistas (primeira receita, 7 dias de medição, etc.)
- [ ] Pontuação semanal de aderência ao plano
- [ ] Ranking anônimo (opcional)

#### 4.4.2 — IA Personalização

- [ ] Sugestões baseadas em histórico de uso
- [ ] Plano semanal inteligente (evita repetições, considera preferências)
- [ ] Chatbot para dúvidas nutricionais (OpenAI API)
- [ ] Ajuste automático de metas baseado em leituras de glicose

#### 4.4.3 — Comunidade

- [ ] Feed de receitas dos usuários
- [ ] Avaliações e comentários nas receitas
- [ ] Compartilhamento de plano semanal
- [ ] Grupos por tipo de diabetes

#### 4.4.4 — Integrações

- [ ] Apple Health / Google Fit (leituras de glicose reais)
- [ ] Wearables (Dexcom, FreeStyle Libre)
- [ ] Export PDF do plano semanal
- [ ] Compartilhamento da lista de compras (WhatsApp)

---

## 5. Fluxo do Usuário Completo (v2.0)

### 5.1 Novo Usuário (Aquisição → Onboarding)

```
1. Landing Page (externa — HTML separado)
   └→ CTA "Assinar Agora" → direciona para Payt

2. Pagamento (Payt — externo)
   └→ Webhook dispara → cria user no banco + envia email de boas-vindas

3. Obrigado (/obrigado) 🆕
   ├→ Confirmação do pedido
   ├→ Criar senha
   └→ "Acessar Meu Plano" → /quiz (onboarding)

4. Login (/login) 🆕
   └→ Email + Senha → JWT cookie

5. Quiz de Perfil (/quiz) — Onboarding obrigatório 🆕
   ├→ Step 0: Tipo de diabetes
   ├→ Step 1: Disclaimer de saúde
   ├→ Step 2: Tipo de dieta
   ├→ Step 3: Alergias
   ├→ Step 4: Alimentos que não gosta
   ├→ Step 5: Benefícios (engajamento)
   ├→ Step 6: Refeições por dia
   └→ Step 7: Peso + Objetivo

6. Loading Animado (/quiz/loading) 🆕
   └→ "Montando seu plano personalizado..." (3-5 segundos)

7. Conclusão do Quiz (/quiz/resultado) 🆕
   ├→ Resumo do perfil criado
   ├→ Preview do plano alimentar gerado
   └→ CTA "Ir para meu Dashboard" → /dashboard

8. Dashboard (/dashboard)
   ├→ Sugestão do dia personalizada
   ├→ Seções de receitas
   └→ Plano semanal gerado com base no perfil
```

### 5.2 Usuário Recorrente (Login → Uso)

```
1. Login (/login) 🆕
   └→ Email + Senha → JWT cookie

2. Dashboard (/dashboard)
   ├→ Sugestão do dia
   ├→ Seções de receitas
   └→ CTA "Medir Glicose"

3. Navegação via BottomNav
   ├→ Início → Dashboard
   ├→ Medir → Simulador de glicose
   ├→ Alimentos → Banco de alimentos
   ├→ Plano → Plano semanal
   └→ Perfil → Dados + Configurações + Logout
```

### 5.3 Recuperação de Senha

```
1. Login (/login)
   └→ "Esqueci minha senha"

2. Reset (/login?mode=reset) 🆕
   └→ Digite seu email

3. Email recebido
   └→ Link: /reset-password?token=xxx

4. Nova Senha (/reset-password) 🆕
   └→ Nova senha + confirmação

5. Redirect para /login com mensagem de sucesso
```

---

## 6. Variáveis de Ambiente

### 6.1 Obrigatórias (Produção)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/glicosmart

# Auth
JWT_SECRET=random-string-min-32-chars-OBRIGATORIO

# Email
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=GlicoSmart <noreply@glicosmart.com.br>

# Payment
PAYT_WEBHOOK_SECRET=sua-chave-secreta-aqui

# App
NEXT_PUBLIC_BASE_URL=https://glicosmart.com.br
NEXT_PUBLIC_APP_NAME=GlicoSmart
```

### 6.2 Opcionais

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error Tracking
SENTRY_DSN=https://xxx@sentry.io/xxx

# Admin
ADMIN_EMAIL=admin@glicosmart.com.br
```

### 6.3 Regra de Ouro

> **NENHUMA** chave, senha, token ou credencial deve ser hardcoded no código.
> Tudo em variáveis de ambiente. Sem exceção. Sem fallback inseguro.

---

## 7. Segurança

### 7.1 Checklist de Segurança

- [ ] JWT_SECRET sem fallback — app **não inicia** sem ele
- [ ] Senhas hasheadas com bcryptjs (min 10 rounds)
- [ ] HTTP-only cookies para sessão (não localStorage)
- [ ] CSRF protection via SameSite cookies
- [ ] Rate limiting nos endpoints de auth (5 req/min por IP)
- [ ] Validação de input com Zod em todos os endpoints
- [ ] Sanitização de dados antes de salvar no banco
- [ ] Webhook do Payt validado por secret key
- [ ] Headers de segurança (HSTS, X-Frame-Options, etc.)
- [ ] Secrets **nunca** no git — usar `.env.local` + `.gitignore`
- [ ] Prisma: usar queries parametrizadas (padrão do Prisma)
- [ ] LGPD: política de privacidade, opção de deletar conta

---

## 8. Performance

### 8.1 Metas de Performance

| Métrica | Meta | Atual |
|---------|------|-------|
| LCP (Largest Contentful Paint) | < 2.5s | ~3s |
| FID (First Input Delay) | < 100ms | OK |
| CLS (Cumulative Layout Shift) | < 0.1 | OK |
| TTFB (Time to First Byte) | < 600ms | ~800ms |
| Bundle Size (JS) | < 150KB gzipped | ~200KB |

### 8.2 Otimizações Planejadas

- [ ] Dynamic imports para componentes pesados (Quiz, GlucoseMeter)
- [ ] Route prefetching otimizado (já implementado)
- [ ] Image optimization com AVIF/WebP (Next.js nativo)
- [ ] Lazy loading de seções (já implementado com IntersectionObserver)
- [ ] Cache de receitas no módulo (já implementado)
- [ ] Paginação de receitas (já implementado — 20/página)
- [ ] Code splitting por rota (Next.js automático)
- [ ] Compress: true no next.config.js
- [ ] Database connection pooling (Prisma)

---

## 9. Deploy

### 9.1 Vercel

```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "regions": ["gru1"]  // São Paulo para Brasil
}
```

### 9.2 Database

- **Produção**: PostgreSQL no Supabase, Neon, ou Railway
- **Dev**: SQLite local via Prisma (dev.db)
- **Migrations**: `npx prisma migrate dev` (dev) / `npx prisma migrate deploy` (prod)

### 9.3 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Database criado e migrado
- [ ] Domínio configurado (glicosmart.com.br)
- [ ] SSL ativo (Vercel automático)
- [ ] Webhook do Payt apontando para `https://glicosmart.com.br/api/webhook/payt`
- [ ] Email sender domain verificado no Resend
- [ ] Sentry configurado
- [ ] GA4 tag instalada
- [ ] Testar fluxo completo: quiz → pagamento → email → login → dashboard

---

## 10. Métricas de Sucesso

### 10.1 KPIs do Produto

| Métrica | Meta (Mês 1) | Meta (Mês 3) |
|---------|-------------|-------------|
| Quiz completions | 500 | 2.000 |
| Taxa de conversão quiz → venda | 3% | 5% |
| Usuários pagantes | 15 | 100 |
| MRR (Receita Recorrente Mensal) | R$ 500 | R$ 3.000 |
| Churn mensal | < 15% | < 10% |
| DAU (Daily Active Users) | 10 | 50 |
| NPS | > 30 | > 50 |

### 10.2 Eventos de Analytics

```
// Quiz
quiz_started
quiz_step_{n}_completed
quiz_email_captured
quiz_completed

// Conversion
offer_viewed
checkout_started
payment_completed
account_created

// Engagement
daily_plan_generated
weekly_plan_generated
recipe_viewed
recipe_favorited
glucose_measured
food_searched
meal_swapped

// Retention
session_started
streak_continued
feature_used_{name}
```

---

## 11. Cronograma Estimado

| Fase | Features | Duração | Dependência |
|------|---------|---------|-------------|
| **Fase 1** | Auth + DB + Payt + Email + Middleware | 2-3 semanas | — |
| **Fase 2** | Quiz pós-compra (onboarding) + Página obrigado | 1-2 semanas | Fase 1 |
| **Lançamento Beta** | Testes + Deploy + Config | 3-5 dias | Fase 2 |
| **Fase 3** | Persistência servidor + Fotos reais + Macros + PWA + Monitoring | 3-4 semanas | Lançamento |
| **Fase 4** | Gamificação + IA + Comunidade + Integrações | Contínuo | Fase 3 |

### Ordem de Implementação (Fase 1 — detalhado)

1. Instalar Prisma + configurar PostgreSQL
2. Criar schema + migração inicial
3. Implementar lib/auth (jwt.ts, password.ts, session.ts)
4. Criar API routes de auth (register, login, logout, me)
5. Criar AuthContext.tsx
6. Criar middleware.ts de proteção de rotas
7. Criar página de login (/login)
8. Reorganizar rotas (public vs protected)
9. Implementar webhook do Payt
10. Configurar Resend + templates de email
11. Implementar reset de senha
12. Testar fluxo completo

---

## 12. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Webhook Payt falha | Média | Alto | Log de erros + retry manual + notificação |
| Email vai para spam | Média | Alto | Domínio verificado + SPF/DKIM/DMARC |
| Dados perdidos (localStorage) | Alta | Médio | Migrar para banco (Fase 3) |
| Performance degradada com DB | Baixa | Médio | Connection pooling + cache |
| Usuário esquece senha | Alta | Alto | Reset de senha desde o dia 1 |
| Quebra de layout mobile | Baixa | Alto | Testes em múltiplos devices antes de deploy |
| Custo de infraestrutura | Baixa | Baixo | Vercel free tier + Neon free tier suportam início |

---

## 13. Definições Legais

### 13.1 LGPD Compliance

- [ ] Política de privacidade acessível
- [ ] Termos de uso
- [ ] Consentimento para coleta de dados (checkbox no quiz)
- [ ] Opção de exportar dados pessoais
- [ ] Opção de deletar conta e todos os dados
- [ ] Cookies consent banner (se necessário)

### 13.2 Disclaimer de Saúde

> O GlicoSmart não é um dispositivo médico. As informações fornecidas são para fins educativos e informativos. Consulte sempre seu médico ou nutricionista antes de fazer mudanças na dieta.

*(Já implementado no Step 1 do Quiz)*

---

## 14. Conclusão

O GlicoSmart já possui uma base sólida com todas as features de produto implementadas (quiz, dashboard, receitas, plano semanal, alimentos, glicose, perfil). O que falta para comercializar é **infraestrutura**: autenticação, banco de dados, pagamento e funil de vendas.

A Fase 1 é o bloco fundamental que transforma um protótipo funcional em produto comercializável. As fases seguintes são incrementais e podem ser priorizadas com base no feedback dos primeiros usuários pagantes.

**Próximo passo**: Iniciar a Fase 1 — Autenticação e Banco de Dados.
