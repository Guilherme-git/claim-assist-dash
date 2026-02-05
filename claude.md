# UTILIZA FRONT-END - Documentação para Claude

## 🎯 OBJETIVO DO PROJETO

### **Dashboard Web de Gerenciamento de Guinchos**

Criar uma aplicação web moderna em React/TypeScript para gerenciamento e visualização de **CHAMADOS DE GUINCHO** consumindo dados da API Node.js localizada em `/var/www/utiliza/api`.

**⚠️ IMPORTANTE: ESCOPO EXCLUSIVO - APENAS GUINCHO (TOWING)**

Este projeto front-end é **EXCLUSIVAMENTE** para gerenciamento de **GUINCHOS**. Não implementar funcionalidades relacionadas a:
- ❌ Vistorias (Inspections)
- ❌ Bikers/Vistoriadores
- ❌ Accidents/Expertises

---

## 🔄 COMUNICAÇÃO COM A API

### **API Backend (Node.js)**

**Localização:** `/var/www/utiliza/api`
**Base URL:** `http://localhost:3001/api`
**Autenticação:** JWT Bearer Token

### **Endpoint Principal Utilizado**

| Método | Endpoint | Query Params | Descrição |
|--------|----------|--------------|-----------|
| GET | `/api/calls/guinchos` | `page`, `limit`, `status`, `towing_service_type`, `association`, `search` | Lista **APENAS guinchos** (towing_status IS NOT NULL AND status IS NULL) |

**Retorna:** Chamados com `towing_drivers`, `call_service_requests`, `associate_cars` e `associates` incluídos

---

## 🛠️ STACK TECNOLÓGICA

### **Core**
- **React** 18.3.1 - Biblioteca para interfaces
- **TypeScript** 5.8.3 - Tipagem estática
- **Vite** 5.4.19 - Build tool e dev server
- **React Router DOM** 6.30.1 - Roteamento SPA

### **UI & Styling**
- **Tailwind CSS** 3.4.17 - Framework CSS utility-first
- **shadcn/ui** - Componentes React com Radix UI
- **Lucide React** 0.462.0 - Ícones
- **class-variance-authority** 0.7.1 - Variantes de componentes
- **tailwind-merge** 2.6.0 - Merge de classes Tailwind

### **State Management & Data Fetching**
- **Axios** 1.13.4 - Cliente HTTP
- **@tanstack/react-query** 5.83.0 - Cache e state management assíncrono
- **React Hook Form** 7.61.1 - Gerenciamento de formulários
- **Zod** 3.25.76 - Validação de schemas

### **Charts & Visualização**
- **Recharts** 2.15.4 - Gráficos e dashboards

### **Utilitários**
- **date-fns** 3.6.0 - Manipulação de datas
- **clsx** 2.1.1 - Composição de classes CSS

---

## 🆕 ATUALIZAÇÕES RECENTES

### **04/02/2026 - Monitoramento em Tempo Real**

#### **AcompanhamentoFullscreen.tsx**
- ✅ Adicionada página de monitoramento fullscreen com atualização em tempo real
- ✅ Campo `cliente` substituído por `associado` (inclui campo `association`)
- ✅ **Labels de exibição na interface:**
  - Campo API `associado.name` → Label **"Usuário"**
  - Campo API `associado.association` → Label **"Cliente"**
  - ⚠️ IMPORTANTE: Campo "Cliente" sempre visível, exibe "Não definida" quando null
- ✅ **Filtro por Cliente (Associação)**
  - Design moderno com chips coloridos e gradientes
  - 5 opções: Todos, Solidy, Nova, Motoclub, Aprovel
  - Cores: Solidy (verde), Nova (azul), Motoclub (laranja), Aprovel (ciano)
  - Efeito visual de seleção (escala e sombra)
  - Reset para página 1 ao mudar filtro
  - Parâmetro `?association=` enviado para API
- ✅ **Modo Analytics - Filtros Automáticos**
  - Parâmetros de evolução por hora (`evolution_start_date`, `evolution_end_date`)
  - Cálculo automático: primeiro e último dia do mês vigente
  - Inputs de data preenchidos automaticamente ao entrar no modo
  - Sincronização com filtro de associação selecionado
  - Gráficos filtrados por data + associação
- ✅ Sistema de áudio com sirene policial (Web Audio API)
  - Som sintetizado usando osciladores (500Hz - 1200Hz)
  - Reprodução de 2.5 segundos ao detectar NOVO chamado atrasado
  - Detecção baseada em comparação de contadores (atual > anterior)
  - Para automaticamente após 2.5 segundos
  - Controle de mute/unmute
- ✅ Integração com API `/api/calls/guinchos/open`
  - Polling a cada 10 segundos
  - Paginação (20 chamados por página)
  - Campo `summary` com totais globais (delayed, alert, on_time)
- ✅ Métricas de desempenho nos cards
  - Distância do guincho (`towing_distance_km`)
  - Tempo de chegada (`towing_arrival_time_minutes`)
  - Duração do serviço (`service_duration`)
  - Layout em grid 3 colunas com ícones coloridos
- ✅ Contadores de status globais
  - Usa `summary` da API (não conta apenas página atual)
  - Total de atrasados, alertas e no prazo
- ✅ Campos de data pré-formatados pela API
  - `created_at`, `expected_arrival_date`, `expected_completion_date`
  - Exibe "Não definida" quando null

#### **DateRangeFilter.tsx**
- ✅ Adicionado filtro por intervalo de datas no dashboard
  - Dois calendários (data início e data fim)
  - Validação: ambas as datas são obrigatórias
  - Botões: Aplicar Filtro e Limpar
- ✅ Botão "Acompanhamento" para abrir página fullscreen em nova aba
  - Usa `window.open()` para garantir abertura em nova aba

#### **InspectionsCard.tsx**
- ✅ Navegação de fotos em checkin/checkout
  - Botões Anterior/Próximo
  - Contador de imagens (X / Total)
  - Dialog compartilhado para evitar problemas de renderização

#### **calls.service.ts**
- ✅ Novas interfaces TypeScript
  - `OpenCall`: Dados otimizados para monitoramento
  - `OpenCallsResponse`: Resposta com data, pagination e summary
- ✅ Novo método `getOpenCalls(page, limit)`
  - Busca chamados em aberto para monitoramento
  - Retorna summary com totais agregados

#### **dashboard.service.ts**
- ✅ Interface `DashboardFilters`
  - Suporte para `start_date` e `end_date` (formato YYYY-MM-DD)
- ✅ Método `getData()` atualizado para aceitar filtros opcionais

---

## ⚙️ VARIÁVEIS DE AMBIENTE

### **📋 Configuração Inicial**

O projeto utiliza variáveis de ambiente para configurações sensíveis e específicas do ambiente. As variáveis são definidas no arquivo `.env` na raiz do projeto.

**⚠️ IMPORTANTE: Prefixo VITE_**

O Vite (build tool) **só expõe variáveis que começam com `VITE_`** para o código do cliente. Variáveis sem este prefixo não estarão disponíveis no navegador.

### **📄 Variáveis Necessárias**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# URL da API backend
VITE_API_URL=http://localhost:3001

# Google Maps API Key (necessária para criação de chamados)
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**Descrição das variáveis:**

| Variável | Descrição | Padrão | Obrigatória |
|----------|-----------|--------|-------------|
| `VITE_API_URL` | URL base da API backend | `http://localhost:3001` | ✅ Sim |
| `VITE_GOOGLE_MAPS_API_KEY` | Chave da API do Google Maps para geocodificação e mapas | - | ✅ Sim (para criar chamados) |

### **🔧 Como Usar no Código**

As variáveis de ambiente são acessadas via `import.meta.env`:

```typescript
// ✅ Correto - variável com prefixo VITE_
const apiUrl = import.meta.env.VITE_API_URL;
const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// ❌ Errado - sem prefixo VITE_ (não funciona)
const key = import.meta.env.GOOGLE_MAPS_API_KEY; // undefined
```

### **🐳 Integração com Docker**

As variáveis de ambiente são passadas para os containers Docker via `environment:` nos arquivos `docker-compose.yml` e `docker-compose.dev.yml`:

```yaml
environment:
  VITE_API_URL: ${VITE_API_URL}
  VITE_GOOGLE_MAPS_API_KEY: ${VITE_GOOGLE_MAPS_API_KEY}
```

O Docker Compose lê automaticamente o arquivo `.env` e substitui as variáveis `${VAR_NAME}`.

### **📝 Arquivo .env.example**

Um arquivo `.env.example` está disponível como template. Para configurar o projeto:

```bash
# Copiar template
cp .env.example .env

# Editar e adicionar suas chaves
vim .env
```

---

## 🐳 CONTEINERIZAÇÃO (DOCKER)

### **📄 docker-compose.yml Completo**

```yaml
# Produção: build estático + Nginx. Use para rodar/deploy (porta 8081).
# Comando: docker compose up -d --build
services:
  app:
    build: .
    ports:
      - "8081:8081"
    environment:
      VITE_API_URL: ${VITE_API_URL}
      VITE_GOOGLE_MAPS_API_KEY: ${VITE_GOOGLE_MAPS_API_KEY}
    restart: unless-stopped
```

### **📄 docker-compose.dev.yml Completo**

```yaml
# Desenvolvimento: Vite com hot reload. Use enquanto codifica (porta 8080).
# Comando: docker compose -f docker-compose.dev.yml up -d --build
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    volumes:
      # Código fonte montado para refletir alterações na hora
      - .:/app
      # Evita sobrescrever node_modules do container com o do host
      - /app/node_modules
    environment:
      # Necessário no Windows/WSL para o file watcher detectar mudanças
      CHOKIDAR_USEPOLLING: true
      VITE_API_URL: ${VITE_API_URL:-http://localhost:3001}
      VITE_GOOGLE_MAPS_API_KEY: ${VITE_GOOGLE_MAPS_API_KEY}
    stdin_open: true
    tty: true
```

---

### **🔍 Explicação Detalhada**

#### **Service: app (Produção)**

| Configuração | Valor | Descrição |
|--------------|-------|-----------|
| **build** | `.` | Usa Dockerfile na raiz (multi-stage build) |
| **ports** | `8081:8081` | Porta externa 8081 → porta interna 8081 (Nginx) |
| **environment** | `VITE_API_URL` | URL da API backend (do .env) |
| **environment** | `VITE_GOOGLE_MAPS_API_KEY` | Chave do Google Maps (do .env) |
| **restart** | `unless-stopped` | Reinicia automaticamente (exceto se parado manualmente) |

**Como funciona (Produção):**
1. Lê variáveis de ambiente do arquivo `.env`
2. Build da aplicação React com Vite (`npm run build`)
3. Gera arquivos estáticos otimizados em `/dist`
4. Copia `/dist` para imagem Nginx
5. Serve aplicação via Nginx na porta 8081

---

#### **Service: app (Desenvolvimento)**

| Configuração | Valor | Descrição |
|--------------|-------|-----------|
| **build** | `dockerfile: Dockerfile.dev` | Usa Dockerfile específico para dev |
| **ports** | `8080:8080` | Porta externa 8080 → porta interna 8080 (Vite dev server) |
| **volumes** | `.:/app` | Mapeia código fonte (hot reload) |
| **volumes** | `/app/node_modules` | NÃO mapeia node_modules (usa do container) |
| **environment** | `CHOKIDAR_USEPOLLING: true` | File watcher para Windows/WSL |
| **environment** | `VITE_API_URL` | URL da API backend (padrão: localhost:3001) |
| **environment** | `VITE_GOOGLE_MAPS_API_KEY` | Chave do Google Maps (do .env) |

**Como funciona (Desenvolvimento):**
1. Instala dependências dentro do container
2. NÃO copia código fonte (usa volume mapeado)
3. Inicia Vite dev server com hot reload
4. **Qualquer mudança** no código recarrega automaticamente
5. **Sem rebuild necessário!**

---

### **🚀 Comandos Docker**

```bash
# Iniciar ambiente completo (background)
docker-compose up -d

# Iniciar com rebuild (se alterou Dockerfile)
docker-compose up --build -d

# Parar ambiente (mantém volumes)
docker-compose down

# Ver logs em tempo real
docker-compose logs -f app

# Verificar status dos containers
docker-compose ps

# Entrar no container
docker-compose exec app sh

# Reiniciar apenas o app
docker-compose restart app
```

---

## 🚀 Desenvolvimento com Hot Reload

### **⚡ Problema: Rebuild a Cada Mudança**

**ANTES (Produção):**
```bash
# Fazia mudança no código
vim src/pages/Chamados.tsx

# Precisava rebuildar (lento!)
docker-compose down
docker-compose up --build  # 😓 2-5 minutos
```

**AGORA (Desenvolvimento):**
```bash
# Faz mudança no código
vim src/pages/Chamados.tsx

# Hot reload automático! ⚡
# Navegador recarrega sozinho em ~1 segundo
```

---

### **🎯 Como Usar: Desenvolvimento vs Produção**

#### **1️⃣ Desenvolvimento (Hot Reload) - RECOMENDADO**

```bash
# Iniciar ambiente de desenvolvimento
npm run docker:dev

# Ou direto:
docker-compose -f docker-compose.dev.yml up
```

**✅ O que acontece:**
- Vite dev server com hot reload
- Código fonte é **mapeado** do seu PC para o container
- **Qualquer mudança** no código recarrega automaticamente
- **Sem rebuild necessário!**
- Porta: **8080**

**📂 Arquivos monitorados (hot reload):**
- `src/**/*.{ts,tsx}` - Todo código TypeScript/React
- `src/**/*.css` - Estilos CSS
- `tailwind.config.ts` - Configuração Tailwind
- `index.html` - HTML raiz
- `vite.config.ts` - Configuração Vite

**⚠️ Quando precisa rebuild:**
- Alterou `package.json` (novas dependências)
- Alterou `Dockerfile.dev`

---

#### **2️⃣ Produção (sem Hot Reload)**

```bash
# Iniciar ambiente de produção
npm run docker:prod

# Ou direto:
docker-compose up -d
```

**📦 O que acontece:**
- Build completo da aplicação (`vite build`)
- Código copiado para dentro da imagem
- Otimizado e minificado
- Servido via **Nginx**
- **Requer rebuild** para mudanças
- Porta: **8081**

---

### **📋 Scripts NPM Disponíveis**

```bash
# DESENVOLVIMENTO (use estes no dia a dia!)
npm run docker:dev              # Inicia dev (hot reload)
npm run docker:dev:build        # Inicia dev com rebuild
npm run docker:dev:down         # Para ambiente dev
npm run docker:logs             # Ver logs em tempo real

# PRODUÇÃO (para testes de produção)
npm run docker:prod             # Inicia prod (background)
npm run docker:prod:build       # Inicia prod com rebuild
npm run docker:prod:down        # Para ambiente prod
```

---

### **🔧 Arquivos de Desenvolvimento**

#### **Dockerfile.dev**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar apenas package files
COPY package*.json ./

# Instalar TODAS as dependências (incluindo dev)
RUN npm ci

# ⚠️ NÃO copia src/ aqui!
# O código será mapeado via volume

EXPOSE 8080

# Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
```

#### **Dockerfile (Produção - Multi-stage)**
```dockerfile
# Estágio 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências (incluindo devDependencies para o build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Estágio 2: Servir com Nginx
FROM nginx:alpine

# Copiar build do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta (nginx.conf está em 8081)
EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
```

---

### **📊 Comparação: Dev vs Prod**

| Aspecto | Desenvolvimento (dev) | Produção (prod) |
|---------|----------------------|-----------------|
| **Hot Reload** | ✅ Sim (automático) | ❌ Não |
| **Rebuild necessário** | ❌ Não (exceto deps) | ✅ Sim (sempre) |
| **Velocidade mudanças** | ⚡ ~1 segundo | 🐢 2-5 minutos |
| **Arquivo usado** | `docker-compose.dev.yml` | `docker-compose.yml` |
| **Dockerfile** | `Dockerfile.dev` | `Dockerfile` |
| **Comando** | `npm run dev` (Vite) | Build + Nginx |
| **Node modules** | Do container | Do container |
| **Código fonte** | Volume mapeado | Copiado na imagem |
| **Porta** | `8080` | `8081` |
| **Tamanho** | ~500MB (com deps) | ~30MB (dist + nginx) |

---

### **🎬 Workflow de Desenvolvimento Típico**

#### **Dia a dia:**

```bash
# 1. Iniciar ambiente (só uma vez pela manhã)
npm run docker:dev

# 2. Acessar aplicação
# http://localhost:8080

# 3. Fazer mudanças no código
vim src/pages/Chamados.tsx

# 4. Salvar arquivo (Ctrl+S)
# ✅ Hot reload automático! Navegador recarrega sozinho

# 5. Fazer mais mudanças
vim src/components/ui/button.tsx

# ✅ Hot reload automático novamente!

# 6. Continuar desenvolvendo...
# Sem parar/rebuild

# 7. Quando terminar o dia
npm run docker:dev:down
```

#### **Quando adicionar nova dependência:**

```bash
# 1. Instalar nova lib
npm install axios

# 2. Rebuildar o container (só desta vez)
npm run docker:dev:build

# 3. Continuar desenvolvimento normalmente
# ✅ Hot reload volta a funcionar para mudanças de código
```

---

### **🔍 Troubleshooting**

#### **Hot reload não está funcionando:**

```bash
# 1. Verificar se está usando docker-compose.dev.yml
docker ps
# Deve mostrar: porta 8080 (não 8081)

# 2. Ver logs
npm run docker:logs

# Deve mostrar algo como:
# "VITE v5.x.x  ready in xxx ms"
# "➜  Local:   http://localhost:8080/"
```

#### **Erro "Cannot find module":**

```bash
# Provavelmente instalou nova dependência
# Rebuildar o container
npm run docker:dev:build
```

#### **Erro de porta em uso:**

```bash
# Verificar se há outro processo na porta 8080
lsof -ti:8080 | xargs kill -9

# Ou mudar a porta no docker-compose.dev.yml
ports:
  - "3000:8080"  # Porta externa 3000, interna continua 8080
```

#### **Build de produção com erro:**

```bash
# Ver logs detalhados
docker-compose logs

# Limpar tudo e recomeçar do zero
npm run docker:prod:down
docker system prune -f
docker volume prune -f
npm run docker:prod:build
```

---

### **🔧 Ordem de Inicialização**

```
1. docker-compose up -d
   ↓
