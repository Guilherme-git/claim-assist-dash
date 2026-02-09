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
- **react-currency-input-field** 3.8.0 - Máscaras de entrada para valores monetários

---

## 🐳 AMBIENTE DOCKER

### **Arquitetura do Projeto**

O frontend roda **DENTRO de um container Docker**, não diretamente na máquina host.

**Estrutura:**
```
Host Machine: /var/www/utiliza/utiliza-front-assistencia/
    ↓ Volume montado em ↓
Docker Container: /app/
    ↓ Vite dev server roda aqui ↓
http://localhost:8080
```

**Container:**
- **Nome:** `utiliza-front-assistencia-app-1`
- **Imagem:** `utiliza-front-assistencia-app`
- **Porta:** `8080:8080`
- **Working Directory:** `/app`
- **Node Modules:** `/app/node_modules` (DENTRO do container)

### **⚠️ INSTALAÇÃO DE PACOTES NPM - IMPORTANTE!**

#### **❌ ERRADO - Instalar no Host**

```bash
# ❌ NÃO FAÇA ISSO! Instala na máquina host
cd /var/www/utiliza/utiliza-front-assistencia
npm install react-currency-input-field

# Resultado: Pacote instalado em:
# /var/www/utiliza/utiliza-front-assistencia/node_modules/
# ❌ Mas o Vite procura em: /app/node_modules/ (container)
# ❌ Erro: "Failed to resolve import"
```

#### **✅ CORRETO - Instalar no Container**

```bash
# ✅ SEMPRE USE ESTE COMANDO!
docker exec utiliza-front-assistencia-app-1 npm install react-currency-input-field

# Resultado: Pacote instalado em:
# /app/node_modules/ (dentro do container)
# ✅ Vite encontra o pacote corretamente
# ✅ Hot reload automático, sem necessidade de reiniciar
```

### **Comandos Docker Úteis**

#### **Verificar Containers Rodando**
```bash
docker ps | grep front
# Saída esperada:
# utiliza-front-assistencia-app-1
```

#### **Instalar Dependência**
```bash
docker exec utiliza-front-assistencia-app-1 npm install <package-name>
```

#### **Desinstalar Dependência**
```bash
docker exec utiliza-front-assistencia-app-1 npm uninstall <package-name>
```

#### **Ver Logs do Container**
```bash
docker logs utiliza-front-assistencia-app-1 -f
```

#### **Acessar Shell do Container**
```bash
docker exec -it utiliza-front-assistencia-app-1 sh
```

#### **Reiniciar Container**
```bash
docker restart utiliza-front-assistencia-app-1
```

### **Por Que Este Setup?**

1. **Isolamento:** Dependências isoladas do sistema host
2. **Consistência:** Mesmo ambiente em dev/staging/prod
3. **Node Modules:** Evita conflitos entre host e container
4. **Hot Reload:** Vite detecta mudanças nos arquivos montados por volume
5. **Segurança:** Container não afeta o sistema host

### **Fluxo de Trabalho Correto**

```bash
# 1. Editar código no host
vim /var/www/utiliza/utiliza-front-assistencia/src/components/MyComponent.tsx

# 2. Vite hot-reload automático (funciona via volume mount)

# 3. Instalar nova dependência - SEMPRE no container!
docker exec utiliza-front-assistencia-app-1 npm install <package>

# 4. Container hot-reload automático após npm install
# Não precisa reiniciar manualmente!
```

### **Troubleshooting**

#### **Erro: "Failed to resolve import"**

**Causa:** Pacote instalado no host, não no container

**Solução:**
```bash
# Instalar no container
docker exec utiliza-front-assistencia-app-1 npm install <package-name>

# Verificar se instalou
docker exec utiliza-front-assistencia-app-1 ls /app/node_modules/<package-name>
```

#### **Dev Server Não Inicia**

```bash
# Ver logs
docker logs utiliza-front-assistencia-app-1 -f

# Reiniciar container
docker restart utiliza-front-assistencia-app-1
```

#### **Porta 8080 Não Responde**

```bash
# Verificar se container está rodando
docker ps | grep front

# Verificar mapeamento de portas
docker port utiliza-front-assistencia-app-1
# Esperado: 8080/tcp -> 0.0.0.0:8080
```

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

**Comportamento ao Alternar:**
- **Ao desmutar (isMuted: true → false):**
  - Se houver chamados atrasados (`summary.delayed > 0`), o áudio toca automaticamente
  - O áudio é interrompido após exatamente 2.5 segundos usando `setTimeout`
  - Previne reprodução infinita do alerta
- **Ao mutar (isMuted: false → true):**
  - Para o áudio imediatamente se estiver tocando
  - Define volume para 0

**Correção de Bug:**
- **Problema anterior:** Ao clicar no botão de desmutar, o áudio tocava infinitamente
- **Solução:** Adicionado `setTimeout(2500)` na função `toggleMute` para pausar o áudio após 2.5 segundos
- **Resultado:** Tanto alertas automáticos quanto reprodução manual via botão respeitam a duração de 2.5 segundos

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


---

## 🔌 WebSocket - Atualização em Tempo Real

### **Visão Geral**

A aplicação utiliza WebSocket (Socket.IO) para receber eventos em tempo real da API, mantendo os dados sempre atualizados sem necessidade de recarregar a página.

### **Arquitetura**

```
[API Utiliza - Laravel] → Observer detecta mudanças no banco
                ↓
        Emite eventos via WebSocket
                ↓
[Frontend React] → Hook useWebSocket escuta eventos
                ↓
        Atualiza interface automaticamente
```

### **Configuração**

#### **1. Dependência Instalada**
```bash
npm install socket.io-client
```

#### **2. Hook Customizado: `useWebSocket`**

Localização: `src/hooks/useWebSocket.ts`

**Funcionalidades:**
- Conecta automaticamente ao servidor WebSocket
- Reconecta automaticamente em caso de desconexão
- Escuta eventos específicos (`associate_service:created`, `associate_service:updated`)
- Permite callbacks para processar eventos

**Parâmetros:**
```typescript
interface UseWebSocketOptions {
  onAssociateServiceCreated?: (data: AssociateService) => void;
  onAssociateServiceUpdated?: (data: AssociateService) => void;
  enabled?: boolean;
}
```

**Retorno:**
```typescript
{
  isConnected: boolean,  // Estado da conexão
  socket: Socket | null  // Instância do socket
}
```

### **Eventos Escutados**

#### **1. `associate_service:created`**
Disparado quando um novo atendimento é criado no banco de dados.

**Payload:**
```typescript
{
  timestamp: string,
  event: "associate_service:created",
  data: AssociateService
}
```

**Ação:** Recarrega a lista de atendimentos na tela principal.

#### **2. `associate_service:updated`**
Disparado quando um atendimento existente é atualizado.

**Payload:**
```typescript
{
  timestamp: string,
  event: "associate_service:updated",
  data: AssociateService
}
```

**Ação:** 
- Recarrega a lista de atendimentos
- Se o ChatModal estiver aberto para esse atendimento, atualiza as mensagens

### **Integração nas Telas**

#### **Tela de Atendimentos** (`src/pages/Atendimentos.tsx`)

```typescript
const { isConnected } = useWebSocket({
  onAssociateServiceCreated: (newAtendimento) => {
    console.log('🆕 Novo atendimento criado, recarregando lista...');
    reloadAtendimentos();
  },
  onAssociateServiceUpdated: (updatedAtendimento) => {
    console.log('📝 Atendimento atualizado, recarregando lista...');
    reloadAtendimentos();
  },
  enabled: true,
});
```

**Indicador Visual:**
- Mostra status da conexão WebSocket (verde = conectado, cinza = desconectado)
- Animação de pulso quando conectado

#### **ChatModal** (`src/components/atendimentos/ChatModal.tsx`)

```typescript
useWebSocket({
  onAssociateServiceUpdated: (updatedAtendimento) => {
    // Só atualiza se for o atendimento que está sendo visualizado
    if (open && atendimento && updatedAtendimento.id === atendimento.id) {
      console.log('📝 Atendimento do modal atualizado via WebSocket');
      updateAtendimento();
    }
  },
  enabled: open, // Só conecta quando o modal está aberto
});
```

**Comportamento:**
- Conexão ativada apenas quando o modal está aberto
- Atualiza mensagens em tempo real quando o atendimento é modificado
- Combina polling (5s) + WebSocket para máxima confiabilidade

### **Configuração do Servidor**

**URL do WebSocket:**
Definida na variável de ambiente `VITE_API_URL` (padrão: `http://localhost:3001`)

**Opções de Transporte:**
```typescript
{
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
}
```

### **Logs do Console**

**Conexão bem-sucedida:**
```
🔌 Conectando ao WebSocket em http://localhost:3001
✅ Conectado ao WebSocket. ID: abc123def
```

**Evento recebido:**
```
📥 NOVO ATENDIMENTO RECEBIDO VIA WEBSOCKET!
═══════════════════════════════════════
Timestamp: 2026-02-05T18:00:00.123Z
ID do Atendimento: 2903
Status: waiting_identification
Associação: solidy
Telefone: 11987654321
═══════════════════════════════════════
```

**Erro de conexão:**
```
❌ Erro de conexão WebSocket: Connection refused
🔄 Tentando reconectar... (tentativa 1)
```

### **Benefícios**

✅ **Atualização Instantânea:** Novos atendimentos aparecem automaticamente sem recarregar  
✅ **Escalabilidade:** Suporta múltiplas conexões simultâneas  
✅ **Resiliência:** Reconexão automática em caso de falha  
✅ **Performance:** Reduz carga no servidor (menos requisições HTTP)  
✅ **UX Aprimorada:** Interface sempre sincronizada com o banco de dados

### **Fallback (Redundância)**

Mesmo com WebSocket ativo, o ChatModal mantém:
- **Polling de 5 segundos:** Garante atualização mesmo se WebSocket falhar
- **Dupla camada de confiabilidade:** WebSocket (instantâneo) + Polling (backup)

### **Troubleshooting**

**WebSocket não conecta:**
1. Verificar se a API está rodando em `http://localhost:3001`
2. Verificar se o servidor Socket.IO está configurado corretamente
3. Verificar configuração de CORS no backend

**Eventos não são recebidos:**
1. Verificar se o Observer está ativo no Laravel
2. Verificar logs do servidor para confirmar emissão de eventos
3. Verificar se os nomes dos eventos estão corretos (`associate_service:created`, `associate_service:updated`)

**Reconexões frequentes:**
1. Verificar estabilidade da rede
2. Aumentar `reconnectionDelay` se necessário
3. Verificar timeout do servidor WebSocket


---

## 🔄 Atualização: ChatModal com WebSocket em Tempo Real

### **Mudanças Implementadas**

#### **1. Remoção do Polling**
- ❌ Removido polling de 5 segundos do ChatModal
- ✅ Substituído por WebSocket para atualizações em tempo real
- 📊 Redução significativa de requisições HTTP ao servidor

#### **2. Escuta WebSocket Ativa**
Quando o usuário clica em "Ver Mensagem" na listagem de atendimentos:

```typescript
// Carregamento inicial ao abrir
useEffect(() => {
  if (open && atendimento) {
    console.log(`🔍 Carregando conversa do atendimento #${atendimento.id}...`);
    updateAtendimento();
  }
}, [open, atendimento, updateAtendimento]);

// WebSocket ativo apenas quando modal está aberto
const { isConnected } = useWebSocket({
  onAssociateServiceUpdated: (updatedAtendimento) => {
    if (open && atendimento && updatedAtendimento.id === atendimento.id) {
      console.log(`📝 Conversa atualizada via WebSocket - Atendimento #${atendimento.id}`);
      updateAtendimento();
    }
  },
  enabled: open, // Conexão ativa SOMENTE quando modal aberto
});
```

#### **3. Indicador Visual "Ao Vivo"**
- Badge no header do modal mostrando status da conexão
- **Verde com pulso**: WebSocket conectado, escutando atualizações em tempo real
- **Cinza**: Offline ou desconectado

### **Fluxo de Funcionamento**

```
1. Usuário clica em "Ver Mensagem"
        ↓