2. Build da imagem (se --build)
   ↓
3. Container inicia
   ↓
4. (Dev) Vite dev server inicia
   (Prod) Nginx serve arquivos estáticos
   ↓
5. ✅ Aplicação disponível
   Dev: http://localhost:8080
   Prod: http://localhost:8081
```

---

### **⚙️ Variáveis de Ambiente Necessárias (.env)**

```bash
# API Backend URL
VITE_API_URL=http://localhost:3001

# Outras variáveis (se necessário)
# VITE_APP_NAME=Utiliza Dashboard
# VITE_ENABLE_DEBUG=true
```

**⚠️ Importante:**
- Variáveis devem ter prefixo `VITE_` para serem acessíveis no código
- Acessadas via `import.meta.env.VITE_API_URL`
- Não incluir no `.env` informações sensíveis (será exposto no bundle JS)

---

### **📝 Boas Práticas**

#### **✅ FAZER:**
- ✅ Usar `npm run docker:dev` para desenvolvimento
- ✅ Deixar o container rodando enquanto trabalha
- ✅ Fazer commits frequentes
- ✅ Parar o ambiente ao fim do dia (`docker:dev:down`)
- ✅ Ver logs quando algo não funciona (`docker:logs`)
- ✅ Rebuild após instalar dependências

#### **❌ NÃO FAZER:**
- ❌ Usar `docker-compose.yml` (produção) para desenvolvimento
- ❌ Fazer `docker-compose up --build` a cada mudança
- ❌ Editar arquivos dentro do container (edite no seu PC!)
- ❌ Deletar `node_modules` local (container usa o dele)
- ❌ Mapear `node_modules` no volume (causa conflitos)

---

### **🆘 Comandos Úteis de Debug**

```bash
# Ver logs em tempo real
npm run docker:logs
docker-compose -f docker-compose.dev.yml logs -f app

# Entrar no container para debug
docker exec -it <container-name> sh
ls -la /app/src  # Ver se código está mapeado
npm run dev      # Testar comando manualmente

# Reiniciar apenas o app (sem rebuild)
docker-compose -f docker-compose.dev.yml restart app

# Limpar tudo e recomeçar do zero
npm run docker:dev:down
docker system prune -f
docker volume prune -f
npm run docker:dev:build

# Verificar volumes montados
docker inspect <container-name> | grep -A 20 Mounts

# Ver variáveis de ambiente do container
docker exec <container-name> env | grep VITE
```

---

### **🎯 Resumo: Qual Usar?**

```bash
# 👨‍💻 DESENVOLVIMENTO (dia a dia)
npm run docker:dev        # ← Use este 99% do tempo!
# ⚡ Hot reload automático
# 🚀 Produtividade máxima
# 💾 Sem rebuild necessário

# 🏭 PRODUÇÃO (testes de produção)
npm run docker:prod       # ← Use para testar build de prod
# 📦 Build completo
# 🔒 Ambiente idêntico ao deploy
# 🐢 Requer rebuild para mudanças
```

---

### **📊 Fluxo Visual: Dev vs Prod**

#### **DESENVOLVIMENTO (Hot Reload):**
```
Código local (seu PC)
        ↓ (volume mapeado)
Container (Vite dev server)
        ↓ (detecta mudança)
Reload automático (~1s)
        ↓
✅ Navegador atualizado
```

#### **PRODUÇÃO (Build):**
```
Código local (seu PC)
        ↓ (COPY no Dockerfile)
Build da imagem (2-5min)
        ↓
Build Vite (npm run build)
        ↓
Container (Nginx serve /dist)
        ↓
✅ Aplicação atualizada

// Mudança no código? Rebuild completo novamente!
```

---

## 📁 ESTRUTURA DE DIRETÓRIOS

```
/var/www/utiliza/utiliza-front-assistencia/
├── public/                         # Arquivos públicos estáticos
│   └── favicon.ico
│
├── src/                            # Código fonte TypeScript/React
│   ├── main.tsx                   # ⚙️ Entry point da aplicação
│   ├── App.tsx                    # 🚀 Componente raiz com rotas
│   ├── index.css                  # 🎨 Estilos globais + Tailwind
│   │
│   ├── components/                # 🧩 Componentes React
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (50+ componentes)
│   │   │
│   │   ├── layout/               # Layouts principais
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── dashboard/            # Componentes do dashboard
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── AttendanceTable.tsx
│   │   │   ├── AttendanceChart.tsx
│   │   │   └── QuickStats.tsx
│   │   │
│   │   ├── chamados/             # Componentes de chamados
│   │   │   └── chamadoFormModal.tsx
│   │   │
│   │   ├── ProtectedRoute.tsx   # HOC para rotas protegidas
│   │   └── NavLink.tsx          # Link de navegação ativo
│   │
│   ├── pages/                     # 📄 Páginas (rotas)
│   │   ├── Login.tsx             # Login/autenticação
│   │   ├── Index.tsx             # Dashboard principal
│   │   ├── Atendimentos.tsx      # Lista de atendimentos
│   │   ├── AtendimentoDetalhes.tsx  # Detalhes de atendimento
│   │   └── Chamados.tsx          # Lista de chamados (GUINCHO)
│   │
│   ├── services/                  # 🔌 Serviços de API
│   │   ├── atendimentos.service.ts  # Serviço de atendimentos
│   │   └── calls.service.ts         # Serviço de chamados (GUINCHO)
│   │
│   ├── lib/                       # 🛠️ Bibliotecas e utilitários
│   │   ├── api.ts                # Cliente Axios configurado
│   │   └── utils.ts              # Funções utilitárias (cn, formatters)
│   │
│   └── contexts/                  # 🔄 Contextos React
│       └── SidebarContext.tsx    # Estado global do sidebar
│
├── components.json                # ⚙️ Configuração shadcn/ui
├── tailwind.config.ts             # ⚙️ Configuração Tailwind CSS
├── tsconfig.json                  # ⚙️ Configuração TypeScript
├── vite.config.ts                 # ⚙️ Configuração Vite
├── package.json                   # 📦 Dependências Node.js
│
├── Dockerfile                     # 🐳 Produção (build + nginx)
├── Dockerfile.dev                 # 🐳 Desenvolvimento (vite dev)
├── docker-compose.yml             # 🐳 Compose produção
├── docker-compose.dev.yml         # 🐳 Compose desenvolvimento
├── nginx.conf                     # ⚙️ Configuração Nginx
│
├── .env.example                   # 🔐 Template de variáveis
└── README.md                      # 📖 Documentação
```

---

## 🎨 PADRÕES DE CÓDIGO

### **1. COMUNICAÇÃO COM A API**

#### **📡 Cliente HTTP (lib/api.ts)**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redireciona para login (exceto se já está na tela de login)
      const isLoginRequest = error.config?.url?.includes('/api/login');
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

#### **🔧 Padrão de Services (services/*.service.ts)**

**Estrutura Base:**

```typescript
import api from '@/lib/api';

// ============================================
// ENUMS (Exatamente iguais aos da API)
// ============================================
export enum CallTowingStatus {
  waiting_driver_accept = "waiting_driver_accept",
  waiting_arrival_to_checkin = "waiting_arrival_to_checkin",
  in_checking = "in_checking",
  // ...
}

export enum TowingServiceType {
  towing = "towing",
  battery = "battery",
  tire_change = "tire_change",
  // ...
}

// ============================================
// INTERFACES (Tipagem da resposta da API)
// ============================================
export interface Call {
  id: string;
  towing_status: CallTowingStatus;
  towing_service_type: TowingServiceType;
  association: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  associate_cars?: AssociateCar | null;
  towing_drivers?: TowingDriver | null;
}

export interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface CallsResponse {
  data: Call[];
  pagination: Pagination;
}

export interface CallsFilters {
  page?: number;
  limit?: number;
  status?: string;
  towing_service_type?: string;
  association?: string;
  search?: string;
}

// ============================================
// INTERFACES - CHAMADOS EM ABERTO (Monitoramento)
// ============================================
export interface OpenCall {
  id: string;
  towing_status: string;
  towing_service_type: string;
  address: string;
  associado: {
    id: string;
    name: string;
    phone: string;
    cpf: string;
    association: string;  // Associação do associado (ex: "solidy", "nova")
  } | null;
  atendente: {
    id: string;
    name: string;
    email: string;
  } | null;
  veiculo: {
    id: string;
    plate: string;
    model: string;
    brand: string;
    color: string;
    year: string;
    category: string | null;
  } | null;
  motorista: {
    id: string;
    name: string;
    phone: string;
    status?: string;
    profile_image_path?: string;
  } | null;
  created_at: string;                      // String pré-formatada pela API
  expected_arrival_date: string | null;    // String pré-formatada ou null
  expected_completion_date: string | null; // String pré-formatada ou null
  towing_distance_km: number | null;       // Métrica: Distância em km
  towing_arrival_time_minutes: number | null; // Métrica: Tempo de chegada em minutos
  service_duration: string | null;         // Métrica: Duração do serviço (pré-formatada)
  timeStatus: string;                      // "on_time" | "alert" | "delayed"
}

export interface OpenCallsResponse {
  data: OpenCall[];
  pagination: Pagination;
  summary: {
    delayed: number;   // Total de chamados atrasados (todas as páginas)
    alert: number;     // Total de chamados em alerta (todas as páginas)
    on_time: number;   // Total de chamados no prazo (todas as páginas)
  };
}

// ============================================
// LABELS & VARIANTS (UI)
// ============================================
export const callTowingStatusLabels: Record<CallTowingStatus, string> = {
  waiting_driver_accept: "Aguardando aceite do motorista",
  waiting_arrival_to_checkin: "Aguardando chegada para checkin",
  // ...
};

export const callTowingStatusVariants: Record<CallTowingStatus, "default" | "secondary" | "success" | "destructive"> = {
  waiting_driver_accept: "secondary",
  finished: "success",
  cancelled: "destructive",
  // ...
};

// ============================================
// SERVICE (Métodos de API)
// ============================================
export const callsService = {
  /**
   * GET /api/calls/guinchos
   * Busca chamados de guincho com filtros e paginação
   */
  getAll: async (filters: CallsFilters = {}): Promise<CallsResponse> => {
    const { page = 1, limit = 10, status, towing_service_type, association, search } = filters;

    const params: Record<string, string | number> = { page, limit };
    if (status && status !== 'todos') params.status = status;
    if (towing_service_type && towing_service_type !== 'todos') params.towing_service_type = towing_service_type;
    if (association && association !== 'todos') params.association = association;
    if (search && search.trim()) params.search = search.trim();

    const { data } = await api.get<CallsResponse>('/api/calls/guinchos', { params });
    return data;
  },

  /**
   * GET /api/calls/guinchos/open
   * Busca chamados de guincho em aberto para monitoramento
   * Retorna dados otimizados para a página de acompanhamento em tempo real
   *
   * @param page - Número da página (padrão: 1)
   * @param limit - Quantidade de registros por página (padrão: 50)
   * @param association - Filtro opcional por associação (solidy, nova, motoclub, aprovel)
   */
  getOpenCalls: async (
    page: number = 1,
    limit: number = 50,
    association?: string
  ): Promise<OpenCallsResponse> => {
    const params: Record<string, string | number> = { page, limit };

    if (association && association !== 'todos') {
      params.association = association;
    }

    const { data } = await api.get<OpenCallsResponse>('/api/calls/guinchos/open', {
      params,
    });
    return data;
  },

  /**
   * GET /api/calls/guinchos/:id
   * Busca um chamado específico por ID
   */
  getById: async (id: string): Promise<Call> => {
    const { data } = await api.get<Call>(`/api/calls/guinchos/${id}`);
    return data;
  },
};
```

**⚠️ Regras Importantes:**

1. **Sempre usar `api` (cliente configurado)** - Nunca usar `axios` diretamente
2. **Tipagem completa** - Interfaces para request/response
3. **Enums sincronizados** - Mesmos valores da API backend
4. **Labels separados** - Para exibição amigável na UI
5. **Validação de filtros** - Remover valores vazios antes de enviar
6. **Error handling** - Deixar para o interceptor global

---

### **2. COMPONENTES UI (shadcn/ui)**

#### **📦 Componentes Base (src/components/ui/)**

Todos os componentes UI seguem o padrão shadcn/ui com Radix UI + Tailwind:

```typescript
import { cn } from "@/lib/utils"; // Merge de classes Tailwind
import { cva, type VariantProps } from "class-variance-authority"; // Variantes

// Exemplo: Button
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Componentes Disponíveis:**
- `Button`, `Input`, `Select`, `Checkbox`, `Switch`
- `Card`, `Badge`, `Alert`, `Dialog`, `Popover`
- `Table`, `Tabs`, `Accordion`, `Dropdown Menu`
- `Sidebar`, `Sheet`, `Drawer`, `Tooltip`
- `Form`, `Label`, `Calendar`, `Command`
- E mais 40+ componentes prontos

---

#### **🎯 Padrão de Componentes de Página**

```typescript
// src/pages/Chamados.tsx
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Plus } from "lucide-react"; // Ícones
import { callsService, type Call, type Pagination } from "@/services/calls.service";

export default function Chamados() {
  // Estados
  const [chamados, setChamados] = useState<Call[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Buscar dados
  useEffect(() => {
    async function fetchChamados() {
      try {
        setLoading(true);
        const response = await callsService.getAll({
          page: currentPage,
          limit: 10,
          status: statusFilter !== "todos" ? statusFilter : undefined,
          search: searchTerm || undefined,
        });
        setChamados(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchChamados();
  }, [currentPage, statusFilter, searchTerm]);

  return (
    <DashboardLayout title="Chamados" subtitle="Gerencie os chamados de assistência">
      {/* Barra de Busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, placa ou endereço..."
            className="pl-10 h-11 rounded-xl border-border/50 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[220px] h-10 rounded-xl">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="waiting_driver_accept">Aguardando aceite</SelectItem>
            {/* ... mais opções */}
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-3">
          <Button variant="outline" className="h-10 rounded-xl gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="h-10 rounded-xl gap-2">
            <Plus className="h-4 w-4" />
            Novo Chamado
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <Card className="rounded-2xl border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle>Lista de Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chamados.map((chamado) => (
                  <TableRow key={chamado.id}>
                    <TableCell className="font-mono">#CH-{chamado.id}</TableCell>
                    <TableCell>{chamado.associate_cars?.associates?.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{chamado.towing_service_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant}>{statusLabel}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
```

**⚠️ Padrões Importantes:**

1. **Layout consistente** - Sempre usar `DashboardLayout` nas páginas
2. **Busca em linha separada** - Campo de busca ocupa linha completa
3. **Filtros em linha** - Selects lado a lado com botões à direita
4. **Cards arredondados** - `rounded-2xl` para cards principais
5. **Altura consistente** - `h-10` para inputs/buttons, `h-11` para busca
6. **Loading states** - Sempre mostrar feedback de carregamento
7. **Error handling** - Try/catch em todas as chamadas de API
8. **Tipagem completa** - Usar interfaces do service

---

### **3. CORES & DESIGN SYSTEM**

#### **🎨 Paleta de Cores (Tailwind CSS)**

Definidas em `tailwind.config.ts` usando variáveis CSS (HSL):

```typescript
colors: {
  // Cores base do sistema
  border: "hsl(var(--border))",           // Bordas
  input: "hsl(var(--input))",             // Inputs
  ring: "hsl(var(--ring))",               // Focus rings
  background: "hsl(var(--background))",   // Fundo da página
  foreground: "hsl(var(--foreground))",   // Texto principal

  // Cores primárias
  primary: {
    DEFAULT: "hsl(var(--primary))",       // Azul principal
    foreground: "hsl(var(--primary-foreground))",
  },

  // Cores semânticas
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",   // Vermelho (erros)
    foreground: "hsl(var(--destructive-foreground))",
  },
  success: {
    DEFAULT: "hsl(var(--success))",       // Verde (sucesso)
    foreground: "hsl(var(--success-foreground))",
  },
  warning: {
    DEFAULT: "hsl(var(--warning))",       // Amarelo (avisos)
    foreground: "hsl(var(--warning-foreground))",
  },

  // Cores de UI
  muted: {
    DEFAULT: "hsl(var(--muted))",         // Fundo secundário
    foreground: "hsl(var(--muted-foreground))", // Texto secundário
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",        // Destaque
    foreground: "hsl(var(--accent-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",          // Fundo de cards
    foreground: "hsl(var(--card-foreground))",
  },

  // Sidebar
  sidebar: {
    DEFAULT: "hsl(var(--sidebar-background))",
    foreground: "hsl(var(--sidebar-foreground))",
    primary: "hsl(var(--sidebar-primary))",
    accent: "hsl(var(--sidebar-accent))",
    border: "hsl(var(--sidebar-border))",
  },
}
```

**Valores definidos em `src/index.css`:**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 221.2 83.2% 53.3%;
  --success: 142.1 76.2% 36.3%;
  --warning: 38 92% 50%;
  --destructive: 0 84.2% 60.2%;
  /* ... mais variáveis */
}
```

---

#### **📐 Espaçamento & Bordas**

```typescript
borderRadius: {
  lg: "var(--radius)",              // 0.5rem (8px)
  md: "calc(var(--radius) - 2px)", // 0.375rem (6px)
  sm: "calc(var(--radius) - 4px)", // 0.25rem (4px)
}

// Uso no código:
rounded-xl   // 0.75rem (12px) - Padrão para inputs/buttons
rounded-2xl  // 1rem (16px) - Padrão para cards
rounded-lg   // var(--radius) - 8px
```

---

#### **🌑 Sombras**

```typescript
boxShadow: {
  'xs': 'var(--shadow-xs)',        // Sombra mínima
  'soft': 'var(--shadow-sm)',      // Sombra suave (padrão cards)
  'medium': 'var(--shadow-md)',    // Sombra média
  'large': 'var(--shadow-lg)',     // Sombra grande
  'xl': 'var(--shadow-xl)',        // Sombra extra-grande
  'glow': 'var(--shadow-glow)',    // Glow effect
}

// Uso:
shadow-soft   // Padrão para cards
shadow-medium // Dropdowns/modais
shadow-large  // Elementos flutuantes
```

---

#### **🔤 Tipografia**

```typescript
fontFamily: {
  sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
}

// Classes Tailwind:
text-sm      // 0.875rem (14px) - Textos pequenos
text-base    // 1rem (16px) - Texto padrão
text-lg      // 1.125rem (18px) - Títulos de cards
text-xl      // 1.25rem (20px) - Títulos de seções
text-2xl     // 1.5rem (24px) - Títulos de páginas

font-medium  // 500 - Textos destacados
font-semibold // 600 - Títulos
font-bold    // 700 - Títulos principais
```

---

#### **🎨 Variantes de Badge**

```typescript
// Padrão de cores para badges de status
const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success text-success-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  warning: "bg-warning text-warning-foreground",
  outline: "border border-input bg-background",
};

// Uso:
<Badge variant="success">Finalizado</Badge>
<Badge variant="secondary">Aguardando</Badge>
<Badge variant="destructive">Cancelado</Badge>
```

---

### **4. PADRÕES DE CSS & ESTILIZAÇÃO**

#### **✅ FAZER:**

```typescript
// 1. Usar classes Tailwind utilitárias
<div className="flex items-center gap-3 p-4 rounded-xl bg-card">

// 2. Usar cn() para merge de classes
import { cn } from "@/lib/utils";
<Button className={cn("h-10", isActive && "bg-primary")}>

// 3. Usar variáveis CSS do design system
className="bg-primary text-primary-foreground"

// 4. Espaçamento consistente
gap-3     // 0.75rem - Gap entre elementos pequenos
gap-4     // 1rem - Gap padrão
mb-4      // 1rem - Margin bottom padrão entre seções
mb-6      // 1.5rem - Margin maior entre seções principais
p-4       // 1rem - Padding interno de cards

// 5. Bordas arredondadas consistentes
rounded-xl   // Inputs, buttons, selects
rounded-2xl  // Cards principais
rounded-lg   // Cards menores, badges

// 6. Transições suaves
transition-all duration-300
transition-colors
hover:bg-accent
```

#### **❌ NÃO FAZER:**

```typescript
// ❌ CSS inline
<div style={{ color: 'red', padding: '10px' }}>

// ❌ Classes CSS customizadas sem necessidade
<div className="my-custom-card-style">

// ❌ Valores hardcoded de cores
className="bg-[#3b82f6]"  // Use "bg-primary"

// ❌ Tamanhos inconsistentes
className="h-9"  // Use "h-10" ou "h-11" (padrão)
```

---

### **5. FORMATAÇÃO DE DADOS**

**Utilitários em `lib/utils.ts`:**

```typescript
// Formatar telefone
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

// Formatar data/hora
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy HH:mm");
}

// Formatar CPF
export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Merge de classes Tailwind
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Uso:**
```typescript
import { formatPhone, formatDateTime, cn } from "@/lib/utils";

<p>{formatPhone(user.phone)}</p>
<span>{formatDateTime(call.created_at)}</span>
<Button className={cn("h-10", isActive && "bg-primary")} />
```

---

## 🛣️ ROTAS & NAVEGAÇÃO

### **Estrutura de Rotas (App.tsx)**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Index from './pages/Index'; // Dashboard
import Atendimentos from './pages/Atendimentos';
import AtendimentoDetalhes from './pages/AtendimentoDetalhes';
import Chamados from './pages/Chamados'; // GUINCHO

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas (requer autenticação) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Index />} />
          <Route path="/atendimentos" element={<Atendimentos />} />
          <Route path="/atendimentos/:id" element={<AtendimentoDetalhes />} />
          <Route path="/chamados" element={<Chamados />} />
        </Route>
      </Routes>
    </Router>
  );
}
```

### **Navegação no Sidebar**

```typescript
// src/components/dashboard/Sidebar.tsx
import { NavLink } from '../NavLink';
import { Home, FileText, Phone } from 'lucide-react';

<nav>
  <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
  <NavLink to="/atendimentos" icon={FileText}>Atendimentos</NavLink>
  <NavLink to="/chamados" icon={Phone}>Chamados</NavLink>
</nav>
```

#### **Estado Ativo dos Menus**

O Sidebar mantém os itens de menu ativos tanto nas páginas de listagem quanto nas páginas de detalhes. Isso garante que o usuário sempre saiba em qual seção está navegando.

```typescript
// src/components/dashboard/Sidebar.tsx
const isActive =
  location.pathname === item.href ||
  (item.href === "/atendimentos" && location.pathname.startsWith("/atendimentos/")) ||
  (item.href === "/chamados" && location.pathname.startsWith("/chamados/"));
```

**Comportamento:**
- `/atendimentos` → Menu "Atendimentos" ativo
- `/atendimentos/123` → Menu "Atendimentos" continua ativo
- `/chamados` → Menu "Chamados" ativo
- `/chamados/456` → Menu "Chamados" continua ativo

---

## 🔐 AUTENTICAÇÃO

### **Fluxo JWT**

```
1. Usuário faz login → POST /api/login { email, password }
2. API valida credenciais e retorna token JWT
3. Frontend armazena token → localStorage.setItem('token', token)
4. Todas as requisições incluem token → Authorization: Bearer <token>
5. Se 401, redireciona para login → window.location.href = '/'
```

### **ProtectedRoute Component**

```typescript
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
```

### **Login Page**

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const { data } = await api.post('/api/login', { email, password });
    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    setError('Credenciais inválidas');
  }
};
```

---

## 📝 CONVENÇÕES DE CÓDIGO

### **Nomenclatura**

- **Componentes**: PascalCase (ex: `DashboardLayout.tsx`, `MetricCard.tsx`)
- **Arquivos de página**: PascalCase (ex: `Chamados.tsx`, `Index.tsx`)
- **Services**: camelCase com sufixo `.service.ts` (ex: `calls.service.ts`)
- **Utilitários**: camelCase (ex: `utils.ts`, `api.ts`)
- **Funções**: camelCase (ex: `formatPhone()`, `fetchChamados()`)
- **Interfaces/Types**: PascalCase (ex: `Call`, `CallsResponse`, `Pagination`)
- **Variáveis**: camelCase (ex: `chamados`, `currentPage`, `searchTerm`)

### **Imports**

```typescript
// 1. React imports
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Componentes externos
import { Loader2, Search, Plus } from 'lucide-react';

// 3. Componentes UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 4. Componentes internos
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// 5. Services e libs
import { callsService, type Call, type Pagination } from '@/services/calls.service';
import { formatPhone, formatDateTime } from '@/lib/utils';
```

### **TypeScript**

```typescript
// ✅ Sempre tipar parâmetros e retornos
async function fetchChamados(): Promise<void> { }

// ✅ Usar interfaces para objetos complexos
interface Props {
  id: string;
  onClose: () => void;
}

// ✅ Usar enums para valores fixos
enum Status {
  Active = "active",
  Inactive = "inactive",
}

// ✅ Usar tipos do service
const [chamados, setChamados] = useState<Call[]>([]);
```

---

## 🎨 PADRÕES DE UI - TABELAS DE ATENDIMENTOS

### **📋 Estrutura Padrão**

As tabelas de atendimentos (Dashboard e página Atendimentos) seguem um padrão consistente para manter a experiência do usuário uniforme.

#### **Colunas Padrão**

| Coluna | Largura | Conteúdo | Formatação |
|--------|---------|----------|------------|
| **ID** | `w-[80px]` | Identificador único | `#AT-{id}` em font-mono com text-primary |
| **Cliente** | Flexível | Associação do cliente | Capitalizado |
| **Plataforma** | Flexível | Canal de atendimento | Capitalizado (whatsapp, retell, vonage, webchat) |
| **Usuário** | Flexível | Avatar + Nome + Telefone | Avatar bg-muted com ícone User |
| **Tipo** | Flexível | Motivo da solicitação | Badge secondary rounded-lg |
| **Status** | Flexível | Status atual | Badge com ícone + label (variants: default/secondary/outline/destructive) |
| **Data/Hora** | `w-[150px]` | Timestamp de criação | `formatDateTime()` em text-muted-foreground |
| **Ações** | `w-[50px]` | Menu de ações | DropdownMenu com opacity-0 group-hover:opacity-100 |

---

### **⚙️ Configurações Necessárias**

#### **1. statusConfig - Mapeamento de Status**

```typescript
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: any }> = {
  waiting_initial_message: { label: "Aguardando Mensagem Inicial", variant: "secondary", icon: Clock },
  waiting_identification: { label: "Aguardando Identificação", variant: "secondary", icon: AlertCircle },
  waiting_request_reason: { label: "Aguardando Motivo do Pedido", variant: "secondary", icon: AlertCircle },
  answering_service_form: { label: "Respondendo Formulário", variant: "default", icon: Clock },
  waiting_understanding_wpp_flow: { label: "Aguardando Compreensão do Fluxo WPP", variant: "secondary", icon: Clock },
  waiting_origin_location: { label: "Aguardando Local de Origem", variant: "secondary", icon: MapPin },
  waiting_destination_location: { label: "Aguardando Local de Destino", variant: "secondary", icon: MapPin },
  transferred: { label: "Transferido", variant: "default", icon: CheckCircle2 },
  finished: { label: "Finalizado", variant: "outline", icon: CheckCircle2 },
  finished_with_pending_issues: { label: "Finalizado com Pendências", variant: "destructive", icon: AlertCircle },
};
```

**Ícones necessários:** `Clock`, `AlertCircle`, `CheckCircle2`, `MapPin` do `lucide-react`

#### **2. requestReasonConfig - Tipos de Solicitação**

```typescript
const requestReasonConfig: Record<string, string> = {
  collision: "Colisão",
  fire: "Incêndio",
  natural_events: "Eventos Naturais",
  breakdown_by_mechanical_failure_or_electric: "Pane Mecânica ou Elétrica",
  flat_tire: "Pneu Furado",
  battery_failure: "Falha na Bateria",
  locked_vehicle: "Veículo Trancado",
  empty_tank: "Tanque Vazio",
  theft_or_robbery: "Furto ou Roubo",
};

function getRequestReasonLabel(reason: string | null): string {
  if (!reason) return "—";
  return requestReasonConfig[reason] || reason;
}
```

---

### **🔧 Estrutura do Componente de Tabela**

#### **Imports Necessários**

```typescript
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Phone,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin
} from "lucide-react";
import { formatPhone, formatDateTime } from "@/lib/utils";
```

#### **TableRow - Padrão de Navegação**

```typescript
<TableRow
  key={attendance.id}
  className="group cursor-pointer hover:bg-muted/50 transition-all duration-200 border-b border-border/30"
  onClick={() => navigate(`/atendimentos/${attendance.id}`)}
>
  {/* Colunas */}
</TableRow>
```

**Classes importantes:**
- `group` - Permite controlar visibilidade de elementos filhos no hover
- `cursor-pointer` - Indica que a linha é clicável
- `hover:bg-muted/50` - Destaque visual no hover

#### **Coluna ID**

```typescript
<TableCell className="font-mono text-sm font-medium text-primary">
  #AT-{attendance.id}
</TableCell>
```

#### **Coluna Cliente**

```typescript
<TableCell className="capitalize text-sm">
  {attendance.association}
</TableCell>
```

#### **Coluna Plataforma**

```typescript
<TableCell className="capitalize text-sm">
  {attendance.plataform}
</TableCell>
```

#### **Coluna Usuário (Avatar + Nome + Telefone)**

```typescript
<TableCell>
  <div className="flex items-center gap-3">
    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
      <User className="h-4 w-4 text-muted-foreground" />
    </div>
    <div>
      <p className="font-medium text-sm">
        {attendance.associate_cars?.associates?.name || "—"}
      </p>
      <p className="text-xs text-muted-foreground">
        {attendance.associate_cars?.associates?.phone
          ? formatPhone(attendance.associate_cars.associates.phone)
          : "—"}
      </p>
    </div>
  </div>
</TableCell>
```

#### **Coluna Tipo (Request Reason)**

```typescript
<TableCell>
  <Badge variant="secondary" className="rounded-lg">
    {getRequestReasonLabel(attendance.request_reason)}
  </Badge>
</TableCell>
```

#### **Coluna Status (Com Ícone)**

```typescript
<TableCell>
  <Badge variant={statusInfo.variant} className="gap-1.5 rounded-lg">
    <StatusIcon className="h-3 w-3" />
    {statusInfo.label}
  </Badge>
</TableCell>
```

**Preparação do status:**
```typescript
const statusInfo = statusConfig[attendance.status] || {
  label: attendance.status,
  variant: "secondary" as const,
  icon: AlertCircle
};
const StatusIcon = statusInfo.icon;
```

#### **Coluna Data/Hora**

```typescript
<TableCell className="text-muted-foreground text-sm">
  {formatDateTime(attendance.created_at)}
</TableCell>
```

#### **Coluna Ações (DropdownMenu)**

```typescript
<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>Ações</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
        <Phone className="h-4 w-4 mr-2" />
        Ligar: {formatPhone(attendance.phone)}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
```

**⚠️ Importante:**
- `onClick={(e) => e.stopPropagation()}` - Evita que o click no dropdown/menu acione o click da linha
- `opacity-0 group-hover:opacity-100` - Botão só aparece no hover da linha
- `align="end"` - Dropdown alinha à direita

---

### **📍 Locais de Implementação**

1. **Dashboard** - `src/components/dashboard/AttendanceTable.tsx`
   - Tabela "Atendimentos Recentes"
   - Mostra últimos atendimentos
   - Botão "Ver todos" navega para `/atendimentos`

2. **Página Atendimentos** - `src/pages/Atendimentos.tsx`
   - Tabela completa com paginação
   - Inclui filtros (status, tipo, plataforma)
   - Busca por usuário/telefone

---

### **🎯 Checklist de Consistência**

Ao criar/modificar tabelas de atendimentos, verificar:

- [ ] Formato do ID: `#AT-{id}` com `text-primary`
- [ ] Status tem ícone ao lado do label
- [ ] Avatar do usuário usa `bg-muted` com ícone `User`
- [ ] Telefone formatado com `formatPhone()`
- [ ] Data formatada com `formatDateTime()`
- [ ] Linha tem classes `group cursor-pointer hover:bg-muted/50`
- [ ] Click na linha navega para `/atendimentos/{id}`
- [ ] DropdownMenu tem `stopPropagation()` nos clicks
- [ ] Botão de ações tem `opacity-0 group-hover:opacity-100`
- [ ] Tipos de solicitação mostram labels em português
- [ ] Plataforma e Cliente são capitalizados

---

## 📞 CRIAÇÃO DE CHAMADOS

### **🔄 Fluxo de Criação de Chamados de Guincho**

O sistema permite criar chamados de guincho através de um modal com integração completa com a API.

#### **Endpoints Utilizados**

| Método | Endpoint | Parâmetros | Descrição |
|--------|----------|------------|-----------|
| GET | `/api/associates/search` | `name`, `association` | Busca associados conforme usuário digita |
| POST | `/api/calls/guinchos` | Body com dados do chamado | Cria novo chamado de guincho |

---

### **🔍 Busca de Associados**

#### **Endpoint: GET /api/associates/search**

**Query Parameters:**
```typescript
{
  name: string;        // Nome do associado (min. 2 caracteres)
  association: string; // solidy | nova | motoclub | aprovel
}
```

**Resposta:**
```typescript
{
  query: {
    name: string;
    association: string;
  };
  total: number;
  data: Array<{
    id: number;
    nome: string;
    cpf: string;
    email: string;
    tel_celular: string;
    association: string;
    vehicles: Array<{
      id: number;
      placa: string;
      chassi: string;
      ano_modelo: string;
      marca: string;
      modelo: string;
      cor: string;
    }>;
  }>;
}
```

#### **Implementação no Frontend**

**Service (calls.service.ts):**
```typescript
export interface ILevaVehicle {
  id: number;
  placa: string;
  chassi: string;
  ano_modelo: string;
  marca: string;
  modelo: string;
  cor: string;
}

export interface ILevaAssociate {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  tel_celular: string;
  association: string;
  vehicles: ILevaVehicle[];
}

export interface ILevaAssociateSearchResponse {
  query: { name: string; association: string };
  total: number;
  data: ILevaAssociate[];
}

// Método de busca
searchAssociates: async (name: string, association: string): Promise<ILevaAssociateSearchResponse> => {
  const { data } = await api.get<ILevaAssociateSearchResponse>('/api/associates/search', {
    params: { name, association },
  });
  return data;
}
```

**Modal (chamadoFormModal.tsx):**
```typescript
// Estados
const [associates, setAssociates] = useState<ILevaAssociate[]>([]);
const [associateSearchQuery, setAssociateSearchQuery] = useState("");
const [isSearchingAssociates, setIsSearchingAssociates] = useState(false);

// Busca com debounce de 500ms
useEffect(() => {
  const association = watch("association");

  if (!associateSearchQuery || associateSearchQuery.trim().length < 2 || !association) {
    setAssociates([]);
    return;
  }

  setIsSearchingAssociates(true);

  const timer = setTimeout(async () => {
    try {
      const response = await callsService.searchAssociates(associateSearchQuery.trim(), association);
      setAssociates(response.data);
    } catch (error) {
      console.error("Erro ao buscar associados:", error);
      setAssociates([]);
    } finally {
      setIsSearchingAssociates(false);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [associateSearchQuery, watch]);
```

**UI - Command Component:**
```typescript
<Command shouldFilter={false}>
  <CommandInput
    placeholder="Buscar por nome..."
    value={associateSearchQuery}
    onValueChange={setAssociateSearchQuery}
  />
  <CommandList>
    <CommandEmpty>
      {associateSearchQuery.length < 2
        ? "Digite pelo menos 2 caracteres para buscar"
        : isSearchingAssociates
          ? "Buscando..."
          : "Nenhum associado encontrado."}
    </CommandEmpty>
    <CommandGroup>
      {associates.map((associate) => (
        <CommandItem
          key={associate.id}
          value={associate.nome}
          onSelect={() => {
            setSelectedAssociate(associate);
            setValue("associate_id", String(associate.id));
            // ... atualizar veículos
          }}
        >
          <div>
            <p className="font-medium">{associate.nome}</p>
            <p className="text-xs text-muted-foreground">
              {formatCPF(associate.cpf)}
            </p>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</Command>
```

**Formatação de CPF:**
```typescript
function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf;
}
```

---

### **📝 Criação do Chamado**

#### **Endpoint: POST /api/calls/guinchos**