2. Modal abre e carrega conversa atual
        ↓
3. WebSocket conecta e começa a escutar
        ↓
4. API atualiza o atendimento (novo status, nova mensagem no service_form)
        ↓
5. WebSocket emite evento "associate_service:updated"
        ↓
6. ChatModal recebe evento e verifica se é o atendimento correto
        ↓
7. Busca dados atualizados via API
        ↓
8. Atualiza mensagens na tela INSTANTANEAMENTE
```

### **Logs no Console**

**Ao abrir o modal:**
```
🔍 Carregando conversa do atendimento #2903...
🔌 Conectando ao WebSocket em http://localhost:3001
✅ Conectado ao WebSocket. ID: xyz789
```

**Ao receber atualização:**
```
📝 Conversa atualizada via WebSocket - Atendimento #2903
🔄 Atualizando histórico de mensagens...
```

**Ao fechar o modal:**
```
👋 Desconectando WebSocket...
```

### **Benefícios**

✅ **Atualização Instantânea:** Histórico de conversa atualiza em milissegundos  
✅ **Eficiência:** Sem requisições desnecessárias (eliminou polling)  
✅ **Escalável:** Suporta múltiplos usuários visualizando diferentes atendimentos  
✅ **Feedback Visual:** Usuário sabe que está "ao vivo"  
✅ **Economia de Recursos:** ~92% menos requisições (1 inicial vs 12 por minuto com polling)

### **Comportamento Específico**

- WebSocket conecta **apenas** quando o modal está aberto
- Desconecta automaticamente ao fechar o modal
- Atualiza **apenas** se o evento for do atendimento sendo visualizado
- Mantém histórico completo sem reiniciar animações

### **Comparação: Antes vs Depois**

| Aspecto | Antes (Polling) | Depois (WebSocket) |
|---------|----------------|-------------------|
| Requisições/min | ~12 (a cada 5s) | 1 (ao abrir) |
| Latência atualização | Até 5 segundos | < 100ms |
| Carga no servidor | Alta | Mínima |
| Experiência do usuário | Boa | Excelente |
| Feedback visual | Nenhum | Badge "Ao vivo" |


---

## 💬 ChatModal - Sistema de Mensagens e Animação

### **Visão Geral**

O ChatModal exibe a conversa entre a IA e o associado de forma animada, simulando uma experiência de chat em tempo real. As mensagens são geradas dinamicamente com base nos dados do atendimento e aparecem progressivamente com indicador de "digitando".

Localização: `src/components/atendimentos/ChatModal.tsx`

### **Fluxo de Conversação**

A conversa segue uma sequência estruturada baseada nos dados disponíveis:

#### **1. Saudação Inicial (Sempre)**
```
IA: "Olá! Sou a assistente virtual da Utiliza. Como posso ajudá-lo hoje?"
```

#### **2. Solicitação da Placa (Sempre)**
```
IA: "Então DIGITE SOMENTE A PLACA do veículo para darmos continuidade ao atendimento. 👇🏼"
Usuário: [placa do veículo] (de associate_cars.plate)
```

#### **3. Motivo do Contato (Se request_reason preenchido)**
```
IA: "Qual o motivo do contato?"
Usuário: [motivo traduzido] (de request_reason usando reasonLabels)
IA: "Entendido. Preciso fazer algumas perguntas para direcionar melhor o atendimento."
```

**Condição:** `if (atendimento.request_reason)`

**Exemplo:**
```
IA: "Qual o motivo do contato?"
Usuário: "Pneu Furado"  (flat_tire → traduzido)
IA: "Entendido. Preciso fazer algumas perguntas para direcionar melhor o atendimento."
```

#### **4. Questionário - service_form (Se preenchido)**
Para cada campo preenchido no service_form:
```
IA: [Pergunta do serviceFormLabels]
Usuário: [Resposta do campo]
```

Exemplo:
```
IA: "Possui carga ou peso? → Se sim, qual tipo e quantidade?"
Usuário: "Sim, ferramentas"
IA: "O que aconteceu com o veículo (descreva o que está ocorrendo)?"
Usuário: "Motor não liga"
```

#### **5. Localização de Origem (Se origin_address preenchido)**
```
IA: "Por gentileza, me envie sua localização atual"
Usuário: [Endereço de origem]
```

#### **6. Localização de Destino (Se destination_address preenchido)**
```
IA: "Agora me envie a localização de destino"
Usuário: [Endereço de destino]
```

#### **7. Mensagem Final (Se status = finished ou transferred)**
```
IA: "Perfeito! Seu chamado foi registrado com sucesso. Um prestador será acionado em breve. Obrigado por utilizar nossos serviços!"
```

**Condição:** `if (atendimento.status === "finished" || atendimento.status === "transferred")`

**Código:**
```typescript
// Mensagem final baseada no status
if (atendimento.status === "finished" || atendimento.status === "transferred") {
  messages.push({
    id: String(msgId++),
    role: "ai",
    content: "Perfeito! Seu chamado foi registrado com sucesso. Um prestador será acionado em breve. Obrigado por utilizar nossos serviços!",
    timestamp: new Date(baseTime.getTime() + timeOffset),
  });
}
```

**Status que exibem a mensagem:**
- ✅ `"finished"` - Atendimento finalizado
- ✅ `"transferred"` - Atendimento transferido para operadora

### **Mapeamentos de Labels**

#### **Tipos de Motivo (request_reason)**
```typescript
const reasonLabels: Record<string, string> = {
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
```

#### **Perguntas do Questionário (serviceFormLabels)**
```typescript
const serviceFormLabels: Record<string, string> = {
  vehicle_is_at_collision_scene: "O veículo está no local da colisão?",
  vehicle_is_moving: "O veículo está circulando (consegue se mover)?",
  is_to_activate_protection: "Deseja acionar a proteção para sinistro?",
  any_wheel_is_locked: "Alguma roda do veículo está travada?",
  vehicle_is_lowered: "Veículo possui alguma dessas características: baixo, rebaixado?",
  vehicle_is_easily_accessible: "Acesso fácil para remoção (o guincho consegue chegar ao local com facilidade)?",
  vehicle_cargo: "Possui carga ou peso? → Se sim, qual tipo e quantidade?",
  number_of_passengers: "Quantos passageiros possui?",
  associate_items: "Existem objetos no veículo? → Se sim, quais itens?",
  documents_and_key_are_in_scene: "Documentos e chaves estão no local?",
  uber_will_be_necessary: "Vai precisar de táxi/Uber?",
  vehicle_symptom: "O que aconteceu com o veículo (descreva o que está ocorrendo)?",
  fuel_request: "Combustível desejado:",
  fuel_price: "Valor de combustível a ser entregue",
  fuel_payment_type: "Forma de pagamento:",
  tire_change_quantity: "Quantos pneus precisam ser trocados?",
  tire_change_associate_has_tools: "Possui ferramenta pra troca?",
  tire_change_associate_has_spare_tire: "Possui estepe?",
  battery_charge_resolution: "Apenas a recarga de bateria já resolveria?",
  locksmith_key_is_inside_vehicle: "A chave está dentro do veículo?",
  locksmith_all_doors_locked: "O veículo está com todas as portas trancadas?",
  accessible_vehicle: "O veículo está de fácil acesso?",
};
```

### **Processamento do service_form**

O sistema suporta dois formatos de service_form:

#### **Formato 1: Objeto Aninhado (com payload)**
```json
{
  "payload": {
    "vehicle_cargo": "Sim, ferramentas",
    "vehicle_symptom": "Motor não liga",
    "any_wheel_is_locked": "Não"
  },
  "flow_token": "abc123"
}
```

#### **Formato 2: Objeto Plano**
```json
{
  "vehicle_cargo": "Sim, ferramentas",
  "vehicle_symptom": "Motor não liga",
  "any_wheel_is_locked": "Não",
  "flow_token": "abc123"
}
```

Ambos os formatos são processados corretamente. O campo `flow_token` é ignorado na exibição.

### **Sistema de Animação**

#### **Delays entre Mensagens**
- **Todas as mensagens**: 1 segundo de intervalo
- **Carregamento inicial**: Começa do zero com animação
- **Mensagens novas (WebSocket)**: Adiciona apenas as novas com animação

#### **Indicador de "Digitando"**

Aparece antes de cada mensagem durante o período de delay, mostrando:
- **Avatar da IA** (bot icon) ou **Avatar do Usuário** (user icon)
- **5 barras animadas** simulando ondas sonoras
- **Posicionamento**: À esquerda (IA) ou à direita (Usuário)

```typescript
// Durante o delay de 1 segundo antes de cada mensagem
<div className="flex items-center gap-2">
  {isAI ? <Bot icon /> : <User icon />}
  <div className="px-4 py-3 rounded-2xl">
    <div className="flex items-center gap-[3px] h-5">
      {[...Array(5)].map((_, i) => (
        <span className="w-[3px] rounded-full animate-sound-wave"
              style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </div>
  </div>
  {!isAI && <User icon />}
</div>
```

#### **Fluxo de Animação**

**Carregamento Inicial (isInitialLoad = true):**
```
1. Modal abre
2. Busca dados do atendimento
3. Gera array de mensagens
4. displayedMessages = []
5. Para cada mensagem:
   a. Mostra indicador de digitando (1s)
   b. Adiciona mensagem ao displayedMessages
   c. Próxima mensagem
6. isInitialLoad = false
```

**Mensagens Novas via WebSocket (isInitialLoad = false):**
```
1. WebSocket recebe evento "associate_service:updated"
2. Busca dados atualizados
3. Gera novo array de mensagens (maior que o anterior)
4. Detecta diferença: messages.length > displayedMessages.length
5. Para cada mensagem nova:
   a. Mostra indicador de digitando (1s)
   b. Adiciona mensagem ao displayedMessages
   c. Próxima mensagem nova
```

### **Integração com WebSocket**

Quando o modal está aberto e recebe atualizações:

```typescript
const handleAssociateServiceUpdated = useCallback((updatedAtendimento) => {
  if (open && atendimento && updatedAtendimento.id === atendimento.id) {
    console.log(`📝 Conversa atualizada via WebSocket - Atendimento #${atendimento.id}`);
    updateAtendimento(); // Busca dados atualizados e regenera mensagens
  }
}, [open, atendimento, updateAtendimento]);

useWebSocket({
  onAssociateServiceUpdated: handleAssociateServiceUpdated,
  enabled: open, // Só conecta quando modal está aberto
});
```

**Comportamento:**
- ✅ Novas mensagens aparecem com animação de 1 segundo
- ✅ Mensagens antigas permanecem visíveis
- ✅ Indicador de "digitando" aparece antes de cada nova mensagem
- ✅ Auto-scroll para a última mensagem
- ✅ Não reinicia a conversa do zero

### **Exemplo de Conversa Completa**

```
[21:00] IA: Olá! Sou a assistente virtual da Utiliza. Como posso ajudá-lo hoje?
[21:00] IA: Então DIGITE SOMENTE A PLACA do veículo para darmos continuidade ao atendimento. 👇🏼
[21:00] Usuário: PRN8I07
[21:00] Usuário: Preciso de assistência
[21:00] IA: Entendi! Para dar continuidade ao atendimento, preciso confirmar alguns dados. Qual o CPF do titular?
[21:01] Usuário: 123.456.789-00
[21:01] IA: Perfeito! Encontrei seu cadastro, João Silva. Motivo da Solicitação?
[21:01] Usuário: Pane Mecânica ou Elétrica
[21:01] IA: Entendido. Preciso fazer algumas perguntas para direcionar melhor o atendimento.
[21:01] IA: Possui carga ou peso? → Se sim, qual tipo e quantidade?
[21:01] Usuário: Sim, ferramentas
[21:02] IA: O que aconteceu com o veículo (descreva o que está ocorrendo)?
[21:02] Usuário: Motor não liga
[21:02] IA: Alguma roda do veículo está travada?
[21:02] Usuário: Não
[21:02] IA: Por gentileza, me envie sua localização atual
[21:03] Usuário: Rua das Flores, 123 - São Paulo, SP
[21:03] IA: Agora me envie a localização de destino
[21:03] Usuário: Avenida Paulista, 1000 - São Paulo, SP
[21:03] IA: Perfeito! Seu chamado foi registrado com sucesso. Um prestador será acionado em breve. Obrigado por utilizar nossos serviços!
```

### **Logs de Debug**

**Geração de Mensagens:**
```
🔍 DEBUG - service_form RAW: { vehicle_cargo: "Sim, ferramentas", ... }
📦 service_form formato plano: { vehicle_cargo: "Sim, ferramentas", ... }
✅ serviceFormPayload final: { vehicle_cargo: "Sim, ferramentas", ... }
📝 Processando 3 campos do service_form
  - Campo: vehicle_cargo = Sim, ferramentas
  - Campo: vehicle_symptom = Motor não liga
  - Campo: any_wheel_is_locked = Não
📊 Total de mensagens geradas: 15
```

**Animação:**
```
🎬 Efeito de exibição - open: true, messages: 15, isInitialLoad: true, displayed: 0
▶️ Iniciando animação inicial de 15 mensagens
  📨 Exibindo mensagem 1/15: [ai] Olá! Sou a assistente virtual da Utiliza...
  📨 Exibindo mensagem 2/15: [ai] Então DIGITE SOMENTE A PLACA do veículo...
  📨 Exibindo mensagem 3/15: [user] PRN8I07
  ...
✅ Animação inicial completa
```

**WebSocket - Novas Mensagens:**
```
📝 Conversa atualizada via WebSocket - Atendimento #2903
🔄 Atualizando histórico de mensagens...
🔢 Gerando 17 novas mensagens
➕ Animando 2 novas mensagens via WebSocket
  📨 Exibindo nova mensagem 16/17: [ai] Agora me envie a localização de destino
  📨 Exibindo nova mensagem 17/17: [user] Avenida Paulista, 1000...
✅ Novas mensagens exibidas
```

### **Performance e Otimizações**

✅ **useCallback**: Callbacks estáveis evitam reconexões desnecessárias do WebSocket
✅ **useRef**: Armazena callbacks sem causar re-renders
✅ **useEffect com dependências mínimas**: Evita loops infinitos de animação
✅ **Cancelamento de animações**: Cleanup adequado ao desmontar componente
✅ **Auto-scroll inteligente**: Scroll suave para última mensagem
✅ **Animação progressiva**: Apenas novas mensagens são animadas, não toda a conversa

### **Troubleshooting**

**Mensagens aparecem todas de uma vez:**
- Verificar se os delays estão configurados (1000ms)
- Verificar logs do console para ver se a animação está sendo executada

**Indicador de digitando não aparece:**
- Verificar se `displayedMessages.length < messages.length`
- Verificar se o delay inicial está correto (1000ms)

**Animação reinicia do zero ao receber WebSocket:**
- Verificar se `isInitialLoad` está sendo setado para `false` após primeira animação
- Verificar se o código está detectando corretamente mensagens novas

**Mensagens duplicadas:**
- Verificar se há múltiplas instâncias do ChatModal renderizando
- Verificar logs para confirmar quantas mensagens estão sendo geradas


---

## 🔄 Transferência de Chamados e Vinculação de Atendentes

### **Visão Geral**

O sistema permite transferir chamados entre atendentes e vincula automaticamente o usuário logado ao criar um novo chamado.

Localização:
- `src/pages/Chamados.tsx` - Listagem com coluna de atendente e menu de transferência
- `src/components/chamados/TransferCallModal.tsx` - Modal de transferência
- `src/components/chamados/chamadoFormModal.tsx` - Modal de criação com vinculação automática
- `src/services/calls.service.ts` - Métodos de API

### **Funcionalidades**

#### **1. Vinculação Automática ao Criar Chamado**

Quando um usuário logado cria um novo chamado, o sistema automaticamente vincula o atendente:

```typescript
// Pega o usuário logado do localStorage
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

const payload = {
  associate_car_id: parseInt(data.associate_vehicle_id),
  address: data.address,
  association: data.association,
  towing_service_type: data.towing_service_type,
  // ... outros campos
  user_id: user?.id ? parseInt(user.id) : undefined,
};

await callsService.createTowingCall(payload);
```

**Fluxo:**
1. Usuário faz login → `user` com `id` salvo no localStorage
2. Usuário clica em "Novo Chamado"
3. Preenche o formulário e cria o chamado
4. Sistema pega automaticamente o `user_id` do localStorage
5. API vincula o chamado ao atendente
6. Chamado aparece na listagem com o atendente vinculado

#### **2. Coluna de Atendente na Listagem**

A tabela de chamados exibe o atendente vinculado a cada chamado:

```tsx
<TableCell>
  <div className="flex items-center gap-2">
    {chamado.users ? (
      <>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">
            {chamado.users.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-sm">{chamado.users.name}</p>
          <p className="text-xs text-muted-foreground">{chamado.users.email}</p>
        </div>
      </>
    ) : (
      <span className="text-sm text-muted-foreground">Não atribuído</span>
    )}
  </div>
</TableCell>
```

**Elementos:**
- Avatar circular com iniciais do atendente
- Nome do atendente
- Email do atendente
- "Não atribuído" quando não há atendente vinculado

#### **3. Transferência de Chamados**

Permite transferir um chamado de um atendente para outro através do menu de ações:

**Menu de Ações (3 pontinhos):**
```tsx
<DropdownMenuItem
  className="cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    setSelectedCallForTransfer(chamado);
    setIsTransferModalOpen(true);
  }}
>
  <ArrowRightLeft className="h-4 w-4 mr-2" />
  Transferir Atendente
</DropdownMenuItem>
```

**Modal de Transferência:**
- Exibe informações do chamado (ID, associado, atendente atual)
- Busca de usuários com debounce (500ms)
- Mínimo 2 caracteres para iniciar busca
- Lista de usuários com avatar, nome e email
- Seleção de usuário desejado
- Confirmação da transferência

### **Endpoints Utilizados**

#### **Listar Usuários**
```
GET /api/users?limit=50&search=nome_ou_email
```

**Parâmetros:**
- `limit` (number): Quantidade máxima de resultados (padrão: 50)
- `search` (string): Busca por nome ou email (mínimo 2 caracteres)

**Resposta:**
```json
{
  "data": [
    {
      "id": "131",
      "name": "Barbara Terianne Couto",
      "email": "barbara.terianne.c@gmail.com",
      "email_verified_at": null,
      "created_at": "2025-11-14T15:59:53.000Z",
      "updated_at": "2025-12-16T08:46:54.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "current_page": 1,
    "per_page": 50,
    "last_page": 1,
    "from": 1,
    "to": 1
  }
}
```

#### **Transferir Chamado**
```
PATCH /api/calls/guinchos/{id}/transfer
```

**Body:**
```json
{
  "user_id": 136
}
```

**Resposta:**
- Status 200 OK (sem body necessário)
- O microserviço atualiza o chamado automaticamente

#### **Criar Chamado**
```
POST /api/calls/guinchos
```

**Body (campos adicionados):**
```json
{
  "associate_car_id": 123,
  "address": "Rua exemplo, 123",
  "association": "solidy",
  "towing_service_type": "towing_light",
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "uf_id": 1,
  "city_id": 1,
  "user_id": 136  // ← Atendente vinculado automaticamente
}
```

### **Interfaces TypeScript**

#### **User (Atendente)**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  data: User[];
  pagination: Pagination;
}
```

#### **LoginUser (Usuário Logado)**
```typescript
export interface LoginUser {
  id: string;        // ID do usuário logado
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user?: LoginUser;  // Retornado no login
  token: string;
}
```

#### **CreateTowingCallPayload**
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
  user_id?: number;  // ← Atendente vinculado
  destination?: {
    address?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}
```

### **Métodos do Serviço**

#### **callsService.getUsers()**
```typescript
/**
 * GET /api/users
 * Lista todos os usuários/atendentes com busca
 */
getUsers: async (search?: string, limit: number = 50): Promise<UsersResponse> => {
  const params: Record<string, string | number> = { limit };
  if (search && search.trim()) {
    params.search = search.trim();
  }
  const { data } = await api.get<UsersResponse>('/api/users', { params });
  return data;
}
```

#### **callsService.transferCall()**
```typescript
/**
 * PATCH /api/calls/guinchos/:id/transfer
 * Transfere um chamado para outro usuário/atendente
 */
transferCall: async (callId: string, userId: string): Promise<void> => {
  await api.patch(`/api/calls/guinchos/${callId}/transfer`, {
    user_id: parseInt(userId),
  });
}
```

### **Fluxo Completo de Transferência**

```
1. Usuário vê a lista de chamados com coluna "Atendente"
        ↓
2. Clica nos 3 pontinhos do chamado desejado
        ↓
3. Seleciona "Transferir Atendente"
        ↓
4. Modal abre com informações do chamado
        ↓
5. Usuário digita nome ou email (mínimo 2 caracteres)
        ↓
6. Sistema busca usuários na API após 500ms (debounce)
        ↓
7. Usuário seleciona o novo atendente
        ↓
8. Clica em "Transferir Chamado"
        ↓
9. PATCH /api/calls/guinchos/{id}/transfer { user_id: 136 }
        ↓
10. Modal fecha e lista de chamados recarrega
        ↓
11. Chamado aparece com o novo atendente vinculado ✅
```

### **Comportamento de Busca (TransferCallModal)**

#### **Debounce de 500ms**
```typescript
useEffect(() => {
  if (!searchQuery || searchQuery.trim().length < 2) {
    setUsers([]);
    return;
  }

  setIsLoadingUsers(true);

  const timer = setTimeout(async () => {
    try {
      const response = await callsService.getUsers(searchQuery.trim(), 50);
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar usuários",
        description: "Tente novamente.",
      });
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchQuery]);
```

#### **Mensagens Dinâmicas**
- `searchQuery.length < 2`: "Digite pelo menos 2 caracteres para buscar"
- `isLoadingUsers`: "Buscando..."
- `users.length === 0`: "Nenhum usuário encontrado."

### **localStorage**

#### **Estrutura do Usuário Logado**
```javascript
// Salvo no login
localStorage.setItem("token", response.token);
localStorage.setItem("user", JSON.stringify(response.user));

// Estrutura
{
  "id": "136",
  "name": "Guilherme Dev",
  "email": "guilhermedacatia132@gmail.com"
}

// Recuperado na criação de chamado
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
const userId = user?.id ? parseInt(user.id) : undefined;
```

### **Requisitos do Backend**

#### **Endpoint de Login**
O endpoint `/api/login` **DEVE** retornar o `id` do usuário:

```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "136",        // ← OBRIGATÓRIO
    "name": "Guilherme Dev",
    "email": "guilhermedacatia132@gmail.com"
  }
}
```

#### **Endpoint de Listagem de Chamados**
O endpoint `/api/calls/guinchos` **DEVE** retornar o campo `users`:

```json
{
  "id": "43016",
  "towing_service_type": "towing_light",
  "user_id": "136",
  // ... outros campos
  "users": {
    "id": "136",
    "name": "Guilherme Dev",
    "email": "guilhermedacatia132@gmail.com"
  }
}
```

### **Tratamento de Erros**

#### **Transferência de Chamado**
```typescript
try {
  await callsService.transferCall(call.id, selectedUser.id);
  
  toast({
    title: "Chamado transferido com sucesso!",
    description: `Chamado #CH-${call.id} foi transferido para ${selectedUser.name}.`,
  });
  
  onOpenChange(false);
  onSuccess?.(); // Recarrega a lista
} catch (error: any) {
  console.error("Erro ao transferir chamado:", error);
  toast({
    variant: "destructive",
    title: "Erro ao transferir chamado",
    description: error?.response?.data?.message || "Tente novamente mais tarde.",
  });
}
```

#### **Busca de Usuários**
```typescript
try {
  const response = await callsService.getUsers(searchQuery.trim(), 50);
  setUsers(response.data);
} catch (error) {
  console.error("Erro ao buscar usuários:", error);
  toast({
    variant: "destructive",
    title: "Erro ao buscar usuários",
    description: "Tente novamente.",
  });
  setUsers([]);
}
```

### **Troubleshooting**

**Atendente não aparece na listagem:**
- Verificar se o endpoint `/api/calls/guinchos` retorna o campo `users`
- Verificar se o `user_id` está preenchido no chamado
- Verificar se a API faz JOIN com a tabela `users`

**Erro ao transferir chamado:**
- Verificar se o endpoint `/api/calls/guinchos/{id}/transfer` existe
- Verificar se o método HTTP é PATCH (não POST)
- Verificar se o `user_id` está sendo enviado corretamente no body

**user_id não é enviado ao criar chamado:**
- Verificar se o login retorna o campo `id` do usuário
- Verificar se o `user` está salvo no localStorage
- Verificar console.log do `user` antes de criar o chamado
- Verificar se o `user.id` está sendo convertido para int

**Busca de usuários não funciona:**
- Verificar se o endpoint `/api/users` existe
- Verificar se o parâmetro `search` está sendo aceito
- Verificar se a busca retorna resultados com mínimo 2 caracteres
- Verificar logs do console para ver requisições e respostas

**"Não atribuído" mesmo após criar chamado:**
- Verificar se o backend está salvando o `user_id` corretamente
- Verificar se o JOIN com `users` está funcionando na listagem
- Fazer um GET manual para verificar se o `user_id` está no banco


### **Condições de Exibição das Mensagens**

O ChatModal usa condições específicas para determinar quais mensagens exibir:

#### **Mensagem SEMPRE exibida:**
```typescript
// 1. Saudação inicial
messages.push({
  role: "ai",
  content: "Olá! Sou a assistente virtual da Utiliza. Como posso ajudá-lo hoje?",
});

// 2. Solicitação da placa
messages.push({
  role: "ai",
  content: "Então DIGITE SOMENTE A PLACA do veículo para darmos continuidade ao atendimento. 👇🏼",
});
```

#### **Mensagem CONDICIONAL (Se placa existir):**
```typescript
if (atendimento.associate_cars?.plate) {
  messages.push({
    role: "user",
    content: atendimento.associate_cars.plate,
  });
}
```

#### **Mensagem CONDICIONAL (Se request_reason existir):**
```typescript
if (atendimento.request_reason) {
  // Pergunta
  messages.push({
    role: "ai",
    content: "Qual o motivo do contato?",
  });
  
  // Resposta traduzida
  messages.push({
    role: "user",
    content: reasonLabels[atendimento.request_reason] || atendimento.request_reason,
  });
  
  // Confirmação
  messages.push({
    role: "ai",
    content: "Entendido. Preciso fazer algumas perguntas para direcionar melhor o atendimento.",
  });
}
```

#### **Mensagem CONDICIONAL (Para cada campo do service_form):**
```typescript
if (serviceFormPayload) {
  Object.entries(serviceFormPayload).forEach(([key, value]) => {
    if (value && value !== "" && value !== "null") {
      // Pergunta
      messages.push({
        role: "ai",
        content: serviceFormLabels[key] || key.replace(/_/g, " "),
      });
      
      // Resposta
      messages.push({
        role: "user",
        content: String(value),
      });
    }
  });
}
```

#### **Mensagem CONDICIONAL (Se origin_address existir):**
```typescript
if (atendimento.origin_address) {
  messages.push({
    role: "ai",
    content: "Por gentileza, me envie sua localização atual",
  });
  
  messages.push({
    role: "user",
    content: atendimento.origin_address,
  });
}
```

#### **Mensagem CONDICIONAL (Se destination_address existir):**
```typescript
if (atendimento.destination_address) {
  messages.push({
    role: "ai",
    content: "Agora me envie a localização de destino",
  });
  
  messages.push({
    role: "user",
    content: atendimento.destination_address,
  });
}
```

#### **Mensagem CONDICIONAL (Se status for finished ou transferred):**
```typescript
if (atendimento.status === "finished" || atendimento.status === "transferred") {
  messages.push({
    role: "ai",
    content: "Perfeito! Seu chamado foi registrado com sucesso. Um prestador será acionado em breve. Obrigado por utilizar nossos serviços!",
  });
}
```

### **Tabela Resumo de Condições**

| Mensagem | Condição | Campo Verificado | Sempre Exibe? |
|----------|----------|------------------|---------------|
| Saudação inicial | - | - | ✅ Sim |
| Solicitação da placa | - | - | ✅ Sim |
| Resposta com placa | `if (associate_cars?.plate)` | `associate_cars.plate` | ❌ Não |
| Motivo do contato | `if (request_reason)` | `request_reason` | ❌ Não |
| Perguntas do service_form | `if (serviceFormPayload)` | `service_form` | ❌ Não |
| Localização de origem | `if (origin_address)` | `origin_address` | ❌ Não |
| Localização de destino | `if (destination_address)` | `destination_address` | ❌ Não |
| Mensagem final | `if (status === "finished" \|\| status === "transferred")` | `status` | ❌ Não |

### **Exemplo Completo de Atendimento**

**Dados do Atendimento:**
```json
{
  "id": "2901",
  "status": "finished",
  "request_reason": "flat_tire",
  "associate_cars": {
    "plate": "PRN8I07"
  },
  "service_form": {
    "vehicle_cargo": "Sim, ferramentas",
    "vehicle_symptom": "Motor não liga"
  },
  "origin_address": "Rua das Flores, 123",
  "destination_address": "Av. Paulista, 1000"
}
```

**Mensagens Geradas:**
```
1. [IA] Olá! Sou a assistente virtual da Utiliza. Como posso ajudá-lo hoje?
2. [IA] Então DIGITE SOMENTE A PLACA do veículo para darmos continuidade ao atendimento. 👇🏼
3. [Usuário] PRN8I07
4. [IA] Qual o motivo do contato?
5. [Usuário] Pneu Furado
6. [IA] Entendido. Preciso fazer algumas perguntas para direcionar melhor o atendimento.
7. [IA] Possui carga ou peso? → Se sim, qual tipo e quantidade?
8. [Usuário] Sim, ferramentas
9. [IA] O que aconteceu com o veículo (descreva o que está ocorrendo)?
10. [Usuário] Motor não liga
11. [IA] Por gentileza, me envie sua localização atual
12. [Usuário] Rua das Flores, 123
13. [IA] Agora me envie a localização de destino
14. [Usuário] Av. Paulista, 1000
15. [IA] Perfeito! Seu chamado foi registrado com sucesso. Um prestador será acionado em breve. Obrigado por utilizar nossos serviços!
```

**Total:** 15 mensagens geradas com base nos dados disponíveis.


### **Detalhamento Técnico da Vinculação Automática**

#### **Código Completo (ChamadoFormModal.tsx)**

```typescript
const onSubmit = async (data: ChamadoFormData) => {
  setIsSubmitting(true);
  try {
    // 1. Recupera o usuário logado do localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // 2. Monta o payload com TODOS os campos
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
      uf_id: 1, // TODO: Obter do endereço ou formulário
      city_id: 1, // TODO: Obter do endereço ou formulário
      user_id: user?.id ? parseInt(user.id) : undefined,  // ← Atendente vinculado
    };

    // 3. Adiciona destino se for serviço de reboque
    if (showDestination && data.destination?.location) {
      payload.destination = {
        address: data.destination.address,
        location: {
          latitude: data.destination.location.lat,
          longitude: data.destination.location.lng,
        },
      };
    }

    // 4. Envia para a API
    const createdCall = await callsService.createTowingCall(payload);

    // 5. Exibe mensagem de sucesso
    toast({
      title: "Chamado criado com sucesso!",
      description: `Chamado #${createdCall.id} foi registrado no sistema.`,
    });

    // 6. Fecha o modal e recarrega a lista
    reset();
    onOpenChange(false);
    onSuccess?.();
  } catch (error: any) {
    console.error(error);
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

#### **Endpoint de Criação de Chamado**

```
POST http://localhost:3001/api/calls/guinchos
Content-Type: application/json
```

#### **Exemplo de Payload Enviado**

**Sem destino (serviços não-reboque):**
```json
{
  "associate_car_id": 123,
  "address": "Rua das Flores, 123 - São Paulo/SP",
  "association": "solidy",
  "towing_service_type": "battery_charge_light",
  "observation": "Bateria completamente descarregada",
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633308
  },
  "uf_id": 1,
  "city_id": 1,
  "user_id": 136
}
```

**Com destino (serviços de reboque):**
```json
{
  "associate_car_id": 123,
  "address": "Rua das Flores, 123 - São Paulo/SP",
  "association": "solidy",
  "towing_service_type": "towing_light",
  "observation": "Veículo não liga",
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633308
  },
  "uf_id": 1,
  "city_id": 1,
  "user_id": 136,
  "destination": {
    "address": "Av. Paulista, 1000 - São Paulo/SP",
    "location": {
      "latitude": -23.561340,
      "longitude": -46.655960
    }
  }
}
```

#### **Validação do user_id**

```typescript
// Verifica se o usuário está logado e tem ID
user_id: user?.id ? parseInt(user.id) : undefined

// Possíveis valores:
// - parseInt(user.id) → Envia o ID do usuário (ex: 136)
// - undefined → Campo omitido do payload (não envia user_id)
```

#### **Fluxo Completo de Criação**

```
1. Usuário faz login
        ↓
2. localStorage.setItem('user', JSON.stringify({ id: "136", name: "...", email: "..." }))
        ↓
3. Usuário clica em "Novo Chamado"
        ↓
4. Preenche formulário (associado, veículo, endereço, tipo de serviço)
        ↓
5. Clica em "Criar Chamado"
        ↓
6. Frontend: localStorage.getItem('user') → { id: "136", ... }
        ↓
7. Frontend: Monta payload com user_id: 136
        ↓
8. Frontend: callsService.createTowingCall(payload)
        ↓
9. HTTP: POST /api/calls/guinchos { ..., user_id: 136 }
        ↓
10. Backend: Salva chamado com user_id = 136
        ↓
11. Backend: Retorna chamado criado com campo "users" preenchido
        ↓
12. Frontend: Exibe toast de sucesso
        ↓
13. Frontend: Fecha modal e recarrega lista
        ↓
14. Lista exibe o chamado com atendente vinculado ✅
```

#### **Comparação: Criar vs Transferir**

| Operação | Endpoint | Método | Body | Quando? |
|----------|----------|--------|------|---------|
| **Criar Chamado** | `/api/calls/guinchos` | POST | `{ ..., user_id: 136 }` | Ao criar novo chamado |
| **Transferir** | `/api/calls/guinchos/{id}/transfer` | PATCH | `{ user_id: 136 }` | Ao transferir chamado existente |

#### **Diferenças Importantes**

**Criação de Chamado:**
- Cria um **novo** registro no banco
- `user_id` é **opcional** (pode ser undefined)
- Se `user_id` não for enviado, chamado fica sem atendente ("Não atribuído")
- Envia **todos** os dados do chamado (endereço, veículo, tipo de serviço, etc.)

**Transferência:**
- Atualiza um registro **existente** no banco
- `user_id` é **obrigatório**
- Atualiza **apenas** o campo `user_id` do chamado
- Não altera outros dados (endereço, veículo, status, etc.)

#### **Tratamento de Erros**

**Usuário não logado:**
```typescript
const user = null; // localStorage vazio
const payload = {
  // ...
  user_id: undefined, // Campo omitido
};
// Chamado é criado SEM atendente vinculado
```

**ID inválido:**
```typescript
const user = { id: "abc" }; // ID não numérico
const payload = {
  // ...
  user_id: NaN, // parseInt("abc") = NaN
};
// Backend pode retornar erro 400 Bad Request
```

**Tratamento correto:**
```typescript
// Valida antes de enviar
user_id: user?.id && !isNaN(parseInt(user.id)) 
  ? parseInt(user.id) 
  : undefined
```

#### **Logs para Debug**

**Console do Frontend (ao criar chamado):**
```javascript
console.log('Usuário logado:', user);
// { id: "136", name: "Guilherme Dev", email: "..." }

console.log('Payload enviado:', payload);
// { associate_car_id: 123, ..., user_id: 136 }

console.log('Chamado criado:', createdCall);
// { id: "43016", user_id: "136", users: { id: "136", name: "..." }, ... }
```

**Console do Backend (ao receber requisição):**
```
POST /api/calls/guinchos
Body: { associate_car_id: 123, ..., user_id: 136 }
✅ Chamado criado com ID: 43016
✅ Atendente vinculado: 136 (Guilherme Dev)
```

#### **Testes Sugeridos**

**Teste 1: Criar chamado com usuário logado**
```bash
# 1. Fazer login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'
# Retorna: { token: "...", user: { id: "136", ... } }

# 2. Criar chamado (usar o user_id do login)
curl -X POST http://localhost:3001/api/calls/guinchos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{
    "associate_car_id": 123,
    "address": "Rua teste",
    "association": "solidy",
    "towing_service_type": "battery",
    "location": {"latitude": -23.5, "longitude": -46.6},
    "uf_id": 1,
    "city_id": 1,
    "user_id": 136
  }'

# 3. Verificar se o chamado foi vinculado
curl http://localhost:3001/api/calls/guinchos/{ID_RETORNADO}
# Verificar se "users": { "id": "136", ... } está presente
```

**Teste 2: Criar chamado sem user_id**
```bash
# Criar chamado sem user_id
curl -X POST http://localhost:3001/api/calls/guinchos \
  -H "Content-Type: application/json" \
  -d '{
    "associate_car_id": 123,
    "address": "Rua teste",
    "association": "solidy",
    "towing_service_type": "battery",
    "location": {"latitude": -23.5, "longitude": -46.6},
    "uf_id": 1,
    "city_id": 1
  }'
# user_id não enviado → Chamado sem atendente
```

**Teste 3: Verificar na listagem**
```bash
# Listar chamados
curl http://localhost:3001/api/calls/guinchos?page=1

# Verificar se o campo "users" está presente nos chamados com atendente
# e null nos chamados sem atendente
```

---

## **📊 Dashboard - Métricas e Estatísticas**

### **Visão Geral**

O dashboard (`/dashboard`) exibe métricas em tempo real sobre atendimentos e chamados de guincho. Suporta filtros de data e atualização automática a cada 30 segundos.

### **Resumo das Métricas (11 no total)**

| # | Métrica | Fonte | Descrição |
|---|---------|-------|-----------|
| 1 | Chamados Hoje | `calls` | Total de chamados de guincho no período |
| 2 | Em Andamento | `calls` | Chamados não finalizados |
| 3 | Finalizados | `calls` | Chamados concluídos |
| 4 | Atrasados | `calls` + cálculo de prazo | Chamados com prazo vencido |
| 5 | Tempo Médio Atendimento | `associate_services` | Duração média do atendimento |
| 6 | Tempo Médio Resposta | `associate_service_events` | Tempo médio de resposta |
| 7 | Taxa de Resolução | Calculado | % de chamados finalizados |
| 8 | Tempo Médio Execução | `calls` + histórico | Tempo médio de execução do guincho |
| 9 | Ticket Médio | `bills` | Valor médio dos boletos pagos |
| 10 | Despesa Total | `bills` | Soma dos boletos pagos |
| 11 | Média NPS | `ratings` | Avaliação média dos guinchos |
| 12 | Frequência Acionamento | Calculado | % de associados que acionaram |

### **Endpoint da API**

**URL:** `GET /api/dashboard`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcionais):**
| Parâmetro | Tipo | Formato | Descrição | Exemplo |
|-----------|------|---------|-----------|---------|
| `start_date` | string | YYYY-MM-DD | Data inicial do período | `2026-02-01` |
| `end_date` | string | YYYY-MM-DD | Data final do período | `2026-02-04` |

**Comportamento dos Filtros:**

1. **Sem filtros** → Retorna dados **apenas do dia atual** (hoje)
2. **Apenas `start_date`** → Retorna dados **apenas desse dia específico**
3. **Apenas `end_date`** → Retorna dados **apenas desse dia específico**
4. **Ambos `start_date` e `end_date`** → Retorna dados **do período entre as datas** (inclusivo)

**Timezone:** Todos os dados são convertidos para timezone do Brasil (UTC-3) automaticamente.

### **Estrutura da Resposta**

```typescript
interface DashboardData {
  attendancesToday: number;           // Total de chamados de guincho no período
  attendancesInProgress: number;      // Chamados em andamento (não finalizados)
  attendancesFinished: number;        // Chamados finalizados
  attendancesDelayed: number;         // Chamados atrasados (prazo vencido)
  averageServiceTime: string;         // Tempo médio de atendimento (ex: "1h 23min")
  averageTowingExecutionTime: string; // Tempo médio de execução de guincho (ex: "45min")
  averageNPS: string;                 // Média NPS - Avaliação dos guinchos (ex: "4.8/5.0")
  callFrequency: string;              // Frequência de acionamento (ex: "0.15%")
  quickStats: {
    averageResponseTime: string;      // Tempo médio de resposta (ex: "8min 30s")
    resolutionRate: string;           // Taxa de resolução (ex: "87.50%")
  };
  towingTicket: {
    averageTicket: string;            // Ticket médio (ex: "R$ 450.00")
    totalExpense: string;             // Despesa total (ex: "R$ 15.750,00")
  };
}
```

### **Métricas Calculadas**

#### **1. Chamados no Período (attendancesToday)**
- **Fonte:** Tabela `calls`
- **Condição:** `towing_status IS NOT NULL`
- **Filtro de data:** Campo `created_at` convertido para UTC-3
- **Descrição:** Conta todos os chamados de guincho criados no período filtrado

#### **2. Chamados em Andamento (attendancesInProgress)**
- **Fonte:** Tabela `calls`
- **Condição:** `towing_status IS NOT NULL AND towing_status != 'finished'`
- **Descrição:** Chamados ainda não finalizados no período

#### **3. Chamados Finalizados (attendancesFinished)**
- **Fonte:** Tabela `calls`
- **Condição:** `towing_status = 'finished'`
- **Descrição:** Chamados concluídos no período

#### **4. Chamados Atrasados (attendancesDelayed)**
- **Fonte:** Tabela `calls` + relações `call_service_requests` e `call_service_proposals`
- **Cálculo:**
  1. Busca chamados não finalizados (`towing_status NOT IN ['finished', 'cancelled']`)
  2. Pega `duration_between_trips_value` (tempo estimado de serviço)
  3. Pega `duration_between_towing_driver_and_call_location_value` (tempo de chegada do guincho)
  4. Soma os tempos e adiciona à data de criação (`created_at`)
  5. Compara com a data/hora atual
  6. Se data atual > prazo de conclusão → Considera atrasado

#### **5. Tempo Médio de Atendimento (averageServiceTime)**
- **Fonte:** Tabela `associate_services`
- **Condição:** `status = 'finished' AND updated_at IS NOT NULL`
- **Cálculo:** Média de `(updated_at - created_at)` dos atendimentos finalizados
- **Formato:** `"1h 23min"` (horas e minutos)

#### **6. Tempo Médio de Resposta (averageResponseTime)**
- **Fonte:** Tabela `associate_service_events`
- **Condição:** `ended_at IS NOT NULL`
- **Filtro de data:** Campo `started_at` (não `created_at`)
- **Cálculo:** Média de `(ended_at - started_at)` dos eventos
- **Formato:** `"8min 30s"` (minutos e segundos)

#### **7. Taxa de Resolução (resolutionRate)**
- **Cálculo:** `(attendancesFinished / attendancesToday) * 100`
- **Formato:** `"87.50%"` (percentual com 2 casas decimais)

#### **8. Tempo Médio de Execução de Guincho (averageTowingExecutionTime)**
- **Fonte:** Tabela `calls` + `towing_call_status_histories`
- **Condição:** `towing_status = 'finished'`
- **Cálculo:**
  1. Busca o timestamp em que o chamado foi marcado como `'finished'` na tabela de histórico
  2. Calcula `TIMESTAMPDIFF(MINUTE, created_at, finished_timestamp)`
  3. Faz a média de todos os tempos
- **Formato:** `"45min"` ou `"1h 23min"` (horas e minutos)

#### **9. Ticket Médio e Despesa Total (towingTicket)**
- **Fonte:** Tabela `bills` (JOIN com `calls`)
- **Condição:** `bills.status = 'paid' AND calls.towing_status IS NOT NULL`
- **Filtro de data:** Campo `bills.payment_date` (quando foi pago, não quando foi criado)
- **Cálculo:**
  - **averageTicket:** `AVG(bills.total_value)` - Média dos valores dos boletos pagos
  - **totalExpense:** `SUM(bills.total_value)` - Soma total dos boletos pagos
- **Formato:**
  - averageTicket: `"R$ 450.00"` (moeda brasileira)
  - totalExpense: `"R$ 15.750,00"` (moeda brasileira)

#### **10. Média NPS - Avaliação dos Guinchos (averageNPS)**
- **Fonte:** Tabela `ratings` (JOIN com `calls`)
- **Condição:** `calls.towing_status IS NOT NULL AND ratings.rating IS NOT NULL`
- **Filtro de data:** Campo `ratings.created_at` convertido para UTC-3
- **Cálculo:**
  1. Busca todas as avaliações (`rating`) da tabela `ratings`
  2. Faz JOIN com `calls` para filtrar apenas avaliações de chamados de guincho
  3. Calcula `AVG(ratings.rating)` - Média de todas as avaliações
  4. Conta `COUNT(*)` - Total de avaliações no período
- **Formato:** `"4.8/5.0"` (nota média sobre 5.0)
- **Query SQL:**
```sql
SELECT
  AVG(r.rating) as average_rating,
  COUNT(*) as total_ratings
FROM ratings r
INNER JOIN calls c ON r.call_id = c.id
WHERE c.towing_status IS NOT NULL
  AND r.rating IS NOT NULL
  AND DATE(CONVERT_TZ(r.created_at, '+00:00', '-03:00')) BETWEEN '2026-02-01' AND '2026-02-04'
```

#### **11. Frequência de Acionamento (callFrequency)**
- **Fonte:** Tabela `associates` + métrica `attendancesToday`
- **Cálculo:** `(attendancesToday / totalAssociates) * 100`
- **Descrição:** Percentual de acionamento em relação à base de clientes
- **Formato:** `"0.15%"` (percentual com 2 casas decimais)
- **Exemplo:**
  - Total de associados na base: 30.000
  - Chamados no período: 45
  - Frequência: (45 / 30.000) * 100 = 0.15%
- **Uso:** Indica quantos % dos associados acionaram o serviço no período

### **Dados Mocados**

⚠️ **IMPORTANTE:** Quando os valores reais estão vazios ou zerados, o backend retorna **dados fictícios** (mocked data) para demonstração:

```typescript
// Valores Mocados (quando dados reais estão vazios)
{
  attendancesToday: 45,
  attendancesInProgress: 12,
  attendancesFinished: 33,
  averageServiceTime: "1h 23min",
  averageTowingExecutionTime: "45min",
  averageNPS: "4.8/5.0",
  callFrequency: "0.15%",
  quickStats: {
    averageResponseTime: "8min",
    resolutionRate: "87.50%"
  },
  towingTicket: {
    averageTicket: "R$ 450.00",
    totalExpense: "R$ 15.750,00"
  }
}
```

**Quando os dados mocados são usados:**
- `attendancesToday || 45` → Se não houver chamados, mostra 45
- `averageServiceTime || "1h 23min"` → Se não houver atendimentos finalizados, mostra 1h 23min
- E assim por diante para todas as métricas

### **Exemplos de Requisições**

#### **1. Dashboard do Dia Atual (padrão)**
```bash
curl -X GET http://localhost:3001/api/dashboard \
  -H "Authorization: Bearer {token}"
```
**Resultado:** Dados de hoje (00:00:00 até 23:59:59)

#### **2. Dashboard de um Dia Específico**
```bash
curl -X GET "http://localhost:3001/api/dashboard?start_date=2026-02-01" \
  -H "Authorization: Bearer {token}"
```
**Resultado:** Dados apenas do dia 01/02/2026

#### **3. Dashboard de um Período**
```bash
curl -X GET "http://localhost:3001/api/dashboard?start_date=2026-02-01&end_date=2026-02-04" \
  -H "Authorization: Bearer {token}"
```
**Resultado:** Dados de 01/02/2026 00:00:00 até 04/02/2026 23:59:59

### **Frontend - Implementação**

#### **Arquivo:** `src/services/dashboard.service.ts`

```typescript
export interface DashboardFilters {
  start_date?: string; // Formato: YYYY-MM-DD
  end_date?: string;   // Formato: YYYY-MM-DD
}

export const dashboardService = {
  getData: async (filters?: DashboardFilters): Promise<DashboardData> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const url = `/api/dashboard${queryString ? `?${queryString}` : ''}`;

    const { data } = await api.get<DashboardData>(url);
    return data;
  },
};
```

#### **Arquivo:** `src/pages/Index.tsx`

```typescript
// Estado para filtros
const [filters, setFilters] = useState<DashboardFilters | undefined>(undefined);

// Busca dados com filtros
const fetchDashboardData = useCallback(async () => {
  const data = await dashboardService.getData(filters);
  setDashboardData(data);
}, [filters]);

// Atualização automática a cada 30 segundos
useEffect(() => {
  fetchDashboardData();
  const interval = setInterval(fetchDashboardData, 30000);
  return () => clearInterval(interval);
}, [fetchDashboardData]);

// Aplicar filtro de data
const handleApplyFilter = (startDate: string, endDate: string) => {
  setFilters({ start_date: startDate, end_date: endDate });
};

// Limpar filtro (volta para dia atual)
const handleClearFilter = () => {
  setFilters(undefined);
};
```

### **Componente de Filtro de Data**

**Arquivo:** `src/components/dashboard/DateRangeFilter.tsx`

- Permite selecionar período de datas
- Ambas as datas (início e fim) são **obrigatórias** para aplicar o filtro
- Botão "Limpar Filtro" volta para o padrão (dia atual)

### **Cards de Métricas Exibidos**

**Arquivo:** `src/pages/Index.tsx`

**Grid principal (3 colunas):**
1. **Chamados Hoje** - `attendancesToday` (ícone: Headphones, cor: primary)
2. **Em Andamento** - `attendancesInProgress` (ícone: PhoneCall, cor: warning)
3. **Finalizados** - `attendancesFinished` (ícone: CheckCircle, cor: success)

**Grid secundário (3 colunas):**
4. **Média NPS** - `averageNPS` (ícone: Star, cor: warning)
5. **Tempo Médio de Execução** - `averageTowingExecutionTime` (ícone: Truck, cor: info)
6. **Ticket Médio** - `towingTicket.averageTicket` (ícone: DollarSign, cor: teal)

**Grid terciário (4 colunas):**
7. **Despesa Total** - `towingTicket.totalExpense` (ícone: CreditCard, cor: success, compact)
8. **Taxa de Resolução** - `quickStats.resolutionRate` (ícone: CheckCircle2, cor: primary)
9. **Atrasos** - `attendancesDelayed` (ícone: AlertCircle, cor: danger)
10. **Frequência de Acionamento** - `callFrequency` (ícone: Activity, cor: info, compact)

**Componente QuickStats:**
11. **Tempo Médio de Atendimento** - `averageServiceTime`

### **Diferenças Importantes: Filtros de Data**

| Campo da Tabela | Usado para Filtrar | Métrica |
|-----------------|-------------------|---------|
| `calls.created_at` | ✅ | Chamados Hoje, Em Andamento, Finalizados, Atrasados, Tempo Médio de Execução de Guincho |
| `associate_services.created_at` | ✅ | Tempo Médio de Atendimento |
| `associate_service_events.started_at` | ✅ | Tempo Médio de Resposta |
| `ratings.created_at` | ✅ | Média NPS (Avaliação dos Guinchos) |
| `bills.payment_date` | ✅ | Ticket Médio, Despesa Total |

**Observação:** Cada métrica usa o campo de data mais apropriado para seu contexto:
- **Chamados** → `created_at` (quando foi criado)
- **Eventos** → `started_at` (quando iniciou)
- **Avaliações** → `created_at` (quando foi avaliado)
- **Boletos** → `payment_date` (quando foi pago, não quando foi criado)
- **Frequência de Acionamento** → Não usa filtro de data direto, calcula com base no `attendancesToday` do período

### **Fluxo Completo**

```
1. Usuário acessa /dashboard
        ↓
2. Frontend: dashboardService.getData() sem filtros
        ↓
3. API: GET /api/dashboard (sem query params)
        ↓
4. Backend: Usa data atual (hoje)
        ↓
5. Backend: Calcula todas as métricas com dateCondition = "hoje"
        ↓
6. Backend: Se dados vazios → Retorna dados mocados
        ↓
7. Frontend: Renderiza cards com valores
        ↓
8. Após 30 segundos: Repete busca automaticamente
        ↓
9. Usuário aplica filtro (ex: 01/02 a 04/02)
        ↓
10. Frontend: setFilters({ start_date: "2026-02-01", end_date: "2026-02-04" })
        ↓
11. useEffect detecta mudança em filters
        ↓
12. API: GET /api/dashboard?start_date=2026-02-01&end_date=2026-02-04
        ↓
13. Backend: Usa dateCondition com período especificado
        ↓
14. Frontend: Atualiza cards com novos valores
```

### **Validações e Erros**

#### **Formato de Data Inválido**
```bash
GET /api/dashboard?start_date=01/02/2026
```
**Resposta:**
```json
{
  "error": "Formato de start_date inválido. Use YYYY-MM-DD (ex: 2026-02-04)"
}
```
**Status:** `400 Bad Request`

#### **Token Ausente ou Inválido**
```bash
GET /api/dashboard
# Sem header Authorization
```
**Resposta:**
```json
{
  "error": "Não autorizado. Token obrigatório."
}
```
**Status:** `401 Unauthorized`

### **Logs de Debug (Backend)**

Ao executar uma requisição, os logs exibem:
```sql
-- Exemplo de query executada (chamados de hoje)
SELECT COUNT(*) as count
FROM calls
WHERE towing_status IS NOT NULL
  AND DATE(CONVERT_TZ(created_at, '+00:00', '-03:00')) = DATE(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
```

```sql
-- Exemplo de query com filtro de período
SELECT COUNT(*) as count
FROM calls
WHERE towing_status IS NOT NULL
  AND DATE(CONVERT_TZ(created_at, '+00:00', '-03:00')) BETWEEN '2026-02-01' AND '2026-02-04'
```

### **Considerações de Performance**

1. **Cache:** Não há cache implementado. Cada requisição executa queries no banco.
2. **Atualização automática:** Frontend atualiza a cada 30 segundos.
3. **Queries complexas:** Algumas métricas fazem JOINs e subconsultas (ex: chamados atrasados).
4. **Timezone:** Todas as conversões UTC → UTC-3 são feitas no banco de dados.

### **Testes Sugeridos**

#### **Teste 1: Dashboard sem filtros (dia atual)**
```bash
curl -X GET http://localhost:3001/api/dashboard \
  -H "Authorization: Bearer {seu_token}"
```
**Verificar:** Retorna métricas do dia atual

#### **Teste 2: Dashboard com período específico**
```bash
curl -X GET "http://localhost:3001/api/dashboard?start_date=2026-02-01&end_date=2026-02-04" \
  -H "Authorization: Bearer {seu_token}"
```
**Verificar:** Retorna métricas do período especificado

#### **Teste 3: Verificar dados mocados**
```bash
# Usar uma data sem dados (ex: futuro distante)
curl -X GET "http://localhost:3001/api/dashboard?start_date=2030-01-01" \
  -H "Authorization: Bearer {seu_token}"
```
**Verificar:** Retorna valores mocados (45, 12, 33, etc.)

#### **Teste 4: Validação de formato de data**
```bash
curl -X GET "http://localhost:3001/api/dashboard?start_date=01-02-2026" \
  -H "Authorization: Bearer {seu_token}"
```
**Verificar:** Retorna erro 400 com mensagem de formato inválido

---

## **📊 Exemplos Detalhados de Cálculo**

### **Exemplo 1: Frequência de Acionamento**

**Cenário:**
- Total de associados cadastrados: 30.000
- Chamados no dia: 45
- Período filtrado: Hoje (01/02/2026)

**Cálculo:**
```typescript
const totalAssociates = 30000; // Total de registros na tabela associates
const attendancesToday = 45;   // Chamados criados hoje

const callFrequency = (attendancesToday / totalAssociates) * 100;
// = (45 / 30000) * 100
// = 0.0015 * 100
// = 0.15%
```

**Query SQL:**
```sql
-- 1. Conta total de associados
SELECT COUNT(*) FROM associates;
-- Resultado: 30000

-- 2. Usa o attendancesToday já calculado
-- attendancesToday = 45 (chamados do período filtrado)

-- 3. Calcula a frequência
-- callFrequency = (45 / 30000) * 100 = 0.15%
```

**Retorno da API:**
```json
{
  "callFrequency": "0.15%"
}
```

**Interpretação:**
- 0.15% dos associados acionaram o serviço no período
- Em cada 10.000 associados, aproximadamente 15 acionaram
- Taxa de utilização baixa (esperado para serviços de emergência)

---

### **Exemplo 2: Média NPS**

**Cenário:**
- Período filtrado: 01/02/2026 a 04/02/2026
- Avaliações recebidas:
  - Call #1001: 5.0 ⭐⭐⭐⭐⭐
  - Call #1002: 4.5 ⭐⭐⭐⭐☆
  - Call #1003: 5.0 ⭐⭐⭐⭐⭐
  - Call #1004: 4.0 ⭐⭐⭐⭐
  - Call #1005: 4.8 ⭐⭐⭐⭐⭐

**Cálculo:**
```typescript
const ratings = [5.0, 4.5, 5.0, 4.0, 4.8];
const totalRatings = 5;
const sumRatings = 5.0 + 4.5 + 5.0 + 4.0 + 4.8 = 23.3;

const averageNPS = sumRatings / totalRatings;
// = 23.3 / 5
// = 4.66
// = "4.7/5.0" (arredondado para 1 casa decimal)
```

**Query SQL:**
```sql
SELECT
  AVG(r.rating) as average_rating,
  COUNT(*) as total_ratings
FROM ratings r
INNER JOIN calls c ON r.call_id = c.id
WHERE c.towing_status IS NOT NULL
  AND r.rating IS NOT NULL
  AND DATE(CONVERT_TZ(r.created_at, '+00:00', '-03:00')) BETWEEN '2026-02-01' AND '2026-02-04';

-- Resultado:
-- average_rating: 4.66
-- total_ratings: 5
```

**Retorno da API:**
```json
{
  "averageNPS": "4.7/5.0"
}
```

**Interpretação:**
- Média de 4.7 estrelas de 5.0 possíveis
- Alta satisfação dos clientes (93.2%)
- 5 avaliações recebidas no período

---

### **Exemplo 3: Ticket Médio e Despesa Total**

**Cenário:**
- Período filtrado: 01/02/2026 a 04/02/2026
- Boletos pagos no período:
  - Boleto #001: R$ 350,00 (pago em 02/02)
  - Boleto #002: R$ 500,00 (pago em 03/02)
  - Boleto #003: R$ 450,00 (pago em 04/02)
  - Boleto #004: R$ 600,00 (pago em 04/02)

**Cálculo:**
```typescript
const paidBills = [350.00, 500.00, 450.00, 600.00];
const totalExpense = 350 + 500 + 450 + 600 = 1900.00;
const averageTicket = 1900.00 / 4 = 475.00;
```

**Query SQL:**
```sql
SELECT
  SUM(b.total_value) as total_expense,
  AVG(b.total_value) as average_ticket
FROM bills b
INNER JOIN calls c ON b.call_id = c.id
WHERE b.status = 'paid'
  AND c.towing_status IS NOT NULL
  AND DATE(CONVERT_TZ(b.payment_date, '+00:00', '-03:00')) BETWEEN '2026-02-01' AND '2026-02-04';

-- Resultado:
-- total_expense: 1900.00
-- average_ticket: 475.00
```

**Retorno da API:**
```json
{
  "towingTicket": {
    "averageTicket": "R$ 475.00",
    "totalExpense": "R$ 1.900,00"
  }
}
```

**Interpretação:**
- Ticket médio de R$ 475,00 por serviço pago
- Receita total de R$ 1.900,00 no período
- 4 boletos foram pagos

**⚠️ Importante:** Usa `payment_date` (quando foi pago), não `created_at` (quando foi criado). Boletos criados no período mas pagos depois não são contabilizados.

---

## **⚙️ Configurações de Guincho por Estado**

### **Visão Geral**

A funcionalidade de **Configurações de Guincho** permite gerenciar os valores de serviços de guincho para cada estado (UF) do Brasil. Os valores configurados incluem:
- **Preço por KM Excedente:** Valor cobrado por cada quilômetro adicional além do limite
- **Preço de Partida:** Valor fixo cobrado ao iniciar o serviço

### **Localização**

**Página:** `/config` → Tab "Config. Guincheiro"

**Arquivos:**
- `src/pages/Configuracoes.tsx` - Página principal de configurações
- `src/components/configuracoes/TowingSettingsTab.tsx` - Componente da tab de guincho
- `src/services/towingSettings.service.ts` - Service para consumir a API

### **Endpoints da API**

#### **1. Listar Configurações**

**URL:** `GET /api/towing-settings`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "total": 2,
  "data": [
    {
      "id": 5,
      "uf": {
        "id": 14,
        "code": "AL",
        "name": "Alagoas"
      },
      "excess_km_price": 3.2,
      "departure_price": 140,
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 1,
      "uf": {
        "id": 20,
        "code": "SP",
        "name": "São Paulo"
      },
      "excess_km_price": 3.4,
      "departure_price": 145,
      "created_at": "2026-02-09T16:30:24.000Z",
      "updated_at": "2026-02-09T16:30:24.000Z"
    }
  ]
}
```

#### **2. Criar Nova Configuração**

**URL:** `POST /api/towing-settings`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "uf_id": 14,
  "excess_km_price": 3.20,
  "departure_price": 140.00
}
```

**Resposta:**
```json
{
  "message": "Configuração criada com sucesso",
  "data": {
    "id": 5,
    "uf": {
      "id": 14,
      "code": "AL",
      "name": "Alagoas"
    },
    "excess_km_price": 3.2,
    "departure_price": 140,
    "created_at": null,
    "updated_at": null
  }
}
```

#### **3. Atualizar Configuração**

**URL:** `PUT /api/towing-settings/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "excess_km_price": 3.40,
  "departure_price": 145.00
}
```

**Resposta:**
```json
{
  "excess_km_price": 3.40,
  "departure_price": 145.00
}
```

**Observação:** O `uf_id` não pode ser alterado após a criação. Para alterar o estado, é necessário excluir e criar novamente.

#### **4. Excluir Configuração**

**URL:** `DELETE /api/towing-settings/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:** Status 204 (No Content)

#### **5. Buscar por ID**

**URL:** `GET /api/towing-settings/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:** Objeto `TowingSetting` único

### **Interfaces TypeScript**

```typescript
export interface UF {
  id: number;
  code: string;
  name: string;
}

export interface TowingSetting {
  id: number;
  uf: UF;
  excess_km_price: number;
  departure_price: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface TowingSettingsResponse {
  total: number;
  data: TowingSetting[];
}

export interface CreateTowingSettingPayload {
  uf_id: number;
  excess_km_price: number;
  departure_price: number;
}

export interface UpdateTowingSettingPayload {
  excess_km_price: number;
  departure_price: number;
}
```

### **Funcionalidades da Interface**

#### **Tabela de Listagem**
- Exibe todas as configurações cadastradas
- Colunas: Estado (UF), Preço por KM Excedente, Preço de Partida, Ações
- Ícones: MapPin (estado), DollarSign (valores)
- Loading state com spinner
- Empty state quando não há configurações

#### **Dialog de Criar/Editar**
- **Criar:** Permite selecionar UF e preencher valores
- **Editar:** UF fica desabilitado, permite apenas editar valores
- **Validações:**
  - Todos os campos obrigatórios
  - Valores numéricos com 2 casas decimais
  - Valores mínimos: 0
- **Feedback:** Toast notifications para sucesso/erro

#### **Máscaras de Entrada (Input Masks)**

Os campos de preço utilizam a biblioteca **react-currency-input-field** para formatação monetária brasileira:

**⚠️ INSTALAÇÃO - IMPORTANTE!**

Como o frontend roda em **Docker**, o pacote DEVE ser instalado **dentro do container**:

```bash
# ✅ CORRETO - Instalar no container Docker
docker exec utiliza-front-assistencia-app-1 npm install react-currency-input-field

# ❌ ERRADO - Não instalar no host
# npm install react-currency-input-field
# Isso causará erro: "Failed to resolve import"
```

**Versão Instalada:** `3.8.0`

**Configuração dos Campos de Preço:**
```typescript
import CurrencyInput from "react-currency-input-field";

<CurrencyInput
  id="excess_km_price"
  name="excess_km_price"
  placeholder="R$ 3,40"
  decimalsLimit={2}              // Máximo 2 casas decimais
  decimalSeparator=","           // Vírgula para decimal (padrão BR)
  groupSeparator="."             // Ponto para milhar (padrão BR)
  prefix="R$ "                   // Prefixo Real brasileiro
  value={formData.excess_km_price}
  onValueChange={(value) =>
    setFormData({ ...formData, excess_km_price: value || "" })
  }
  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  required
/>
```

**Formato de Entrada:**
- Usuário digita: `340` → Exibe: `R$ 3,40`
- Usuário digita: `14500` → Exibe: `R$ 145,00`
- Usuário digita: `1234567` → Exibe: `R$ 12.345,67`

**Conversão para API:**
```typescript
// Ao enviar para API, converte string → number
const payload = {
  excess_km_price: parseFloat(formData.excess_km_price),  // "3.40" → 3.4
  departure_price: parseFloat(formData.departure_price)   // "145.00" → 145
};
```

**Comportamento da Máscara:**
- ✅ Formatação em tempo real durante a digitação
- ✅ Aceita apenas números (bloqueia letras automaticamente)
- ✅ Formata automaticamente com separadores brasileiros
- ✅ Permite copiar/colar valores
- ✅ Backspace funciona normalmente
- ✅ Suporta seleção de texto

**Armazenamento de Dados:**
- Valor interno mantido como **string** (ex: "3.40")
- Evita perda de precisão com decimais
- Conversão para **number** apenas no submit
- API recebe valores numéricos (ex: `3.4`, `145`)

**Troubleshooting:**

| Problema | Causa | Solução |
|----------|-------|---------|
| `Failed to resolve import "react-currency-input-field"` | Pacote instalado no host, não no container | `docker exec utiliza-front-assistencia-app-1 npm install react-currency-input-field` |
| Máscara não formata | Componente não importado corretamente | Verificar import: `import CurrencyInput from "react-currency-input-field"` |
| Valor não salva | Conversão incorreta para number | Usar `parseFloat(value)` antes de enviar para API |
| Formato americano (US) ao invés de BR | Separadores configurados errados | Verificar: `decimalSeparator=","` e `groupSeparator="."` |

**Hot Reload Automático:**
- Após `docker exec ... npm install`, o Vite detecta automaticamente
- Não precisa reiniciar o container manualmente
- Aguarde ~5 segundos para hot reload completar

#### **Ações**
- **Nova Configuração:** Botão no header do card
- **Editar:** Ícone de lápis na linha da tabela
- **Excluir:** Ícone de lixeira → **AlertDialog de confirmação visual**

**AlertDialog de Exclusão:**
```typescript
// Componente: AlertDialog do shadcn/ui
// Exibe ao clicar no botão de excluir
<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
    <AlertDialogDescription>
      Tem certeza que deseja excluir a configuração de
      <strong>{estado.name} ({estado.code})</strong>?
      Esta ação não poderá ser desfeita.
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteConfirm}>
        Excluir
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Fluxo de Exclusão:**
1. Usuário clica no ícone de lixeira
2. AlertDialog abre mostrando o estado a ser excluído
3. Botões: "Cancelar" (outline) e "Excluir" (vermelho/destructive)
4. Se confirmar → DELETE para API → Toast de sucesso → Recarrega lista
5. Se cancelar → Fecha o dialog sem fazer nada

### **Lista de Estados (UFs)**

27 estados brasileiros + DF disponíveis no dropdown:
- AC (Acre), AL (Alagoas), AP (Amapá), AM (Amazonas)
- BA (Bahia), CE (Ceará), DF (Distrito Federal), ES (Espírito Santo)
- GO (Goiás), MA (Maranhão), MT (Mato Grosso), MS (Mato Grosso do Sul)
- MG (Minas Gerais), PA (Pará), PB (Paraíba), PR (Paraná)
- PE (Pernambuco), PI (Piauí), RJ (Rio de Janeiro), RN (Rio Grande do Norte)
- RS (Rio Grande do Sul), RO (Rondônia), RR (Roraima), SC (Santa Catarina)
- SP (São Paulo), SE (Sergipe), TO (Tocantins)

### **Fluxo de Uso**

#### **Criar Nova Configuração:**
```
1. Usuário acessa /config
2. Clica na tab "Config. Guincheiro"
3. Clica em "Nova Configuração"
4. Preenche:
   - Seleciona Estado (UF)
   - Preço por KM Excedente: 3.40
   - Preço de Partida: 145.00
5. Clica em "Salvar"
6. POST /api/towing-settings
7. Toast de sucesso
8. Lista atualizada
```

#### **Editar Configuração Existente:**
```
1. Usuário localiza configuração na tabela
2. Clica no ícone de editar (lápis)
3. Dialog abre com dados preenchidos
4. Campo UF está desabilitado
5. Altera valores:
   - Preço por KM: 3.50
   - Preço de Partida: 150.00
6. Clica em "Salvar"
7. PUT /api/towing-settings/5
8. Toast de sucesso
9. Lista atualizada
```

#### **Excluir Configuração:**
```
1. Usuário clica no ícone de excluir (lixeira)
2. AlertDialog abre mostrando:
   - Título: "Confirmar Exclusão"
   - Descrição: "Tem certeza que deseja excluir a configuração de [Estado]?"
   - Aviso: "Esta ação não poderá ser desfeita."
   - Botões: "Cancelar" | "Excluir"
3. Se clicar em "Excluir":
   - DELETE /api/towing-settings/5
   - Toast de sucesso
   - Lista atualizada
   - Dialog fecha
4. Se clicar em "Cancelar":
   - Dialog fecha sem fazer nada
```

### **Validações e Regras de Negócio**

#### **Criação:**
- ✅ Todos os campos obrigatórios
- ✅ Estado (UF) deve ser único (não pode ter duas configs para o mesmo estado)
- ✅ Valores numéricos > 0
- ✅ Precisão: 2 casas decimais

#### **Edição:**
- ✅ Não permite alterar o estado (uf_id)
- ✅ Valores numéricos > 0
- ✅ Precisão: 2 casas decimais

#### **Exclusão:**
- ✅ Requer confirmação do usuário
- ✅ Soft delete ou hard delete (depende do backend)

### **Tratamento de Erros**

#### **Erro 401 - Não Autorizado**
```json
{
  "error": "Não autorizado. Token obrigatório."
}
```
**Ação:** Redireciona para login

#### **Erro 400 - Validação**
```json
{
  "error": "Estado já possui configuração cadastrada"
}
```
**Ação:** Toast com mensagem de erro

#### **Erro 500 - Servidor**
```json
{
  "error": "Failed to fetch towing settings"
}
```
**Ação:** Toast genérico de erro

### **Exemplos de Uso da API**

#### **Exemplo 1: Criar configuração para SP**
```bash
curl -X POST http://localhost:3001/api/towing-settings \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "uf_id": 25,
    "excess_km_price": 3.50,
    "departure_price": 150.00
  }'
```

#### **Exemplo 2: Atualizar valores de AL**
```bash
curl -X PUT http://localhost:3001/api/towing-settings/5 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "excess_km_price": 3.60,
    "departure_price": 155.00
  }'
```

#### **Exemplo 3: Listar todas as configurações**
```bash
curl -X GET http://localhost:3001/api/towing-settings \
  -H "Authorization: Bearer {token}"
```

### **📋 Resumo Rápido - Config. Guincheiro**

#### **Comandos Essenciais**

```bash
# 1️⃣ Instalar dependência de máscaras (NO CONTAINER!)
docker exec utiliza-front-assistencia-app-1 npm install react-currency-input-field

# 2️⃣ Verificar se instalou
docker exec utiliza-front-assistencia-app-1 ls /app/node_modules/react-currency-input-field

# 3️⃣ Ver logs em tempo real
docker logs utiliza-front-assistencia-app-1 -f
```

#### **Arquivos da Feature**

| Arquivo | Localização | Descrição |
|---------|-------------|-----------|
| Service | `src/services/towingSettings.service.ts` | CRUD API calls |
| Component | `src/components/configuracoes/TowingSettingsTab.tsx` | Interface e lógica |
| Page | `src/pages/Configuracoes.tsx` | Container com tabs |

#### **Endpoints API**

| Método | Endpoint | Payload |
|--------|----------|---------|
| GET | `/api/towing-settings` | - |
| GET | `/api/towing-settings/:id` | - |
| POST | `/api/towing-settings` | `{ uf_id, excess_km_price, departure_price }` |
| PUT | `/api/towing-settings/:id` | `{ excess_km_price, departure_price }` |
| DELETE | `/api/towing-settings/:id` | - |

#### **Formato de Dados**

```typescript
// Request (POST/PUT)
{
  uf_id: 25,                    // Apenas no POST
  excess_km_price: 3.40,        // Number
  departure_price: 145.00       // Number
}