**Request Body:**
```typescript
{
  associate_car_id: number;           // ID do veículo do associado
  address: string;                    // Endereço de origem completo
  association: string;                // solidy | nova | motoclub | aprovel
  towing_service_type: string;        // towing | battery | tire_change | etc.
  observation?: string;               // Observações sobre o chamado
  location: {
    latitude: number;                 // Coordenada de origem
    longitude: number;
  };
  uf_id: number;                      // ID do estado (1 = padrão)
  city_id: number;                    // ID da cidade (1 = padrão)
  destination?: {                     // Apenas para serviços de reboque
    address?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}
```

**Resposta:**
```typescript
{
  id: string;
  towing_service_type: string;
  associate_car_id: string;
  address: string;
  observation: string | null;
  towing_status: string;
  association: string;
  created_at: string;
  // ... outros campos
}
```

#### **Implementação no Frontend**

**Interface do Payload:**
```typescript
export interface CreateTowingCallPayload {
  associate_car_id: number;
  address: string;
  association: string;
  towing_service_type: string;
  observation?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  uf_id: number;
  city_id: number;
  destination?: {
    address?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}
```

**Service Method:**
```typescript
createTowingCall: async (payload: CreateTowingCallPayload): Promise<Call> => {
  const { data } = await api.post<Call>('/api/calls/guinchos', payload);
  return data;
}
```

**Submissão do Formulário:**
```typescript
const onSubmit = async (data: ChamadoFormData) => {
  setIsSubmitting(true);
  try {
    const payload: any = {
      associate_car_id: parseInt(data.associate_vehicle_id),
      address: data.address,
      association: data.association,
      towing_service_type: data.towing_service_type,
      observation: data.observation || undefined,
      location: {
        latitude: data.location.lat,
        longitude: data.location.lng,
      },
      uf_id: 1,    // TODO: Obter do endereço via geocoding
      city_id: 1,  // TODO: Obter do endereço via geocoding
    };

    // Se for serviço de reboque, incluir destino
    if (showDestination && data.destination?.location) {
      payload.destination = {
        address: data.destination.address,
        location: {
          latitude: data.destination.location.lat,
          longitude: data.destination.location.lng,
        },
      };
    }

    const createdCall = await callsService.createTowingCall(payload);

    toast({
      title: "Chamado criado com sucesso!",
      description: `Chamado #${createdCall.id} foi registrado no sistema.`,
    });

    reset();
    onOpenChange(false);
    onSuccess?.();
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Erro ao criar chamado",
      description: error?.response?.data?.message || "Tente novamente mais tarde.",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### **🗺️ Integração com Google Maps**

O formulário de criação de chamados utiliza Google Maps API para:

1. **Geocodificação de endereços** - Converter endereços em coordenadas
2. **Autocomplete de endereços** - Sugestões enquanto o usuário digita
3. **Mapas interativos** - Visualização e seleção de localização

**Variável de Ambiente:**
```bash
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**Bibliotecas do Google Maps:**
```typescript
const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  libraries: ["places"],
});
```

**Componentes Utilizados:**
- `GoogleMap` - Renderiza o mapa
- `Marker` - Marcador de localização (draggable)
- `Autocomplete` - Busca de endereços com sugestões

---

### **📋 Schema de Validação**

**Zod Schema:**
```typescript
const chamadoSchema = z.object({
  association: z.enum(["solidy", "motoclub", "nova", "aprovel"], {
    required_error: "Selecione uma associação",
  }),
  associate_id: z.string().min(1, "Selecione um associado"),
  associate_vehicle_id: z.string().min(1, "Selecione um veículo"),
  observation: z.string().optional(),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  will_use_tow_truck: z.boolean().default(true),
  towing_service_type: z.string().min(1, "Selecione o tipo de serviço"),
  destination: z.object({
    address: z.string().optional(),
    location: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
  }).optional(),
});
```

---

### **🎯 Fluxo Completo de Criação**

```
1. Usuário abre modal de criação de chamado
   ↓
2. Solicita permissão de localização (localStorage)
   ↓
3. Usuário seleciona associação (solidy, nova, etc.)
   ↓
4. Busca associado digitando nome (debounce 500ms)
   ↓
5. Seleciona associado → carrega veículos automaticamente
   ↓
6. Seleciona veículo do associado
   ↓
7. Preenche/busca endereço de origem
   - Autocomplete do Google Maps
   - Ou busca manual com botão Search
   - Ou clica/arrasta marcador no mapa
   ↓
8. Seleciona tipo de serviço
   ↓
9. Se for serviço de reboque (towing_*):
   - Preenche endereço de destino
   - Define localização no mapa
   ↓
10. Adiciona observações (opcional)
    ↓
11. Submete formulário
    ↓
12. API cria chamado e retorna ID
    ↓
13. Toast de sucesso + fecha modal
```

---

### **⚠️ Observações Importantes**

1. **Associação é obrigatória** - Deve ser selecionada antes de buscar associados
2. **Busca requer mínimo 2 caracteres** - Para evitar sobrecarga da API
3. **Debounce de 500ms** - Aguarda usuário parar de digitar
4. **Veículos carregam automaticamente** - Ao selecionar associado
5. **IDs são do sistema iLeva** - API backend faz a conversão/validação
6. **Destino é condicional** - Só aparece para serviços de reboque
7. **uf_id e city_id fixos** - Atualmente 1, idealmente obter do geocoding
8. **Permissão de localização** - Salva escolha no localStorage

---

### **🔧 Melhorias Futuras**

- [ ] Obter `uf_id` e `city_id` do endereço via Google Geocoding API
- [ ] Cache de busca de associados (evitar requisições duplicadas)
- [ ] Validação de CPF do associado
- [ ] Histórico de endereços recentes
- [ ] Upload de fotos do veículo/situação
- [ ] Estimativa de tempo de chegada

---

## 🔄 ATUALIZAÇÃO DE LISTAGENS

### **Padrão para Recarregar Dados Após Operações CRUD**

Quando uma operação de **criar**, **editar** ou **deletar** é realizada através de um modal ou formulário, a listagem da página deve ser atualizada automaticamente.

#### **📋 Padrão Implementado**

**1. Extrair função de fetch com `useCallback`:**

```typescript
// src/pages/Chamados.tsx
import { useState, useEffect, useCallback } from "react";

const fetchChamados = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await callsService.getAll({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "todos" ? statusFilter : undefined,
      // ... outros filtros
    });
    setChamados(response.data);
    setPagination(response.pagination);
  } catch (err) {
    console.error('Erro ao buscar chamados:', err);
    setError('Erro ao carregar dados');
  } finally {
    setLoading(false);
  }
}, [currentPage, statusFilter, serviceTypeFilter, associationFilter, searchTerm]);
```

**2. Usar no useEffect:**

```typescript
useEffect(() => {
  fetchChamados();
}, [fetchChamados]);
```

**3. Criar função de callback para sucesso:**

```typescript
// Callback para recarregar após criar/editar/deletar
const handleSuccess = () => {
  fetchChamados();
};
```

**4. Passar callback para o modal/componente:**

```typescript
<ChamadoFormModal
  open={isModalOpen}
  onOpenChange={setIsModalOpen}
  onSuccess={handleSuccess}  // ← Callback de atualização