// Response
{
  id: 1,
  uf: { id: 25, code: "SP", name: "São Paulo" },
  excess_km_price: 3.4,         // Number
  departure_price: 145,         // Number
  created_at: "2026-02-09...",
  updated_at: "2026-02-09..."
}
```

#### **Checklist de Implementação**

- [x] Service layer com TypeScript tipado
- [x] Interface de listagem com tabela
- [x] Dialog de criar/editar
- [x] Validações de formulário
- [x] Máscaras de entrada monetária (BR)
- [x] Toast notifications
- [x] Loading states
- [x] Empty states
- [x] AlertDialog de confirmação de exclusão (visual)
- [x] UF não editável no update
- [x] 27 estados + DF disponíveis
- [x] Hot reload automático (Docker)

#### **Como Testar**

1. **Acesse:** http://localhost:8080/config
2. **Tab:** "Config. Guincheiro"
3. **Criar:**
   - Clique "Nova Configuração"
   - Selecione UF (ex: SP)
   - Digite valores: `340` → `R$ 3,40` | `14500` → `R$ 145,00`
   - Clique "Salvar"
4. **Editar:**
   - Clique no ícone de lápis
   - Altere valores
   - Salvar
5. **Excluir:**
   - Clique no ícone de lixeira
   - Confirme

---

## **👷 Gestão de Prestadores (Motoristas de Guincho)**

### **Visão Geral**

A página de **Prestadores** exibe todos os motoristas de guincho cadastrados no sistema, com informações detalhadas sobre cada prestador, incluindo empresa, status, histórico de chamados e configurações de valores.

### **Localização**

**Página:** `/prestadores`

**Arquivos:**
- `src/pages/Prestadores.tsx` - Página principal com tabela
- `src/services/towingDrivers.service.ts` - Service para consumir a API

### **Endpoints da API**

#### **GET /api/towing-drivers**

**URL:** `GET http://localhost:3001/api/towing-drivers`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```typescript
{
  page?: number;          // Página atual (default: 1)
  limit?: number;         // Itens por página (default: 10)
  search?: string;        // Busca por nome (name) ou empresa (fantasy_name)
  status?: string;        // Filtro por status: 'available', 'in_service', 'banned'
  uf_id?: number;         // Filtro por estado (UF)
}
```

**Resposta:**
```json
{
  "data": [
    {
      "id": 380,
      "name": "992107766",
      "cpf": "398.054.468-08",
      "phone": "(16) 99210-7766",
      "status": "in_service",
      "towing_provider": {
        "id": 464,
        "fantasy_name": "auto socorro estradeiro"
      },
      "total_calls": 1,
      "uf": {
        "id": 20,
        "code": "SP",
        "name": "São Paulo"
      },
      "towing_settings": {
        "id": 1,
        "excess_km_price": 3.4,
        "departure_price": 145
      },
      "created_at": "2025-08-29T13:58:06.000Z"
    }
  ],
  "pagination": {
    "total": 530,
    "current_page": 1,
    "per_page": 10,
    "last_page": 53,
    "from": 1,
    "to": 10
  }
}
```

### **Estrutura de Dados**

```typescript
export interface TowingDriver {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  status: 'available' | 'in_service' | 'banned';
  towing_provider: {
    id: number;
    fantasy_name: string;
  };
  total_calls: number;
  uf: {
    id: number;
    code: string;
    name: string;
  } | null;
  towing_settings: {
    id: number;
    excess_km_price: number;
    departure_price: number;
  } | null;
  created_at: string;
}
```

### **Funcionalidades da Interface**

#### **Cards de Estatísticas**

Exibe métricas em tempo real baseadas nos dados carregados:

1. **Total Prestadores:** Contador total de prestadores cadastrados
2. **Disponíveis:** Número de prestadores com status `available`
3. **Em Serviço:** Número de prestadores com status `in_service`
4. **Total de Chamados:** Soma de todos os `total_calls` dos prestadores

#### **Filtros e Busca**

**Card de Filtros:**
- **Campo de Busca:**
  - Busca em tempo real (debounce de 500ms)
  - Busca por nome do motorista ou nome fantasia da empresa
  - Atualiza automaticamente conforme digita
  - Ícone de lupa à esquerda
  - Sem botão "Buscar" (igual página de Chamados)

- **Filtro de Status:**
  - Dropdown com opções:
    - Todos os Status
    - Disponível
    - Em Serviço
    - Banido
  - Atualiza automaticamente ao mudar

#### **Tabela de Listagem**

**Colunas:**

| Coluna | Descrição | Ícone |
|--------|-----------|-------|
| **Nome** | Nome do motorista com ícone de caminhão | 🚚 Truck |
| **CPF** | CPF formatado (font monospace) | - |
| **Telefone** | Telefone formatado | 📞 Phone |
| **Empresa** | Nome fantasia do prestador | 🏢 Building2 |
| **UF** | Código do estado (badge) | 📍 MapPin |
| **Status** | Badge colorido com status | - |
| **Chamados** | Total de chamados realizados | - |
| **Preço/KM** | Preço por KM excedente (R$) | - |
| **Partida** | Preço de partida do serviço (R$) | - |

**Status (Badges):**

```typescript
{
  available: {
    label: "Disponível",
    className: "bg-success/15 text-success border-success/20"
  },
  in_service: {
    label: "Em Serviço",
    className: "bg-warning/15 text-warning border-warning/20"
  },
  banned: {
    label: "Banido",
    className: "bg-destructive/15 text-destructive border-destructive/20"
  }
}
```

**Exibição de Valores:**

Duas colunas separadas:
- **Preço/KM:** R$ 3,40 ← `towing_settings.excess_km_price`
- **Partida:** R$ 145,00 ← `towing_settings.departure_price`

Se `towing_settings` for `null`, ambas exibem `-`

#### **Paginação**

- **Informações:** "Mostrando X a Y de Z resultados"
- **Navegação:**
  - Botão "Anterior" (desabilitado na primeira página)
  - Números das páginas clicáveis (máximo 5 visíveis + primeira e última)
  - Reticências (...) quando há muitas páginas
  - Botão "Próxima" (desabilitado na última página)
- **Página Atual:** Destacada com variant="default" (cor primária)
- **Exibição:** Aparece apenas se `last_page > 1`

**Exemplo visual:**
```
[Anterior] [1] ... [5] 6 [7] [8] [9] ... [53] [Próxima]
           └─────────────────┬─────────────────┘
                      Página 6 está ativa
```

#### **Estados da Interface**

1. **Loading:** Spinner centralizado durante carregamento
2. **Empty:** Ícone de caminhão + mensagem quando não há resultados
3. **Populated:** Tabela com dados

### **Fluxo de Uso**

```
1. Usuário acessa /prestadores
2. Sistema carrega dados da API (página 1, 10 itens)
3. Cards de estatísticas são atualizados
4. Tabela é populada

--- Busca ---
5. Usuário digita "João" no campo de busca
6. Aguarda 500ms (debounce)
7. currentPage reseta para 1
8. API é chamada automaticamente com param search="João"
9. Tabela atualizada com resultados em tempo real

--- Filtro por Status ---
10. Usuário seleciona "Disponível" no dropdown
11. API é chamada automaticamente com status="available"
12. Tabela atualizada

--- Paginação ---
13. Usuário clica em "Próxima"
14. currentPage incrementa
15. API é chamada com page=2
16. Tabela atualizada
```

### **Tratamento de Erros**

```typescript
try {
  const response = await towingDriversService.getAll(params);
  // Sucesso
} catch (error) {
  toast({
    title: "Erro",
    description: "Não foi possível carregar os prestadores",
    variant: "destructive",
  });
}
```

### **Exemplo de Requisição**

#### **Buscar prestadores disponíveis (página 1)**

```bash
curl -X GET "http://localhost:3001/api/towing-drivers?page=1&limit=10&status=available" \
  -H "Authorization: Bearer {token}"