/>
```

**5. No modal, chamar onSuccess após operação bem-sucedida:**

```typescript
// src/components/chamados/chamadoFormModal.tsx
const onSubmit = async (data: ChamadoFormData) => {
  setIsSubmitting(true);
  try {
    const createdCall = await callsService.createTowingCall(payload);

    toast({
      title: "Chamado criado com sucesso!",
      description: `Chamado #${createdCall.id} foi registrado.`,
    });

    reset();
    onOpenChange(false);
    onSuccess?.();  // ← Chama callback para atualizar lista
  } catch (error) {
    // ... tratamento de erro
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### **🎯 Benefícios**

1. **✅ UX Melhor** - Usuário vê mudanças imediatamente
2. **✅ Dados Sincronizados** - Lista sempre atualizada com backend
3. **✅ Sem Reload** - Não precisa recarregar a página inteira
4. **✅ Reutilizável** - `fetchChamados` pode ser chamada de qualquer lugar
5. **✅ Performance** - `useCallback` evita re-renderizações desnecessárias

---

### **📝 Checklist para Implementar**

Ao criar novos modais/formulários que modificam dados:

- [ ] Extrair função de fetch com `useCallback`
- [ ] Incluir todas as dependências (filtros, página, etc)
- [ ] Criar função `handleSuccess` que chama `fetch`
- [ ] Passar `onSuccess={handleSuccess}` para o modal
- [ ] No modal, chamar `onSuccess?.()` após sucesso
- [ ] Chamar `onSuccess` ANTES de fechar o modal
- [ ] Mostrar toast de feedback ao usuário

---

### **⚠️ Observações Importantes**

1. **Ordem de execução** - Chamar `onSuccess()` antes de `onOpenChange(false)`:
   ```typescript
   // ✅ Correto
   onSuccess?.();
   onOpenChange(false);

   // ❌ Errado - modal fecha antes de atualizar
   onOpenChange(false);
   onSuccess?.();
   ```

2. **Optional chaining** - Sempre usar `?.()` pois `onSuccess` é opcional:
   ```typescript
   onSuccess?.();  // ✅ Correto
   onSuccess();    // ❌ Erro se onSuccess for undefined
   ```

3. **Dependencies do useCallback** - Incluir TODOS os estados/variáveis usadas:
   ```typescript
   // ✅ Correto - todas as dependências
   useCallback(async () => {
     // usa currentPage, statusFilter, etc
   }, [currentPage, statusFilter, serviceTypeFilter, searchTerm]);

   // ❌ Errado - faltando dependências
   useCallback(async () => {
     // usa currentPage mas não lista nas deps
   }, []);
   ```

4. **Resetar formulário** - Sempre resetar antes de chamar `onSuccess`:
   ```typescript
   reset();              // Limpa formulário
   onSuccess?.();        // Atualiza lista
   onOpenChange(false);  // Fecha modal
   ```

---

### **🔄 Exemplos de Uso**

#### **Criar Item:**
```typescript
// Modal de criação
const handleCreate = async (data) => {
  const created = await service.create(data);
  toast.success("Criado com sucesso!");
  reset();
  onSuccess?.();  // ← Atualiza lista
  onOpenChange(false);
};
```

#### **Editar Item:**
```typescript
// Modal de edição
const handleEdit = async (data) => {
  const updated = await service.update(id, data);
  toast.success("Atualizado com sucesso!");
  reset();
  onSuccess?.();  // ← Atualiza lista
  onOpenChange(false);
};
```

#### **Deletar Item:**
```typescript
// Confirmação de delete
const handleDelete = async () => {
  await service.delete(id);
  toast.success("Deletado com sucesso!");
  onSuccess?.();  // ← Atualiza lista
  setConfirmOpen(false);
};
```

---

### **🎨 Padrão Completo**

```typescript
// ============================================
// PÁGINA (ex: Chamados.tsx)
// ============================================
export default function Chamados() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função de fetch reutilizável
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await service.getAll({
        page: currentPage,
        ...filters,
      });
      setItems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Carrega ao montar e quando deps mudarem
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Callback de sucesso
  const handleSuccess = () => {
    fetchItems();
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Novo Item
      </Button>

      <Table>
        {/* ... tabela com items */}
      </Table>

      <ItemFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSuccess}  // ← Passa callback
      />
    </>
  );
}

// ============================================
// MODAL (ex: ItemFormModal.tsx)
// ============================================
interface ItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;  // ← Prop opcional
}

export function ItemFormModal({ open, onOpenChange, onSuccess }: ItemFormModalProps) {
  const onSubmit = async (data) => {
    try {
      await service.create(data);
      toast.success("Item criado!");
      reset();
      onSuccess?.();        // ← Chama callback
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ... formulário */}
    </Dialog>
  );
}
```

---

## 📄 PÁGINA DE DETALHES DO CHAMADO

### **ChamadoDetalhes.tsx**

Página que exibe informações completas de um chamado específico, incluindo dados do associado, veículo, motorista, viagens, inspeções, faturas e avaliações.

**Arquivo:** `src/pages/ChamadoDetalhes.tsx`

---

### **📡 Endpoint da API**

#### **GET /api/calls/guinchos/:id**

Busca um chamado específico por ID com todos os relacionamentos.

**URL:** `http://localhost:3001/api/calls/guinchos/{ID_CHAMADO}`

**Método:** GET

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```typescript
{
  // Dados principais do chamado
  id: string;
  towing_service_type: string;
  address: string;
  observation: string;
  status: string | null;
  towing_status: string;
  creation_method: string;
  association: string;
  created_at: string;
  updated_at: string;

  // Dados do veículo e associado
  associate_cars: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    color: string;
    year: string;
    associates: {
      id: string;
      name: string;
      email: string;
      phone: string;
      cpf: string;
    }
  };

  // Motorista de guincho
  towing_drivers: {
    id: string;
    name: string;
    phone: string;
    cpf: string;
    profile_image_path: string;
  };

  // Usuário que criou o chamado
  users: {
    id: string;
    name: string;
    email: string;
  };

  // Faturas/boletos
  bills: Array<{
    id: string;
    value: string;
    status: string;
    payment_date: string;
    payment_method: string;
    total_value: string;
  }>;

  // Avaliações
  ratings: Array<{
    id: string;
    service_type: string;
    rating: number;
    complaint: string | null;
    created_at: string;
  }>;

  // Viagens (coleta e entrega)
  call_trips: Array<{
    id: string;
    type: "towing_collect" | "towing_delivery";
    status: string;
    address: string;
    started_at: string;
    finished_at: string;
  }>;

  // Inspeções (checkin/checkout)
  inspections: Array<{
    id: string;
    type: "checkin" | "checkout";
    created_at: string;
    inspection_files: Array<{
      id: string;
      type: string;
      path: string;
    }>;
    towing_drivers: {
      name: string;
    };
  }>;

  // Solicitações de serviço e propostas
  call_service_requests: Array<{
    id: string;
    status: string;
    distance_between_trips_text: string;
    duration_between_trips_text: string;
    call_service_proposals: Array<{
      id: string;
      status: "accepted" | "rejected";
      proposed_price_departure: string;
      proposed_price_excess_mileage: string;
      towing_drivers: {
        name: string;
        phone: string;
      };
    }>;
  }>;
}
```

---

### **🔧 Service Method**

**Arquivo:** `src/services/calls.service.ts`

```typescript
/**
 * GET /api/calls/guinchos/:id
 * Busca um chamado específico por ID
 */
getById: async (id: string): Promise<Call> => {
  const { data } = await api.get<Call>(`/api/calls/guinchos/${id}`);
  return data;
}
```

**Uso:**
```typescript
import { callsService } from '@/services/calls.service';

const chamado = await callsService.getById('43016');
```

---

### **🧩 Componentes da Página**

A página é dividida em componentes modulares para melhor organização:

#### **1. Informações do Chamado**
Card principal com:
- ID do chamado
- Associação
- Tipo de serviço
- Método de criação
- Datas de criação e atualização
- Endereço com link para Google Maps
- Observações

#### **2. Execução do Serviço**
Card com informações de execução:
- Status do chamado
- Status do guincho
- Tempo de aceite do motorista
- Tempo estimado de chegada
- Códigos WebAssist (se houver)

#### **3. Coluna Lateral (Cards)**

**Dados do Associado:**
- Nome
- CPF (com botão copiar)
- Telefone (com botão copiar)
- E-mail
- Data de cadastro

**Dados do Veículo:**
- Placa (destaque)
- Marca/Modelo
- Ano
- Cor
- Categoria
- Chassi (se houver)

**Motorista de Guincho:**
- Componente: `TowingDriverCard`
- Nome, telefone, CPF
- Status

**Criado por:**
- Componente: `CreatedByCard`
- Nome e e-mail do usuário

**Faturas:**
- Componente: `BillsCard`
- Lista de boletos/pagamentos
- Status, valor, método de pagamento

**Avaliações:**
- Componente: `RatingsCard`
- Notas (estrelas) e reclamações

#### **4. Componentes Principais**

**Viagens:**
- Componente: `CallTripsCard`
- Coleta (towing_collect)
- Entrega (towing_delivery)
- Endereços e horários

**Inspeções:**
- Componente: `InspectionsCard`
- Checkin (fotos iniciais)
- Checkout (fotos finais)
- Galeria de imagens

---

### **📋 Componentes Modulares**

Cada seção tem seu próprio componente para facilitar manutenção:

**Localização:** `src/components/chamados/`

| Componente | Descrição | Props |
|------------|-----------|-------|
| `TowingDriverCard` | Dados do motorista de guincho | `driver` |
| `BillsCard` | Lista de faturas/boletos | `bills[]` |
| `RatingsCard` | Avaliações do serviço | `ratings[]` |
| `CallTripsCard` | Viagens (coleta/entrega) | `trips[]` |
| `InspectionsCard` | Inspeções com fotos | `inspections[]` |
| `CreatedByCard` | Usuário que criou o chamado | `user` |

---

### **🎨 Layout e Estrutura**

**Grid Responsivo:**
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Coluna Principal (2/3) */}
  <div className="lg:col-span-2 space-y-6">
    {/* Informações do Chamado */}
    {/* Execução do Serviço */}
    {/* Viagens */}
    {/* Inspeções */}
  </div>

  {/* Coluna Lateral (1/3) */}
  <div className="space-y-6">
    {/* Dados do Associado */}
    {/* Dados do Veículo */}
    {/* Motorista de Guincho */}
    {/* Criado por */}
    {/* Faturas */}
    {/* Avaliações */}
  </div>
</div>
```

**Características:**
- Cards com `rounded-2xl` e `shadow-soft`
- Botões "Copiar" para CPF, telefone, chassi, etc.
- Links externos para Google Maps
- Badges coloridos para status
- Galeria de imagens das inspeções

---

### **🔄 Estados e Loading**

**Estados:**
```typescript
const [chamado, setChamado] = useState<Call | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Loading State:**
- Exibe `Loader2` animado
- Mensagem "Carregando detalhes..."

**Error State:**
- Ícone `AlertCircle`
- Mensagem de erro da API
- Botão "Voltar para Chamados"

---

### **🗺️ Funcionalidades**

#### **1. Copiar para Clipboard**
```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copiado para a área de transferência!");
};
```

**Usado em:**
- CPF
- Telefone
- Chassi
- Placa
- Códigos WebAssist

#### **2. Link para Google Maps**
```typescript
const getGoogleMapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
```

**Uso:**
```typescript
<a
  href={getGoogleMapsUrl(chamado.address)}
  target="_blank"
  rel="noopener noreferrer"
>
  Ver no mapa
</a>
```

#### **3. Formatação de Dados**

**Data/Hora:**
```typescript
import { formatDateTime } from "@/lib/utils";
formatDateTime(chamado.created_at); // "04/02/2026 08:55"
```

**Telefone:**
```typescript
import { formatPhone } from "@/lib/utils";
formatPhone("85994390988"); // "(85) 99439-0988"
```

---

### **📌 Labels e Mapeamentos**

**Categoria do Veículo:**
```typescript
const categoryLabels: Record<string, string> = {
  car: "Carro",
  van: "Van",
  pickup_truck: "Pickup",
  motorcycle: "Moto",
  truck: "Caminhão",
  trailer: "Reboque",
  bus: "Ônibus",
};
```

**Método de Criação:**
```typescript
const creationMethodLabels: Record<string, string> = {
  webassist: "WebAssist",
  manually: "Manual",
  associate_service: "Serviço do Associado",
};
```

**Status e Variantes:**
- Importados de `@/services/calls.service`:
  - `callStatusLabels`
  - `callStatusVariants`
  - `callTowingStatusLabels`
  - `callTowingStatusVariants`
  - `towingServiceTypeLabels`
  - `associationLabels`

---

### **✅ Checklist de Implementação**

Ao modificar a página de detalhes:

- [ ] Sempre buscar dados via `callsService.getById(id)`
- [ ] Tratar estados de loading e error
- [ ] Usar componentes modulares para cada seção
- [ ] Manter layout responsivo (lg:col-span-2 + lg:col-span-1)
- [ ] Adicionar botões "Copiar" para dados importantes
- [ ] Usar badges com variantes corretas para status
- [ ] Formatar datas com `formatDateTime()`
- [ ] Formatar telefones com `formatPhone()`
- [ ] Incluir links para Google Maps em endereços
- [ ] Exibir "—" ou "Não informado" para campos vazios
- [ ] Usar toast para feedback de ações do usuário
- [ ] Manter consistência visual com outros cards do dashboard

---

### **🚀 Navegação**

**Rota:**
```
/chamados/:id
```

**Exemplo:**
```
/chamados/43016
```

**Botão Voltar:**
```typescript
<Button onClick={() => navigate("/chamados")}>
  <ArrowLeft className="h-4 w-4" />
  Voltar
</Button>
```

**Navegação da lista:**
```typescript
// Em Chamados.tsx
<TableRow onClick={() => navigate(`/chamados/${chamado.id}`)}>
```

---

## 🎯 RESUMO EXECUTIVO

### **✅ REGRAS DE OURO**

1. **Apenas GUINCHO** - Não implementar vistorias/bikers
2. **API em localhost:3001** - Backend Node.js
3. **shadcn/ui + Tailwind** - Usar componentes prontos
4. **Tipagem completa** - TypeScript em tudo
5. **Services centralizados** - Toda API em `services/*.service.ts`
6. **Formatação consistente** - Usar utilitários em `lib/utils.ts`
7. **Classes Tailwind** - Nunca CSS inline
8. **Hot reload em dev** - Usar `docker-compose.dev.yml`
9. **JWT Bearer** - Token em todas as requisições
10. **Design system** - Seguir cores/espaçamento do Tailwind config

---

## 📊 DASHBOARD - MÉTRICAS E CARDS

### **Estrutura do Dashboard**

O dashboard principal (`src/pages/Index.tsx`) exibe métricas de atendimento e guincho organizadas em cards e componentes especializados.

#### **🎯 Componentes do Dashboard**

1. **DateRangeFilter** - Filtro de período com range de datas (obrigatório)
2. **MetricCard** - Cards de métricas com variantes de cor
3. **QuickStats** - Estatísticas rápidas de atendimento

---

### **📅 Filtro de Data (DateRangeFilter)**

**Arquivo:** `src/components/dashboard/DateRangeFilter.tsx`

Componente de filtro de período que permite filtrar os dados do dashboard por um intervalo de datas. Ambas as datas (início e fim) são obrigatórias para aplicar o filtro.

#### **Funcionalidades**

- Seleção de data de início e data de fim via calendário
- Validação: data fim não pode ser anterior à data início
- Botão "Aplicar Filtro" habilitado apenas quando ambas as datas estão selecionadas
- Botão "Limpar" para remover os filtros e voltar aos dados padrão
- Formatação automática de datas para o formato da API (YYYY-MM-DD)

#### **API Endpoint com Filtros**

```
GET http://localhost:3001/api/dashboard?start_date=2026-02-01&end_date=2026-02-04
```

**Parâmetros de Query:**
- `start_date` - Data inicial no formato YYYY-MM-DD (obrigatório quando usando filtro)
- `end_date` - Data final no formato YYYY-MM-DD (obrigatório quando usando filtro)

#### **Exemplo de Uso**

```typescript
// src/pages/Index.tsx
const [filters, setFilters] = useState<DashboardFilters | undefined>(undefined);

const handleApplyFilter = (startDate: string, endDate: string) => {
  setFilters({ start_date: startDate, end_date: endDate });
};

const handleClearFilter = () => {
  setFilters(undefined);
};

// No JSX
<DateRangeFilter onFilter={handleApplyFilter} onClear={handleClearFilter} />
```

#### **Interface de Filtros**

```typescript
// src/services/dashboard.service.ts
export interface DashboardFilters {
  start_date?: string; // Formato: YYYY-MM-DD
  end_date?: string;   // Formato: YYYY-MM-DD
}
```

---

### **📦 Interface DashboardData**

**Arquivo:** `src/services/dashboard.service.ts`

```typescript
export interface DashboardData {
  attendancesToday: number;           // Total de atendimentos hoje
  attendancesInProgress: number;      // Atendimentos em andamento
  attendancesFinished: number;        // Atendimentos finalizados
  averageServiceTime: string;         // Tempo médio de atendimento
  averageTowingExecutionTime: string; // Tempo médio de execução de guincho
  quickStats: QuickStats;             // Estatísticas rápidas
  towingTicket: TowingTicket;         // Dados financeiros de guincho
  recentAttendances: RecentAttendance[];  // Atendimentos recentes
}

export interface QuickStats {
  averageResponseTime: string;        // Tempo médio de resposta
  resolutionRate: string;             // Taxa de resolução
}

export interface TowingTicket {
  averageTicket: string;              // Ticket médio (ex: "R$ 60.43")
  totalRevenue: string;               // Receita total (ex: "R$ 181.28")
  paidBillsCount: number;             // Quantidade de boletos pagos
}
```

---

### **🎨 MetricCard - Variantes de Cores**

**Arquivo:** `src/components/dashboard/MetricCard.tsx`

#### **Variantes Disponíveis**

| Variante | Cor | Uso Recomendado |
|----------|-----|-----------------|
| `default` | Neutro/Branco | Métricas gerais sem destaque |
| `primary` | Azul | Métricas principais, totais |
| `success` | Verde | Métricas positivas, finalizados |
| `warning` | Amarelo/Laranja | Alertas, em andamento |
| `danger` | Vermelho | Erros, cancelados |
| `info` | Azul claro | Informações secundárias |
| `teal` | Verde-azulado | Métricas financeiras alternativas |

#### **Nova Variante: Teal**

Adicionada para diferenciar cards financeiros com tom de verde único:

```typescript
// MetricCard.tsx - linha 12
variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "teal";

// Estilo da variante teal
const variantStyles = {
  // ... outras variantes
  teal: "bg-gradient-to-br from-teal-500 via-teal-500 to-teal-600 text-white border-teal-400/20",
};

const iconBgStyles = {
  // ... outros estilos
  teal: "bg-white/20 text-white backdrop-blur-sm",
};
```

**Uso:**
```typescript
<MetricCard
  title="Ticket Médio"
  value="R$ 60.43"
  icon={DollarSign}
  variant="teal"
  delay={300}
/>
```

---

### **📈 Layout do Dashboard**

#### **Primeira Seção - Métricas Principais (3 colunas)**

```typescript
// Grid de 3 colunas em telas grandes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <MetricCard
    title="Atendimentos Hoje - Chamados"
    value={dashboardData.attendancesToday}
    icon={Headphones}
    variant="primary"
  />
  <MetricCard
    title="Em Andamento - Chamados"
    value={dashboardData.attendancesInProgress}
    icon={PhoneCall}
    variant="warning"
  />
  <MetricCard
    title="Finalizados - Chamados"
    value={dashboardData.attendancesFinished}
    icon={CheckCircle}
    variant="success"
  />
</div>
```

---

#### **Segunda Seção - Métricas de Guincho e Estatísticas**

Layout: **2/3 esquerda + 1/3 direita**

**Estrutura:**
```
┌─────────────────────────────────────────┬──────────────────┐
│  Tempo Médio Guincho | Ticket Médio     │  QuickStats      │
├─────────────────────────────────────────┤  (Tempo Médio)   │
│  Receita Total       | Boletos Pagos    ├──────────────────┤
│                                         │  Taxa Resolução  │
└─────────────────────────────────────────┴──────────────────┘
```

**Código:**
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Coluna esquerda - 2/3 da largura */}
  <div className="lg:col-span-2 space-y-6">
    {/* Primeira linha - 2 cards lado a lado */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard
        title="Tempo Médio de Execução de Guincho - Chamados"
        value={dashboardData.averageTowingExecutionTime}
        icon={Truck}
        variant="info"
      />
      <MetricCard
        title="Ticket Médio - Chamados"
        value={dashboardData.towingTicket.averageTicket}
        icon={DollarSign}
        variant="teal"
      />
    </div>

    {/* Segunda linha - 2 cards lado a lado */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard
        title="Receita Total - Chamados"
        value={dashboardData.towingTicket.totalRevenue}
        icon={CreditCard}
        variant="success"
      />
      <MetricCard
        title="Boletos Pagos - Chamados"
        value={dashboardData.towingTicket.paidBillsCount}
        icon={Receipt}
        variant="danger"
      />
    </div>
  </div>

  {/* Coluna direita - 1/3 da largura */}
  <div className="flex flex-col gap-6">
    <QuickStats
      averageServiceTime={dashboardData.averageServiceTime}
    />
    <MetricCard
      title="Taxa de Resolução - Chamados"
      value={dashboardData.quickStats.resolutionRate}
      icon={CheckCircle2}
      variant="primary"
    />
  </div>
</div>
```

---

### **📊 QuickStats Component**

**Arquivo:** `src/components/dashboard/QuickStats.tsx`

Componente minimalista que exibe apenas 1 métrica de atendimento:

**Interface:**
```typescript
interface QuickStatsProps {
  averageServiceTime: string;   // Tempo médio de atendimento
}
```

**Métrica Exibida:**
1. **Tempo Médio Atendimento** - Badge com ícone Clock

**Estrutura:**
```typescript
export function QuickStats({ averageServiceTime }: QuickStatsProps) {
  const stats = [
    { label: "Tempo Médio Atendimento", value: averageServiceTime, icon: Clock },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-3 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Estatísticas Rápidas</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Atendimento
        </span>
      </div>
      <div>
        {stats.map((stat) => (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**⚠️ Alterações importantes:**
- Removido campo **"Taxa de Resolução"** (agora é um MetricCard separado)
- QuickStats agora exibe apenas **1 métrica**
- Padding reduzido de `p-6` para `p-3` e `mb-6` para `mb-3` para deixar mais compacto
- Removido `h-full` - altura ajusta-se ao conteúdo

---

### **💰 Cards de TowingTicket e Taxa de Resolução**

#### **1. Ticket Médio - Chamados**
```typescript
<MetricCard
  title="Ticket Médio - Chamados"
  value={dashboardData.towingTicket.averageTicket}  // "R$ 60.43"
  icon={DollarSign}
  variant="teal"
  delay={300}
/>
```

#### **2. Receita Total - Chamados**
```typescript
<MetricCard
  title="Receita Total - Chamados"
  value={dashboardData.towingTicket.totalRevenue}  // "R$ 181.28"
  icon={CreditCard}
  variant="success"
  delay={400}
/>
```

#### **3. Boletos Pagos - Chamados**
```typescript
<MetricCard
  title="Boletos Pagos - Chamados"
  value={dashboardData.towingTicket.paidBillsCount.toString()}  // "3"
  icon={Receipt}
  variant="danger"
  delay={500}
/>
```

#### **4. Taxa de Resolução - Chamados**
```typescript
<MetricCard
  title="Taxa de Resolução - Chamados"
  value={dashboardData.quickStats.resolutionRate}  // "95%"
  icon={CheckCircle2}
  variant="primary"
  delay={600}
/>
```

**⚠️ Nota:** Taxa de Resolução foi movida do QuickStats para um MetricCard separado na coluna direita, abaixo do QuickStats.

---

### **🎨 Variação de Cores dos Cards**

Distribuição de cores para evitar repetição e criar hierarquia visual:

| Card | Variante | Cor | Justificativa |
|------|----------|-----|---------------|
| **Atendimentos Hoje - Chamados** | `primary` | Azul | Métrica principal do dia |
| **Em Andamento - Chamados** | `warning` | Amarelo | Alerta/atenção necessária |
| **Finalizados - Chamados** | `success` | Verde | Positivo/completo |
| **Tempo Médio Guincho - Chamados** | `info` | Azul claro | Informação técnica |
| **Ticket Médio - Chamados** | `teal` | Verde-azulado | Financeiro único |
| **Receita Total - Chamados** | `success` | Verde | Financeiro positivo |
| **Boletos Pagos - Chamados** | `danger` | Vermelho | Destaque/urgência |
| **Taxa de Resolução - Chamados** | `primary` | Azul | Métrica de performance |

**Evitar:**
- ❌ Mesma cor em cards adjacentes
- ❌ Variante `danger` para métricas positivas (exceto quando justificado)
- ❌ Mais de 2 cards com mesma variante visíveis juntos

**Layout da Coluna Direita:**
- QuickStats (Tempo Médio Atendimento) - card neutro
- Taxa de Resolução - variante `primary` (azul)

---

### **📋 Endpoint do Dashboard**

**GET /api/dashboard**

**Query Parameters (opcionais):**
- `start_date` - Data inicial para filtrar dados (formato: YYYY-MM-DD)
- `end_date` - Data final para filtrar dados (formato: YYYY-MM-DD)

**Exemplos:**
```
GET /api/dashboard
GET /api/dashboard?start_date=2026-02-01&end_date=2026-02-04
```

**Resposta esperada:**
```json
{
  "attendancesToday": 42,
  "attendancesInProgress": 8,
  "attendancesFinished": 34,
  "averageServiceTime": "15min",
  "averageTowingExecutionTime": "45min",
  "quickStats": {
    "averageResponseTime": "2min",
    "resolutionRate": "95%"
  },
  "towingTicket": {
    "averageTicket": "R$ 60.43",
    "totalRevenue": "R$ 181.28",
    "paidBillsCount": 3
  },
  "recentAttendances": [
    {
      "id": "123",
      "association": "solidy",
      "plataform": "whatsapp",
      "phone": "11999999999",
      "status": "finished",
      "created_at": "2026-02-03T10:30:00Z"
    }
  ]
}
```

---

### **🔄 Atualização Automática**

O dashboard se auto-atualiza a cada 30 segundos:

```typescript
useEffect(() => {
  async function fetchDashboardData() {
    try {
      setLoading(true);
      const data = await dashboardService.getData();
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }

  fetchDashboardData();

  // Atualizar a cada 30 segundos
  const interval = setInterval(fetchDashboardData, 30000);

  return () => clearInterval(interval);
}, []);
```

---

### **📱 Responsividade**

#### **Breakpoints Tailwind:**
- `md:` - Tablets (768px+)
- `lg:` - Desktops (1024px+)

#### **Comportamento:**

**Mobile (< 768px):**
- Todos os cards em coluna única
- QuickStats ocupa largura total
- Cards de TowingTicket empilhados

**Tablet (768px - 1023px):**
- Métricas principais: 2 colunas
- Cards de Guincho/Ticket: 2 colunas
- QuickStats: largura total

**Desktop (1024px+):**
- Layout completo conforme descrito acima
- QuickStats fixo à direita (1/3)
- Cards de Guincho/Ticket: 2/3 à esquerda

---

### **✅ Checklist de Implementação**

Ao modificar o dashboard:

- [ ] Cores dos cards não se repetem em adjacentes
- [ ] Variantes são semanticamente corretas (success = verde, danger = vermelho)
- [ ] QuickStats mantém apenas 1 métrica (Tempo Médio Atendimento)
- [ ] QuickStats tem padding compacto (p-3 e mb-3)
- [ ] TowingTicket tem 3 cards na coluna esquerda (Ticket Médio, Receita Total, Boletos Pagos)
- [ ] Taxa de Resolução é um MetricCard separado na coluna direita
- [ ] Coluna direita usa `flex flex-col gap-6` para alinhamento
- [ ] Todos os títulos de cards incluem "- Chamados" no final
- [ ] Layout responsivo funciona em mobile/tablet/desktop
- [ ] Ícones são do `lucide-react`
- [ ] Valores monetários vêm formatados da API (não formatados no frontend)
- [ ] Auto-atualização de 30s está ativa
- [ ] Loading e error states estão implementados
- [ ] Cards têm animação de entrada com `delay` incrementado
- [ ] Tabela de Atendimentos Recentes foi REMOVIDA do dashboard

---

### **📊 Estrutura Final do Dashboard**

**Seção 1 - Métricas Principais (linha única):**
- Atendimentos Hoje - Chamados (primary)
- Em Andamento - Chamados (warning)
- Finalizados - Chamados (success)

**Seção 2 - Grid 3 Colunas:**

**Coluna Esquerda (2/3):**
- Linha 1: Tempo Médio Guincho (info) | Ticket Médio (teal)
- Linha 2: Receita Total (success) | Boletos Pagos (danger)

**Coluna Direita (1/3):**
- QuickStats com 1 métrica (Tempo Médio Atendimento)
- Taxa de Resolução (primary)

**Removido:**
- ❌ Tabela de Atendimentos Recentes (removida completamente)
- ❌ Gráfico de Atendimentos por Hora (AttendanceChart)
- ❌ Interface AttendanceByHour
- ❌ Campo attendancesByHour do DashboardData

---

### **🗑️ Componentes e Dados Removidos do Dashboard**

Os seguintes componentes e dados foram **REMOVIDOS** e **NÃO devem** ser implementados:

#### **AttendanceChart (Gráfico de Atendimentos por Hora)**
- ❌ Componente de gráfico não existe mais
- ❌ Não renderizar gráficos no dashboard

#### **AttendanceTable (Tabela de Atendimentos Recentes)**
- ❌ Tabela de atendimentos recentes removida
- ❌ Usuários devem ir para página `/atendimentos` para ver lista completa

#### **Dados Removidos da API**
```typescript
// ❌ NÃO USAR - Removido
interface AttendanceByHour {
  hour: string;
  attendances: number;
}

// ❌ NÃO incluir no DashboardData
attendancesByHour: AttendanceByHour[];
```

#### **O que o Dashboard TEM:**
✅ Cards de métricas (MetricCard)
✅ Estatísticas rápidas (QuickStats)
✅ Apenas dados numéricos e percentuais

#### **O que o Dashboard NÃO TEM:**
❌ Gráficos
❌ Tabelas
❌ Listas de atendimentos

---

**Última atualização:** 2026-02-03
**Versão do Projeto:** 1.0.0
**Escopo:** **GUINCHO (Towing Services)** APENAS
**Compatível com:** Node.js 20+, React 18+, Docker


---

## 🚨 PÁGINA DE ACOMPANHAMENTO FULLSCREEN

### **AcompanhamentoFullscreen.tsx**

Página dedicada ao monitoramento em tempo real de chamados, com alertas sonoros e visuais para acompanhamento contínuo.

**Arquivo:** `src/pages/AcompanhamentoFullscreen.tsx`

**Rota:** `/acompanhamento-fullscreen` (pública, sem autenticação)

---

### **🎵 Sistema de Áudio - Sirene de Alerta**

A página reproduz automaticamente um som de sirene de polícia **quando detecta um novo chamado atrasado**, criando um ambiente de monitoramento ativo.

#### **Funcionalidades do Áudio**

- **Reprodução por detecção:** Som toca **APENAS 2.5 segundos** quando detecta novo chamado atrasado
- **Detecção de novos chamados:** Compara `summary.delayed` atual com anterior
  - Se contador aumentou → novo chamado atrasado detectado → toca sirene
  - Som para automaticamente após 2.5 segundos
- **Repetição no polling:** A cada 10 segundos, se houver novo atrasado, toca novamente
- **Web Audio API:** Som sintetizado usando osciladores (sem arquivos externos)
- **Padrão sonoro:** Sirene em padrão "Wail" (500Hz a 1200Hz)
- **Volume ajustado:** 30% do volume máximo
- **Controle de som:** Botão para mutar/desmutar no canto superior direito

#### **Implementação - Web Audio API**

```typescript
const audioRef = useRef<HTMLAudioElement | null>(null);
const [isMuted, setIsMuted] = useState(false);

useEffect(() => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.3; // Volume 30%
  masterGain.connect(audioContext.destination);

  let oscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;
  let isPlaying = false;

  const startSirene = () => {
    if (isPlaying) return;
    isPlaying = true;

    oscillator = audioContext.createOscillator();
    oscillator.type = "triangle";

    gainNode = audioContext.createGain();
    gainNode.gain.value = 1;

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    oscillator.start();

    // Padrão "Wail": 500Hz -> 1200Hz em 2.5s
    const cycleDuration = 2.5;
    const wail = () => {
      if (!oscillator) return;

      const now = audioContext.currentTime;
      oscillator.frequency.setValueAtTime(500, now);
      oscillator.frequency.linearRampToValueAtTime(1200, now + cycleDuration / 2);
      oscillator.frequency.linearRampToValueAtTime(500, now + cycleDuration);

      setTimeout(wail, cycleDuration * 1000);
    };

    wail();
  };

  const stopSirene = () => {
    if (!isPlaying) return;
    isPlaying = false;

    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
  };

  audioRef.current = {
    play: startSirene,
    pause: stopSirene,
    isPlaying: () => isPlaying,
  } as any;

  return () => {
    stopSirene();
    audioContext.close();
  };
}, []);

// Estado para rastrear contador anterior de chamados atrasados
const [previousDelayedCount, setPreviousDelayedCount] = useState(0);

// Controlar som baseado em NOVOS chamados atrasados
useEffect(() => {
  const currentDelayed = summary.delayed;

  // Verificar se há um novo chamado atrasado (contador aumentou)
  const hasNewDelayed = currentDelayed > previousDelayedCount;

  if (audioRef.current && hasNewDelayed && !isMuted) {
    const audio = audioRef.current as any;

    try {
      // Tocar o som
      audio.play();

      // Parar após 2.5 segundos
      setTimeout(() => {
        if (audio.isPlaying()) {
          audio.pause();
        }
      }, 2500);
    } catch (error) {
      console.log("Não foi possível iniciar o som automaticamente.");
    }
  }

  // Atualizar o contador anterior
  setPreviousDelayedCount(currentDelayed);
}, [summary.delayed, isMuted]);
```

**Características do Som:**
- **Tipo de onda:** Triangle (mais suave que square)
- **Frequência base:** 500Hz
- **Frequência alta:** 1200Hz
- **Duração do ciclo:** 2.5 segundos (subida + descida)
- **Padrão:** "Wail" policial clássico

---

### **📡 Integração com API**

A página consome dados em tempo real da API de chamados abertos.

#### **Endpoint Utilizado**

```
GET http://localhost:3001/api/calls/guinchos/open?page=1&limit=20
```

#### **Serviço**

```typescript
// src/services/calls.service.ts
getOpenCalls: async (page: number = 1, limit: number = 50): Promise<OpenCallsResponse> => {
  const { data } = await api.get<OpenCallsResponse>('/api/calls/guinchos/open', {
    params: { page, limit },
  });
  return data;
}
```

#### **Filtro por Cliente**

A tela possui um filtro visual elegante para filtrar chamados por associação (cliente):

**Design:**
- Card com gradiente sutil e sombra suave
- Chips/botões com gradientes coloridos para cada associação
- Efeito de escala e sombra no botão selecionado
- Transições suaves entre estados

**Opções de Filtro:**
| Valor | Label | Cor | Endpoint |
|-------|-------|-----|----------|
| `todos` | Todos | Cinza (Slate) | Sem parâmetro |
| `solidy` | Solidy | Verde | `?association=solidy` |
| `nova` | Nova | Azul | `?association=nova` |
| `motoclub` | Motoclub | Laranja | `?association=motoclub` |
| `aprovel` | Aprovel | Ciano (Teal) | `?association=aprovel` |

**Comportamento:**
- Ao selecionar um filtro, volta para a página 1
- Mantém o filtro durante o polling (10s)
- Visual claro do filtro ativo (escala maior, sombra destacada)

**Esquema de Cores Detalhado:**

Cada associação possui um gradiente único para fácil identificação visual:

```typescript
const associations = [
  {
    value: 'todos',
    label: 'Todos',
    color: 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
  },
  {
    value: 'solidy',
    label: 'Solidy',
    color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  },
  {
    value: 'nova',
    label: 'Nova',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
  },
  {
    value: 'motoclub',
    label: 'Motoclub',
    color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
  },
  {
    value: 'aprovel',
    label: 'Aprovel',
    color: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
  },
];
```

**Paleta de Cores:**

| Associação | Cor Base | Cor Hover | Hex Base | Descrição |
|------------|----------|-----------|----------|-----------|
| Todos | Slate 500 | Slate 600 | #64748b | Cinza neutro |
| Solidy | Green 500 | Green 600 | #22c55e | Verde vibrante |
| Nova | Blue 500 | Blue 600 | #3b82f6 | Azul confiável |
| Motoclub | Orange 500 | Orange 600 | #f97316 | Laranja energético |
| Aprovel | Teal 500 | Teal 600 | #14b8a6 | Ciano moderno |

**Estados Visuais:**

```css
/* Estado Não Selecionado */
- Background: bg-background/80
- Texto: text-muted-foreground
- Borda: border-border/50 (2px)
- Hover: border-border + bg-background

/* Estado Selecionado */
- Background: Gradiente específico da associação
- Texto: text-white
- Borda: border-transparent (2px)
- Escala: scale-105 (5% maior)
- Sombra: shadow-lg (sombra destacada)
```

**Implementação:**
```typescript
const [selectedAssociation, setSelectedAssociation] = useState<string>('todos');

// Ao buscar dados
const response = await callsService.getOpenCalls(currentPage, perPage, selectedAssociation);

// Ao clicar no filtro
onClick={() => {
  setSelectedAssociation(association.value);
  setCurrentPage(1); // Reset para primeira página
}}

// Classes CSS condicionais
className={cn(
  "px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 transform",
  "border-2 shadow-md",
  selectedAssociation === association.value
    ? `${association.color} text-white border-transparent scale-105 shadow-lg`
    : "bg-background/80 text-muted-foreground border-border/50 hover:border-border hover:bg-background"
)}
```

**Exemplo Visual do Filtro:**

```
┌────────────────────────────────────────────────────────────────┐
│ 🏢 Filtrar por Cliente:                                        │
│                                                                 │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Todos   │ │ Solidy   │ │ Nova   │ │ Motoclub │ │ Aprovel │ │
│  │ Cinza   │ │ Verde    │ │ Azul   │ │ Laranja  │ │ Ciano   │ │
│  └─────────┘ └──────────┘ └────────┘ └──────────┘ └─────────┘ │
│      ↑            ↑            ↑           ↑            ↑       │
│   Normal      Selecionado    Normal     Normal      Normal     │
│   (escala      (escala      (escala    (escala     (escala     │
│    100%)       105%)         100%)      100%)       100%)       │
└────────────────────────────────────────────────────────────────┘
```

**Fluxo de Interação:**

```
Usuário clica em "Solidy"
    ↓
setSelectedAssociation('solidy')
setCurrentPage(1)
    ↓
useEffect detecta mudança
    ↓
Busca: GET /api/calls/guinchos/open?page=1&limit=20&association=solidy
    ↓
Exibe apenas chamados da Solidy
    ↓
Botão "Solidy" fica em destaque:
  - Gradiente verde (green-500 → green-600)
  - Escala 105%
  - Sombra destacada
  - Texto branco
```

#### **Modo Analytics - Filtros Automáticos**

Ao entrar no modo Analytics (botão "Análise"), filtros adicionais são aplicados automaticamente para os gráficos de evolução.

**Parâmetros Adicionais no Modo Analytics:**

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `evolution_start_date` | `2026-02-01` | Primeiro dia do mês vigente (formato YYYY-MM-DD) |
| `evolution_end_date` | `2026-02-28` | Último dia do mês vigente (formato YYYY-MM-DD) |
| `association` | Selecionado | Mantém associação selecionada nos chips (se houver) |

**Cálculo Automático das Datas:**

```typescript
// Imports necessários
import { format, startOfMonth, endOfMonth } from "date-fns";

// No useEffect de fetchChamados:
const hoje = new Date();
const primeiroDiaDoMes = startOfMonth(hoje);  // 2026-02-01 00:00:00
const ultimoDiaDoMes = endOfMonth(hoje);      // 2026-02-28 23:59:59

// Formatar no padrão YYYY-MM-DD
const evolutionStartDate = format(primeiroDiaDoMes, 'yyyy-MM-dd');
const evolutionEndDate = format(ultimoDiaDoMes, 'yyyy-MM-dd');

// Passar para API apenas quando em modo analítico
const response = await callsService.getOpenCalls(
  currentPage,
  perPage,
  selectedAssociation,
  viewMode === 'analytics' ? evolutionStartDate : undefined,
  viewMode === 'analytics' ? evolutionEndDate : undefined
);
```

**Inicialização dos Inputs de Data:**

Os inputs de data início e fim são preenchidos automaticamente ao entrar no modo Analytics:

```typescript
const AnalyticsView = ({ summary, chamados }: AnalyticsViewProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Inicializar com primeiro e último dia do mês vigente
  useEffect(() => {
    const hoje = new Date();
    setStartDate(startOfMonth(hoje));  // Exibe "01/02/2026" no input
    setEndDate(endOfMonth(hoje));      // Exibe "28/02/2026" no input
  }, []);
}
```

**Exemplos de Requisições:**

**Modo Cards (sem filtro):**
```
GET /api/calls/guinchos/open?page=1&limit=20
```

**Modo Cards (com Motoclub):**
```
GET /api/calls/guinchos/open?page=1&limit=20&association=motoclub
```

**Modo Analytics (sem filtro):**
```
GET /api/calls/guinchos/open/analitico?start_by_hour=2026-02-01&end_by_hour=2026-02-28
```

**Modo Analytics (com filtro de data personalizado):**
```
GET /api/calls/guinchos/open/analitico?start_by_hour=2026-02-01&end_by_hour=2026-02-05
```

**Importante:**
- ✅ Modo Cards usa endpoint `/api/calls/guinchos/open` (retorna `data`, `summary`, `pagination`)
- ✅ Modo Analytics usa endpoint `/api/calls/guinchos/open/analitico` (retorna dados agregados diretamente)
- ❌ Filtro de associação NÃO está disponível no endpoint `/analitico`

**Separação de Responsabilidades:**

| Endpoint | Uso | Retorna |
|----------|-----|---------|
| `/api/calls/guinchos/open` | Modo Cards | Lista paginada + contadores básicos |
| `/api/calls/guinchos/open/analitico` | Modo Analytics | Dados agregados + gráficos |

**Serviço Atualizado:**

```typescript
// src/services/calls.service.ts
getOpenCalls: async (
  page: number = 1,
  limit: number = 50,
  association?: string,
  evolutionStartDate?: string,
  evolutionEndDate?: string
): Promise<OpenCallsResponse> => {
  const params: Record<string, string | number> = { page, limit };

  if (association && association !== 'todos') {
    params.association = association;
  }
  if (evolutionStartDate) {
    params.evolution_start_date = evolutionStartDate;
  }
  if (evolutionEndDate) {
    params.evolution_end_date = evolutionEndDate;
  }

  const { data } = await api.get<OpenCallsResponse>('/api/calls/guinchos/open', {
    params,
  });
  return data;
}
```

**Comportamento dos Gráficos:**

- **Evolução por Hora:** Usa `evolution_by_hour` da API filtrada por data e associação
- **Por Associação:** Usa `by_association` da API filtrada por data
- **Cards de Métricas:** Usa totais (`delayed`, `alert`, `on_time`) filtrados
- **Gráficos de Rosca:** Calculam % baseado nos totais filtrados

#### **Atualização Automática**

- Busca inicial ao carregar a página
- Atualização automática a cada **10 segundos** (polling)
- Mantém a página atual e filtro selecionado durante atualizações
- Estados de loading e error com feedback visual
- Som da sirene toca **por 2.5 segundos** ao detectar novo chamado atrasado
  - Compara `summary.delayed` atual com anterior
  - Se aumentou: toca sirene por 2.5 segundos e para automaticamente
  - A cada polling, repete o processo de detecção

#### **Paginação**

A tela possui controles de paginação completos:

**Configuração:**
- **20 chamados por página** (configurável via `perPage`)
- Botões "Anterior" e "Próximo"
- Indicador de página atual e total de páginas
- Contador de registros (mostrando X a Y de Z chamados)
- Botões desabilitados quando não aplicável

**Implementação:**
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState<Pagination | null>(null);
const perPage = 20;

useEffect(() => {
  const fetchChamados = async () => {
    const response = await callsService.getOpenCalls(currentPage, perPage);
    setChamados(response.data);
    setPagination(response.pagination);
  };
  fetchChamados();
}, [currentPage]);
```

**Navegação:**
- `handlePreviousPage()` - Volta uma página
- `handleNextPage()` - Avança uma página
- Desabilitado durante loading
- Desabilitado na primeira/última página

#### **Mapeamento de Dados**

Dados da API são mapeados para o formato da interface:

| Campo API | Uso na Interface |
|-----------|------------------|
| `associado.name` | **Label "Usuário"** - Nome do usuário no card |
| `associado.association` | **Label "Cliente"** - Associação (uppercase), exibe "Não definida" se null |
| `atendente?.name` | Nome do atendente (ou "Sem atendente") |
| `veiculo` | Formatado como "Marca Modelo - Placa" |
| `created_at` | Data/hora de início do chamado (string pré-formatada) |
| `expected_arrival_date` | Previsão de chegada do motorista (string pré-formatada ou null) |
| `expected_completion_date` | Previsão de conclusão do serviço (string pré-formatada ou null) |
| `timeStatus` | Status do tempo (`on_time`, `alert`, `delayed`) |
| `towing_distance_km` | Distância do guincho em km (métrica) |
| `towing_arrival_time_minutes` | Tempo de chegada em minutos (métrica) |
| `service_duration` | Duração do serviço (métrica, string pré-formatada) |

**Função helper:**
```typescript
const formatVehicle = (call: OpenCall): string => {
  if (!call.veiculo) return "Veículo não informado";
  const { brand, model, plate } = call.veiculo;
  return `${brand} ${model} - ${plate}`;
};
```

#### **⚠️ Labels de Exibição vs Campos da API**

**IMPORTANTE:** Os nomes dos campos na API são diferentes das labels exibidas na interface:

| Campo na API | Label Exibida | Nota |
|--------------|---------------|------|
| `associado.name` | **"Usuário"** | Nome da pessoa |
| `associado.association` | **"Cliente"** | Nome da associação (Solidy, Nova, etc.) |

**Exemplo de código:**
```typescript
{/* Campo API: associado.name */}
<p className="text-xs text-muted-foreground">Usuário</p>
<p className="font-semibold text-sm truncate">
  {call.associado?.name || "Usuário não informado"}
</p>

{/* Campo API: associado.association */}
<p className="text-xs text-muted-foreground">Cliente</p>
<p className={cn(
  "font-semibold text-sm truncate uppercase",
  !call.associado?.association && "text-muted-foreground italic normal-case"
)}>
  {call.associado?.association || "Não definida"}
</p>
```

**Comportamento do campo "Cliente":**
- ✅ Sempre visível (não condicional)
- ✅ Com valor: UPPERCASE (SOLIDY, NOVA, MOTOCLUB, APROVEL, AGSMB)
- ✅ Valor null: "Não definida" (itálico, cor clara, lowercase)

#### **Campos de Data nos Cards**

Cada card exibe **3 campos de data obrigatórios** (sempre visíveis):

1. **Início** (`created_at`)
   - Quando o chamado foi criado
   - Sempre tem valor
   - Formato: String pré-formatada pela API (ex: "04/02/2026, 18:12:11")
   - **Importante:** Não aplicar `formatDateTime()` - API já retorna formatado

2. **Prev. Chegada** (`expected_arrival_date`)
   - Quando o motorista deve chegar ao local
   - Exibe "Não definida" se for `null`
   - Formato: String pré-formatada pela API quando disponível
   - Estilo: Itálico e texto mais claro quando null

3. **Prev. Conclusão** (`expected_completion_date`)
   - Quando o serviço deve ser concluído
   - Exibe "Não definida" se for `null`
   - Formato: String pré-formatada pela API quando disponível
   - Estilo: Itálico e texto mais claro quando null

**Exemplo no Card:**
```
📅 Início: 04/02/2026, 18:12:11
🕐 Prev. Chegada: 04/02/2026, 19:00:00
🕐 Prev. Conclusão: Não definida
```

**Implementação:**
```typescript
<div className="flex items-center gap-1 text-xs shrink-0">
  <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
  <span className="text-muted-foreground shrink-0">Prev. Chegada:</span>
  <span className={cn(
    "font-medium truncate",
    !call.expected_arrival_date && "text-muted-foreground italic"
  )}>
    {call.expected_arrival_date || "Não definida"}
  </span>
</div>
```

**Nota Importante:**
- **NÃO** use `formatDateTime()` nos campos de data desta tela
- A API retorna strings já formatadas no padrão brasileiro
- Usar formatação adicional causará erros ou formatação duplicada

#### **Métricas de Desempenho nos Cards**

Cada card pode exibir até **3 métricas de desempenho** quando disponíveis:

1. **Distância** (`towing_distance_km`)
   - Distância do guincho em quilômetros
   - Ícone: RouteIcon (azul)
   - Formato: `{valor} km`
   - Condicional: Só exibe se houver valor

2. **Tempo de Chegada** (`towing_arrival_time_minutes`)
   - Tempo estimado de chegada do guincho em minutos
   - Ícone: Timer (laranja)
   - Formato: `{valor} min`
   - Condicional: Só exibe se valor não for `null` ou `undefined`

3. **Duração do Serviço** (`service_duration`)
   - Tempo total do serviço
   - Ícone: Wrench (roxo)
   - Formato: String pré-formatada pela API
   - Condicional: Só exibe se houver valor

**Layout:**
- Grid de 3 colunas responsivo
- Cada métrica em card individual com fundo `bg-muted/50`
- Seção separada por borda superior
- Só aparece se pelo menos uma métrica existir

**Implementação:**
```typescript
{(call.towing_distance_km || call.towing_arrival_time_minutes || call.service_duration) && (
  <div className="pt-3 border-t border-border">
    <div className="grid grid-cols-3 gap-2">
      {call.towing_distance_km && (
        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
          <RouteIcon className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs font-semibold">{call.towing_distance_km} km</span>
          <span className="text-[10px] text-muted-foreground">Distância</span>
        </div>
      )}
      {call.towing_arrival_time_minutes !== null && call.towing_arrival_time_minutes !== undefined && (
        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
          <Timer className="h-3.5 w-3.5 text-orange-500" />
          <span className="text-xs font-semibold">{call.towing_arrival_time_minutes} min</span>
          <span className="text-[10px] text-muted-foreground">Chegada</span>
        </div>
      )}
      {call.service_duration && (
        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
          <Wrench className="h-3.5 w-3.5 text-purple-500" />
          <span className="text-xs font-semibold">{call.service_duration}</span>
          <span className="text-[10px] text-muted-foreground">Serviço</span>
        </div>
      )}
    </div>
  </div>
)}
```

**Mapeamento da API:**

| Campo API | Tipo | Descrição | Formatação Frontend |
|-----------|------|-----------|---------------------|
| `towing_distance_km` | `number \| null` | Distância do guincho em km | `{valor} km` |
| `towing_arrival_time_minutes` | `number \| null` | Tempo de chegada em minutos | `{valor} min` |
| `service_duration` | `string \| null` | Duração do serviço | String direta (pré-formatada) |

---

### **🎨 Interface Visual**

#### **Status de Chamados**

A página exibe cards coloridos baseados no status de tempo:

| Status | Cor | Descrição |
|--------|-----|-----------|
| **Atrasado** | Vermelho | Chamados que ultrapassaram o prazo estimado |
| **Alerta** | Amarelo/Âmbar | Chamados próximos ao prazo ou sem previsão |
| **No Prazo** | Verde | Chamados dentro do tempo esperado |

#### **Estrutura dos Cards**

Cada card de chamado exibe as seguintes informações na ordem:

**1. Badge de Status** (canto superior direito)
- "ATRASADO" (vermelho) / "ALERTA" (amarelo) / "NO PRAZO" (verde)

**2. Seção de Identificação:**

| Campo | Label Exibida | Campo API | Ícone | Fallback |
|-------|---------------|-----------|-------|----------|
| **Usuário** | "Usuário" | `associado.name` | User | "Usuário não informado" |
| **Cliente** | "Cliente" | `associado.association` | Building2 | "Não definida" |
| **Atendente** | "Atendente" | `atendente?.name` | User | "Sem atendente" |

**3. Seção de Veículo:**

| Campo | Label Exibida | Campo API | Formato |
|-------|---------------|-----------|---------|
| **Veículo** | "Veículo" | `veiculo` | "MARCA MODELO - PLACA" ou "Veículo não informado" |

**4. Seção de Datas:** (sempre visíveis)

| Campo | Label Exibida | Campo API | Formato | Fallback |
|-------|---------------|-----------|---------|----------|
| **Início** | "Início:" | `created_at` | String API | - |
| **Prev. Chegada** | "Prev. Chegada:" | `expected_arrival_date` | String API | "Não definida" |
| **Prev. Conclusão** | "Prev. Conclusão:" | `expected_completion_date` | String API | "Não definida" |

**5. Seção de Métricas** (condicional - só aparece se houver pelo menos uma métrica):

| Métrica | Label Exibida | Campo API | Ícone | Cor |
|---------|---------------|-----------|-------|-----|
| **Distância** | "Distância" | `towing_distance_km` | RouteIcon | Azul |
| **Chegada** | "Chegada" | `towing_arrival_time_minutes` | Timer | Laranja |
| **Serviço** | "Serviço" | `service_duration` | Wrench | Roxo |

**Regras de Exibição:**

- ✅ **Campo "Cliente":** Sempre visível (mesmo quando null)
  - Com valor: Exibe em UPPERCASE (ex: SOLIDY, NOVA, MOTOCLUB)
  - Valor null: Exibe "Não definida" em itálico e cor mais clara

- ✅ **Campos de Data:** Sempre visíveis
  - API retorna strings pré-formatadas (ex: "04/02/2026, 18:12:11")
  - **NÃO** aplicar `formatDateTime()` - usar string direta
  - Quando null: Exibe "Não definida" em itálico

- ✅ **Métricas:** Renderização condicional
  - Só exibe a seção se pelo menos uma métrica existir
  - Cada métrica individual só aparece se tiver valor
  - Layout: Grid 3 colunas responsivo

**Exemplo Visual:**

```
┌─────────────────────────────────┐
│                    [NO PRAZO] ←──┤ Badge
├─────────────────────────────────┤
│ 👤 Usuário                       │
│    ERIVELTON AGUIAR             │
├─────────────────────────────────┤
│ 🏢 Cliente                       │
│    SOLIDY                        │ (ou "Não definida")
├─────────────────────────────────┤
│ 👨‍💼 Atendente                    │
│    João Silva                    │
├─────────────────────────────────┤
│ 🚗 Veículo                       │
│    FIAT UNO - ABC-1234          │
├─────────────────────────────────┤
│ 📅 Início:                       │
│    04/02/2026, 18:12:11         │
│ 🕐 Prev. Chegada:                │
│    04/02/2026, 19:00:00         │
│ 🕐 Prev. Conclusão:              │
│    Não definida                  │
├─────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐        │ Métricas
│ │15 km│ │30min│ │45min│        │ (condicional)
│ └─────┘ └─────┘ └─────┘        │
└─────────────────────────────────┘
```

#### **Funcionalidades**

- **Relógio em tempo real:** Atualizado a cada segundo
- **Modo fullscreen:** Botão para entrar/sair do modo tela cheia
- **Contadores de status:** Resumo de quantos chamados em cada status (usa `summary` da API)
- **Grid responsivo:** Adaptação automática do layout baseado no tamanho da tela
- **Atualização automática:** Interface atualiza em tempo real

#### **Contadores de Status**

Os contadores no topo da tela exibem o **total de chamados em cada status** de toda a base, não apenas da página atual.

**Fonte dos Dados:**
- A API retorna um campo `summary` na resposta com totais agregados
- **NÃO** conta os chamados da página atual (evita números incorretos)
- Reflete o estado global do sistema

**Estrutura da Resposta da API:**
```typescript
interface OpenCallsResponse {
  data: OpenCall[];
  pagination: Pagination;
  summary: {
    delayed: number;   // Total de chamados atrasados (todas as páginas)
    alert: number;     // Total de chamados em alerta (todas as páginas)
    on_time: number;   // Total de chamados no prazo (todas as páginas)
  };
}

interface OpenCall {
  id: string;
  towing_status: string;
  towing_service_type: string;
  address: string;
  associado: {
    id: string;
    name: string;
    phone: string;
    cpf: string;
    association: string;  // Associação (ex: "solidy", "nova", "motoclub")
  } | null;
  atendente: {
    id: string;
    name: string;
    email: string;
  } | null;
  veiculo: {
    id: string;
    plate: string;
    model: string;
    brand: string;
    color: string;
    year: string;
    category: string | null;
  } | null;
  motorista: {
    id: string;
    name: string;
    phone: string;
    status?: string;
    profile_image_path?: string;
  } | null;
  created_at: string;                      // String pré-formatada (ex: "04/02/2026, 18:12:11")
  expected_arrival_date: string | null;    // String pré-formatada ou null
  expected_completion_date: string | null; // String pré-formatada ou null
  towing_distance_km: number | null;       // Distância em km (métrica)
  towing_arrival_time_minutes: number | null; // Tempo de chegada em minutos (métrica)
  service_duration: string | null;         // Duração do serviço pré-formatada (métrica)
  timeStatus: string;                      // "on_time" | "alert" | "delayed"
}
```

**Implementação:**
```typescript
const [summary, setSummary] = useState({ delayed: 0, alert: 0, on_time: 0 });

useEffect(() => {
  const fetchChamados = async () => {
    const response = await callsService.getOpenCalls(currentPage, perPage);
    setChamados(response.data);
    setPagination(response.pagination);
    setSummary(response.summary); // ← Atualiza contadores globais
  };

  fetchChamados();
  const interval = setInterval(fetchChamados, 10000); // Polling a cada 10s
  return () => clearInterval(interval);
}, [currentPage]);

// Usar summary nos contadores
const delayedCount = summary.delayed;
const alertCount = summary.alert;
const normalCount = summary.on_time;
```

**Exemplo:**
- Página mostrando: 1 a 20 de 29.773 chamados
- Contadores: 2 Atrasados • 0 Alertas • 29.771 No prazo
- ✅ Total correto: 2 + 0 + 29.771 = 29.773

---

### **📊 Estrutura de Dados**

```typescript
interface AcompanhamentoItem {
  id: string;
  clientName: string;        // Nome do cliente
  userName: string;           // Nome do atendente
  vehicle: string;            // Modelo e placa do veículo
  startDate: string;          // Data/hora de início
  estimatedEndDate: string | null;  // Previsão de término
  timeStatus: "normal" | "alert" | "delayed";  // Status do tempo
}
```

---

### **🔊 Controle de Som**

**Botão de Controle:**
- Localização: Canto superior direito, ao lado do botão fullscreen
- Ícone muted: `VolumeX` (vermelho/destructive)
- Ícone playing: `Volume2` (padrão)
- Tooltip: "Ativar Som" / "Desativar Som"

**Estados:**
- `isMuted = false`: Som tocando, ícone Volume2
- `isMuted = true`: Som pausado, ícone VolumeX

---

### **🚀 Acesso à Página**

A página pode ser acessada de duas formas:

1. **Via botão no Dashboard:**
   - Componente `DateRangeFilter` possui botão "Acompanhamento"
   - Abre em nova aba usando `window.open()`

2. **Via URL direta:**
   - Navegue para `/acompanhamento-fullscreen`
   - Não requer autenticação (rota pública)

---

### **⚙️ Configuração da Rota**

```typescript
// src/App.tsx
<Route path="/acompanhamento-fullscreen" element={<AcompanhamentoFullscreen />} />
```

**Nota:** Rota está **fora** do `<ProtectedRoute>`, permitindo acesso sem login para uso em monitores dedicados.

---

### **📝 Resumo das Funcionalidades**

#### **✨ Principais Recursos**

1. **Monitoramento em Tempo Real**
   - Polling a cada 10 segundos
   - Atualização automática de dados
   - Indicador de loading durante busca

2. **Alertas Sonoros Inteligentes**
   - Som de sirene policial (Web Audio API)
   - Toca **APENAS** quando há chamados atrasados
   - Padrão "Wail": 500Hz → 1200Hz em 2.5s
   - Controle mute/unmute

3. **Sistema de Paginação**
   - 20 chamados por página
   - Navegação anterior/próxima
   - Contador de registros e páginas
   - Mantém página durante polling

4. **Contadores Globais**
   - Total de atrasados (vermelho)
   - Total de alertas (amarelo)
   - Total no prazo (verde)
   - Usa `summary` da API (não conta página atual)
   - Tooltips explicativos ao passar o mouse sobre cada contador

5. **Métricas de Desempenho**
   - Distância do guincho (km)
   - Tempo de chegada (minutos)
   - Duração do serviço
   - Grid 3 colunas com ícones coloridos

6. **Interface Visual**
   - Cards coloridos por status (vermelho/amarelo/verde)
   - Relógio em tempo real
   - Modo fullscreen
   - Grid responsivo (1-5 colunas)

7. **Ícone de Ajuda nos Cards**
   - Ícone "?" (HelpCircle) no canto superior esquerdo de cada card
   - Tooltip explicativo ao passar o mouse
   - Informações sobre todos os campos do card
   - Aparece ao lado direito para não sobrepor o conteúdo

#### **🔄 Fluxo de Dados**

```
API Response (a cada 10s)
    ↓
OpenCallsResponse
    ├── data: OpenCall[] → Grid de cards
    ├── pagination → Controles de página
    └── summary → Contadores globais + controle de áudio
```

#### **⚠️ Pontos Importantes**

- ✅ **Datas já formatadas:** API retorna strings prontas, **NÃO** usar `formatDateTime()`
- ✅ **Métricas condicionais:** Só exibe se houver pelo menos uma métrica disponível
- ✅ **Som condicional:** Só toca quando `summary.delayed > 0`
- ✅ **Contadores corretos:** Usa `summary` da API, não conta items da página
- ✅ **Campos sempre visíveis:** `expected_arrival_date` e `expected_completion_date` mostram "Não definida" quando null

#### **❓ Ícone de Ajuda com Tooltip**

Cada card possui um ícone de ajuda (?) que exibe um tooltip explicativo ao passar o mouse.

**Localização:**
- Canto superior esquerdo do card
- Ao lado do badge de status

**Componente:**
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="p-1 hover:bg-muted rounded-full transition-colors">
        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="right" className="max-w-xs p-4">
      {/* Conteúdo explicativo */}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Conteúdo do Tooltip:**

| Campo | Descrição |
|-------|-----------|
| **Usuário** | Nome do associado/cliente que solicitou o atendimento |
| **Cliente** | Associação ou empresa responsável (Solidy, Nova, Motoclub, etc.) |
| **Atendente** | Responsável que está atendendo o chamado |
| **Veículo** | Informações do veículo (marca, modelo e placa) |
| **Início** | Data/hora que o chamado foi criado |
| **Prev. Chegada** | Previsão de chegada do guincho ao local |
| **Prev. Conclusão** | Previsão de conclusão total do atendimento |
| **Distância** | Distância em km até o local do chamado |
| **Chegada** | Tempo estimado de chegada em minutos |
| **Serviço** | Duração estimada para conclusão do serviço |

**Características:**
- ✅ Aparece ao lado direito (`side="right"`) para não cobrir o card
- ✅ Largura máxima controlada (`max-w-xs`)
- ✅ Seções separadas por bordas para melhor legibilidade
- ✅ Labels em negrito para destaque
- ✅ Hover suave no ícone (muted → foreground)

**Imports Necessários:**
```tsx
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
```

**Nota:** O Tooltip do shadcn/ui foi renomeado para não conflitar com o Tooltip do Recharts usado nos gráficos:
```tsx
import { Tooltip as RechartsTooltip } from "recharts";
```

#### **📊 Tooltips dos Contadores de Status**

Os contadores globais no header (Atrasados, Alertas, No Prazo) possuem tooltips explicativos.

**Localização:**
- Header da página, ao lado do relógio
- Antes dos botões de toggle Cards/Análise

**Implementação:**
```tsx
{/* Atrasados */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="flex items-center gap-2 cursor-help">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="text-sm font-medium">{delayedCount} Atrasados</span>
      </div>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs">
      <p className="font-semibold mb-1">Atrasados</p>
      <p className="text-xs">
        Chamados que ultrapassaram o tempo previsto de conclusão.
        Requerem atenção imediata.
      </p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Descrições dos Status:**

| Status | Cor | Descrição | Critério |
|--------|-----|-----------|----------|
| **Atrasados** 🔴 | Vermelho (`bg-red-500`) | Chamados que ultrapassaram o tempo previsto de conclusão. Requerem atenção imediata. | Passou do horário previsto |
| **Alertas** ⚠️ | Amarelo (`bg-amber-500`) | Chamados próximos ao prazo limite. Devem ser monitorados com atenção. | Faltam entre 1 e 10 minutos para o prazo |
| **No Prazo** ✅ | Verde (`bg-emerald-500`) | Chamados dentro do tempo esperado de conclusão. Operação normal. | Faltam mais de 10 minutos para o prazo |

**Exemplos de Cenários:**
- Faltam 15 minutos → **No Prazo** ✅
- Faltam 10 minutos → **Alerta** ⚠️
- Faltam 5 minutos → **Alerta** ⚠️
- Faltam 1 minuto → **Alerta** ⚠️
- Passou 1 minuto → **Atrasado** 🔴

**Características:**
- ✅ Cursor muda para `help` (?) ao passar sobre o contador
- ✅ Tooltip aparece automaticamente ao hover
- ✅ Largura máxima controlada (`max-w-xs`)
- ✅ Título em negrito + descrição em texto pequeno
- ✅ Mesma experiência visual dos outros tooltips

#### **📦 Arquivos Relacionados**

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/pages/AcompanhamentoFullscreen.tsx` | Componente principal da página |
| `src/services/calls.service.ts` | Serviço com `getOpenCalls()` e interfaces |
| `src/App.tsx` | Rota `/acompanhamento-fullscreen` (pública) |
| `src/components/dashboard/DateRangeFilter.tsx` | Botão "Acompanhamento" para abrir em nova aba |

---

## **📊 Modo Analítico - Dashboard de Análise**

### **Visão Geral**

O Acompanhamento Fullscreen possui dois modos de visualização:
1. **Cards**: Exibição tradicional em cards com polling de 10 segundos
2. **Análise**: Dashboard analítico com gráficos e métricas agregadas

### **Alternância de Modos**

Botões de toggle localizados no header (ao lado do botão de som):
- **Cards** (ícone `LayoutGrid`): Visualização em cards
- **Análise** (ícone `BarChart3`): Visualização analítica

### **Endpoint Analítico**

#### **📡 GET /api/calls/guinchos/open/analitico**

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `start_by_hour` | string | Não | Data inicial no formato YYYY-MM-DD |
| `end_by_hour` | string | Não | Data final no formato YYYY-MM-DD |

**Estrutura da Resposta:**
```typescript
interface AnalyticsResponse {
  total: number;
  delayed: number;
  alert: number;
  on_time: number;
  evolution_by_hour: Array<{
    hour: string;        // Formato "HH:00"
    on_time: number;
    alert: number;
    delayed: number;
  }>;
  by_association: {
    [key: string]: {     // "solidy", "nova", "motoclub", "aprovel"
      on_time: number;
      alert: number;
      delayed: number;
    };
  };
}
```

**Exemplo de Resposta:**
```json
{
  "total": 29773,
  "delayed": 2,
  "alert": 0,
  "on_time": 29771,
  "evolution_by_hour": [
    {
      "hour": "00:00",
      "on_time": 5,
      "alert": 0,
      "delayed": 0
    },
    {
      "hour": "01:00",
      "on_time": 3,
      "alert": 0,
      "delayed": 0
    }
  ],
  "by_association": {
    "solidy": {
      "on_time": 488,
      "alert": 0,
      "delayed": 1
    },
    "motoclub": {
      "on_time": 142,
      "alert": 0,
      "delayed": 0
    },
    "nova": {
      "on_time": 53,
      "alert": 0,
      "delayed": 0
    },
    "aprovel": {
      "on_time": 0,
      "alert": 0,
      "delayed": 0
    }
  }
}
```

**Diferenças do endpoint `/open`:**
- Retorna dados agregados **diretamente no root** (sem wrapper `summary`)
- Inclui campo `total` com contagem total de chamados
- Não retorna array `data` nem `pagination`
- Focado exclusivamente em dados analíticos
- Possui campos `evolution_by_hour` e `by_association` que **NÃO** existem no endpoint `/open`

**Estrutura do endpoint `/open` (simplificada):**
```json
{
  "data": [...],
  "summary": {
    "delayed": 2,
    "alert": 0,
    "on_time": 29771
  },
  "pagination": {...}
}
```

**Nota:** O endpoint `/open` não retorna mais `evolution_by_hour` e `by_association`. Esses dados estão disponíveis exclusivamente no endpoint `/analitico`.

### **Implementação do Service**

```typescript
// src/services/calls.service.ts

export const callsService = {
  /**
   * GET /api/calls/guinchos/open/analitico
   * Busca dados analíticos dos chamados em aberto
   */
  getAnalytics: async (
    startByHour?: string,
    endByHour?: string
  ): Promise<AnalyticsResponse> => {
    const params: Record<string, string> = {};
    if (startByHour) params.start_by_hour = startByHour;
    if (endByHour) params.end_by_hour = endByHour;

    const { data } = await api.get<AnalyticsResponse>(
      '/api/calls/guinchos/open/analitico',
      { params }
    );
    return data;
  },
};
```

### **Componente AnalyticsView**

**Características:**
- Estado próprio independente do modo Cards
- Carrega dados ao ser montado
- Filtro de data automático (primeiro e último dia do mês)
- **SEM polling automático** (apenas no modo Cards)

**Estrutura do Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Métricas  │    Gráficos Centrais    │  Gráficos Rosca │
│   (2 cols) │        (7 cols)         │     (3 cols)    │
├────────────┼─────────────────────────┼──────────────────┤
│  • Total   │  Evolução por Hora      │  Total Atrasos  │
│  • Atras.  │  (Gráfico de Área)      │  (Donut Chart)  │
│  • Alertas │                         │                 │
│  • No Prazo│  ─────────────────────  │  Total No Prazo │
│            │  Por Cliente            │  (Donut Chart)  │
│            │  (Barra Horizontal)     │                 │
└────────────┴─────────────────────────┴──────────────────┘
```

### **Gráficos e Visualizações**

#### **1. Cards de Métricas (Esquerda)**
- **Total de Chamados**: Soma geral
- **Atrasados**: Cor magenta (#ec4899)
- **Alertas**: Cor amarela (#f59e0b)
- **No Prazo**: Cor verde (#10b981)

#### **2. Evolução por Hora (Centro)**
- Tipo: Gráfico de Área (AreaChart)
- Dados: `evolution_by_hour`
- Séries:
  - "No Prazo" (azul, com gradiente)
  - "Alertas" (amarelo)
  - "Atrasados" (magenta)
- Filtros de data:
  - Data Início (Calendar Picker)
  - Data Fim (Calendar Picker)
  - Botão "Limpar"
  - **Inicialização:** Primeiro e último dia do mês atual

#### **3. Por Cliente (Centro)**
- Tipo: Barra Horizontal (BarChart)
- Dados: `by_association`
- Mostra total por cliente (Solidy, Nova, Motoclub, Aprovel)

#### **4. Gráficos de Rosca (Direita)**
- **Total em Atrasos**: % de atrasados vs outros
- **Total no Prazo**: % no prazo vs outros
- Formato: Donut Chart (PieChart com innerRadius)

### **Sistema de Polling**

#### **Modo Cards**
```typescript
useEffect(() => {
  if (viewMode === 'analytics') {
    setLoading(false);
    return; // Sai sem criar interval
  }

  const fetchChamados = async () => {
    const response = await callsService.getOpenCalls(...);
    // Atualiza dados
  };

  fetchChamados();
  const interval = setInterval(fetchChamados, 10000); // ✅ Polling a cada 10s

  return () => clearInterval(interval); // ✅ Limpa ao mudar de modo
}, [currentPage, selectedAssociation, viewMode]);
```

**Comportamento:**
- ✅ **Modo Cards**: Polling ativo a cada 10 segundos
- ❌ **Modo Analítico**: SEM polling automático
- ✅ **Volta para Cards**: Polling reinicia automaticamente

#### **Modo Analítico**
```typescript
useEffect(() => {
  const fetchAnalytics = async () => {
    const startByHour = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
    const endByHour = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

    const response = await callsService.getAnalytics(startByHour, endByHour);
    setAnalyticsData({
      delayed: response.delayed || 0,
      alert: response.alert || 0,
      on_time: response.on_time || 0,
      evolution_by_hour: response.evolution_by_hour || [],
      by_association: response.by_association || {},
    });
  };

  if (startDate && endDate) {
    fetchAnalytics(); // ✅ Busca apenas quando datas mudam
  }
}, [startDate, endDate]);
```

**Comportamento:**
- Carrega dados ao montar o componente
- Recarrega quando usuário altera datas no filtro
- **SEM atualização automática** (sem `setInterval`)

### **Fluxo de Dados - Modo Analítico**

```
Usuário clica em "Análise"
    ↓
AnalyticsView monta
    ↓
Inicializa datas (1º e último dia do mês)
    ↓
GET /api/calls/guinchos/open/analitico?start_by_hour=2026-02-01&end_by_hour=2026-02-28
    ↓
AnalyticsResponse (dados diretos, sem "summary" wrapper)
    ↓
Renderiza gráficos e métricas
    ↓
Usuário altera datas → Nova requisição com novos parâmetros
```

### **Tratamento de Erros**

```typescript
try {
  const response = await callsService.getAnalytics(startByHour, endByHour);
  setAnalyticsData({
    delayed: response.delayed || 0,
    alert: response.alert || 0,
    on_time: response.on_time || 0,
    evolution_by_hour: response.evolution_by_hour || [],
    by_association: response.by_association || {},
  });
} catch (err) {
  console.error('Erro ao buscar dados analíticos:', err);
  setError('Não foi possível carregar os dados analíticos. A página será atualizada automaticamente.');
  // Mantém dados zerados em caso de erro
  setAnalyticsData({
    delayed: 0,
    alert: 0,
    on_time: 0,
    evolution_by_hour: [],
    by_association: {},
  });
}
```

**Estados de UI:**
1. **Loading**: Spinner + mensagem "Carregando dados analíticos..."
2. **Error**: Ícone de alerta + mensagem de erro
3. **Success**: Renderiza gráficos normalmente

### **Configurações de Timeout**

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000, // 30 segundos para processamento analítico
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Motivo:** Dados analíticos podem demorar mais para processar (média 7s no Postman)

### **Cores do Tema Analítico**

```typescript
const colors = {
  primary: '#2563eb',   // Azul (No Prazo)
  accent: '#ec4899',    // Magenta/Rosa (Atrasados)
  success: '#10b981',   // Verde (Sucesso)
  warning: '#f59e0b',   // Amarelo (Alertas)
  danger: '#ef4444',    // Vermelho (Perigo)
  gray: '#94a3b8',      // Cinza (Outros)
};
```

### **Bibliotecas Utilizadas**

- **Recharts**: Gráficos (PieChart, BarChart, AreaChart)
- **date-fns**: Manipulação de datas (startOfMonth, endOfMonth, format)
- **shadcn/ui**: Componentes (Calendar, Popover, Card)
- **Lucide Icons**: Ícones (LayoutGrid, BarChart3, CalendarIcon)

### **Exemplo de Uso - Filtro por Data**

```typescript
// Inicialização automática
useEffect(() => {
  const hoje = new Date();
  setStartDate(startOfMonth(hoje));  // 2026-02-01
  setEndDate(endOfMonth(hoje));      // 2026-02-28
}, []);

// Quando usuário seleciona nova data
<CalendarPicker
  mode="single"
  selected={startDate}
  onSelect={setStartDate}  // ← Triggers nova requisição
  locale={ptBR}
/>
```

### **Comparação: Cards vs Analítico**

| Característica | Modo Cards | Modo Analítico |
|----------------|-----------|----------------|
| **Endpoint** | `/api/calls/guinchos/open` | `/api/calls/guinchos/open/analitico` |
| **Polling** | ✅ 10 segundos | ❌ Desabilitado |
| **Dados Retornados** | `data[]`, `summary`, `pagination` | `total`, `delayed`, `alert`, `on_time`, `evolution_by_hour[]`, `by_association{}` |
| **Summary** | Apenas contadores básicos (`delayed`, `alert`, `on_time`) | Dados completos para gráficos |
| **Visualização** | Grid de cards | Gráficos e métricas |
| **Filtros** | Associação + Paginação | Datas (start_by_hour, end_by_hour) |
| **Performance** | Leve (10-20 registros) | Pesado (~7s de processamento) |
| **Atualização** | Automática (10s) | Manual (usuário altera datas) |
| **Campos Especiais** | - | `evolution_by_hour`, `by_association` |

### **Arquivos Modificados**

| Arquivo | Mudanças |
|---------|----------|
| `src/services/calls.service.ts` | Adicionado `getAnalytics()` e interface `AnalyticsResponse` |
| `src/pages/AcompanhamentoFullscreen.tsx` | Componente `AnalyticsView` e toggle de modos |
| `src/lib/api.ts` | Timeout aumentado para 30s |

---

## **📊 Cards de Métricas por Associação - Modo Cards**

### **Visão Geral**

No modo Cards, abaixo do filtro de clientes, são exibidos cards individuais para cada associação mostrando suas métricas em tempo real (atrasados, alertas e no prazo).

### **Dados da API**

O endpoint `/api/calls/guinchos/open` retorna `by_association` dentro do `summary`:

```typescript
interface OpenCallsResponse {
  data: OpenCall[];
  pagination: Pagination;
  summary: {
    delayed: number;
    alert: number;
    on_time: number;
    by_association: {
      [key: string]: {     // "solidy", "nova", "motoclub", "aprovel"
        on_time: number;
        alert: number;
        delayed: number;
      };
    };
  };
}
```

**Exemplo de Resposta:**
```json
{
  "summary": {
    "delayed": 2,
    "alert": 0,
    "on_time": 29771,
    "by_association": {
      "solidy": {
        "on_time": 488,
        "alert": 0,
        "delayed": 1
      },
      "motoclub": {
        "on_time": 142,
        "alert": 0,
        "delayed": 0
      },
      "nova": {
        "on_time": 53,
        "alert": 0,
        "delayed": 0
      },
      "aprovel": {
        "on_time": 0,
        "alert": 0,
        "delayed": 0
      }
    }
  }
}
```

### **Layout dos Cards**

**Posicionamento:**
- Localizado entre o filtro de clientes e o grid de chamados
- Grid responsivo: 1 coluna (mobile) → 2 (tablet) → 4 (desktop)

**Ordem Fixa (alinhada com filtros):**
1. Solidy (verde)
2. Nova (azul)
3. Motoclub (laranja)
4. Aprovel (teal)

### **Estrutura de Cada Card**

```
┌─────────────────────────────┐
│ ┌─ SOLIDY ─────────────────┐│ ← Header com gradiente
│ │ Total: 489 chamados      ││ ← Contador total
│ └──────────────────────────┘│
├─────────────────────────────┤
│ 🔴 Atrasados           1    │ ← Fundo vermelho claro
├─────────────────────────────┤
│ 🟡 Alertas             0    │ ← Fundo amarelo claro
├─────────────────────────────┤
│ 🟢 No Prazo          488    │ ← Fundo verde claro
└─────────────────────────────┘
```

### **Configuração por Associação**

| Associação | Label | Gradiente | Borda |
|------------|-------|-----------|-------|
| `solidy` | Solidy | `from-green-500 to-green-600` | `border-green-500` |
| `nova` | Nova | `from-blue-500 to-blue-600` | `border-blue-500` |
| `motoclub` | Motoclub | `from-orange-500 to-orange-600` | `border-orange-500` |
| `aprovel` | Aprovel | `from-teal-500 to-teal-600` | `border-teal-500` |

### **Cores das Métricas**

| Métrica | Cor | Fundo | Número |
|---------|-----|-------|--------|
| **Atrasados** | Vermelho | `bg-red-50 dark:bg-red-950/20` | `text-red-600 dark:text-red-400` |
| **Alertas** | Amarelo | `bg-amber-50 dark:bg-amber-950/20` | `text-amber-600 dark:text-amber-400` |
| **No Prazo** | Verde | `bg-emerald-50 dark:bg-emerald-950/20` | `text-emerald-600 dark:text-emerald-400` |

### **Implementação**

```typescript
// src/pages/AcompanhamentoFullscreen.tsx

{/* Cards de Métricas por Associação */}
{summary.by_association && Object.keys(summary.by_association).length > 0 && (
  <div className="mb-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {['solidy', 'nova', 'motoclub', 'aprovel']
        .filter(association => summary.by_association[association])
        .map((association) => {
        const data = summary.by_association[association];
        const total = data.delayed + data.alert + data.on_time;
        const associationConfig = {
          solidy: { label: 'Solidy', color: 'from-green-500 to-green-600', border: 'border-green-500' },
          nova: { label: 'Nova', color: 'from-blue-500 to-blue-600', border: 'border-blue-500' },
          motoclub: { label: 'Motoclub', color: 'from-orange-500 to-orange-600', border: 'border-orange-500' },
          aprovel: { label: 'Aprovel', color: 'from-teal-500 to-teal-600', border: 'border-teal-500' },
        }[association];

        return (
          <Card key={association} className={cn("border-2", associationConfig.border)}>
            <CardContent className="p-4">
              {/* Header */}
              <div className={cn("mb-3 pb-2 border-b-2", associationConfig.border)}>
                <h3 className={cn("text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent", associationConfig.color)}>
                  {associationConfig.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total: {total} {total === 1 ? 'chamado' : 'chamados'}
                </p>
              </div>

              {/* Métricas */}
              <div className="space-y-2">
                {/* Atrasados */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Atrasados</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{data.delayed}</span>
                </div>

                {/* Alertas */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium">Alertas</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{data.alert}</span>
                </div>

                {/* No Prazo */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">No Prazo</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{data.on_time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
)}
```

### **Características**

**✅ Ordem Fixa:**
- Cards sempre aparecem na ordem: Solidy → Nova → Motoclub → Aprovel
- Independente da ordem retornada pela API
- Filtro garante que só exibe associações existentes

**✅ Responsividade:**
- Mobile (< 768px): 1 coluna
- Tablet (768px - 1024px): 2 colunas
- Desktop (> 1024px): 4 colunas

**✅ Visual:**
- Borda colorida de 2px
- Header com gradiente no texto
- Indicadores circulares coloridos
- Fundos suaves para cada métrica
- Hover com sombra aumentada

**✅ Atualização:**
- Dados atualizados a cada 10 segundos (polling do modo Cards)
- Sincronizado com o endpoint `/api/calls/guinchos/open`

### **Fluxo de Dados**

```
API Response (a cada 10s)
    ↓
summary.by_association
    ↓
Array ordenado: ['solidy', 'nova', 'motoclub', 'aprovel']
    ↓
Filter (só associações existentes)
    ↓
Map → Renderiza cards na ordem fixa
```

### **Diferenças: Endpoint `/open` vs `/analitico`**

| Campo | `/open` | `/analitico` |
|-------|---------|--------------|
| `by_association` | ✅ Sim (dentro de `summary`) | ✅ Sim (root) |
| `evolution_by_hour` | ❌ Não | ✅ Sim |
| `data[]` | ✅ Sim | ❌ Não |
| `pagination` | ✅ Sim | ❌ Não |

**Importante:** Agora ambos os endpoints retornam `by_association`, mas com propósitos diferentes:
- `/open`: Para cards de métricas no modo Cards
- `/analitico`: Para gráficos no modo Analítico

---