```

#### **Buscar por nome ou empresa**

```bash
curl -X GET "http://localhost:3001/api/towing-drivers?search=joao" \
  -H "Authorization: Bearer {token}"
```

#### **Busca completa com filtros**

```bash
curl -X GET "http://localhost:3001/api/towing-drivers?status=available&search=joao&page=1&limit=20" \
  -H "Authorization: Bearer {token}"
```

### **📋 Resumo Rápido - Prestadores**

#### **Arquivos da Feature**

| Arquivo | Localização | Descrição |
|---------|-------------|-----------|
| Service | `src/services/towingDrivers.service.ts` | API calls para motoristas |
| Page | `src/pages/Prestadores.tsx` | Tabela e interface |

#### **Colunas da Tabela**

1. Nome (com ícone)
2. CPF (font mono)
3. Telefone (com ícone)
4. Empresa (com ícone)
5. UF (badge)
6. Status (badge colorido)
7. Chamados (número)
8. Preço/KM (R$)
9. Partida (R$)

#### **Filtros Disponíveis**

- ✅ Busca por texto (nome ou nome fantasia)
- ✅ Filtro por status (disponível, em serviço, banido)
- ✅ Paginação (10 por página)

#### **Checklist de Implementação**

- [x] Service layer TypeScript tipado
- [x] Interface em tabela responsiva
- [x] Cards de estatísticas dinâmicas
- [x] Busca em tempo real com debounce (500ms)
- [x] Filtro por status com dropdown
- [x] Paginação com números de páginas
- [x] Loading states
- [x] Empty states
- [x] Toast notifications de erro
- [x] Badges de status coloridos
- [x] Exibição de valores monetários (2 colunas)
- [x] Scroll horizontal na tabela

#### **Como Testar**

1. **Acesse:** http://localhost:8080/prestadores
2. **Verificar:** Cards de estatísticas no topo
3. **Buscar em Tempo Real:**
   - Digite "João" no campo de busca
   - Aguarde 500ms
   - Tabela atualiza automaticamente
4. **Filtrar:**
   - Selecione "Disponível" no dropdown de status
   - Tabela atualiza automaticamente
5. **Navegar:**
   - Clique nos números das páginas (1, 2, 3...)
   - Use botões "Anterior" e "Próxima"
   - Observe a página atual destacada em verde

---

### **Melhorias Futuras - Config. Guincheiro**

- [ ] Filtro por estado (UF) na tabela
- [ ] Paginação para grandes volumes
- [ ] Importação/Exportação em massa (CSV/Excel)
- [ ] Histórico de alterações de valores
- [ ] Validação de valores mínimos/máximos configuráveis
- [ ] Configurações por cidade (além de estado)
- [ ] Diferentes valores por tipo de veículo

