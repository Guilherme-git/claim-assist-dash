# Docker — Utiliza Front Assistência

Instruções só para rodar e compilar o front com Docker.

---

## Quando usar qual arquivo

| Situação | Arquivo | Porta |
|----------|---------|--------|
| **Desenvolvendo** (editar código e ver mudanças na hora) | `docker-compose.dev.yml` | http://localhost:8080 |
| **Produção / só rodar** (build pronto, sem editar) | `docker-compose.yml` | http://localhost:8081 |

- **`docker-compose.yml`** → Build estático + Nginx. Testar como em produção ou deploy.
- **`docker-compose.dev.yml`** → Vite com hot reload. Uso no dia a dia enquanto codifica.

---

## Comandos para rodar

### Desenvolvimento (hot reload)

```sh
# Subir em modo dev
docker compose -f docker-compose.dev.yml up -d --build

# Acessar: http://localhost:8080
# Alterações no código refletem no navegador automaticamente
```

**Parar:**

```sh
docker compose -f docker-compose.dev.yml down
```

### Produção (build estático)

```sh
# Build e subir
docker compose up -d --build

# Acessar: http://localhost:8081
```

**Parar:**

```sh
docker compose down
```

---

## Quando compilar (rebuild)

| Tarefa | Comando |
|--------|---------|
| Primeira vez ou mudou dependências (dev) | `docker compose -f docker-compose.dev.yml up -d --build` |
| Primeira vez ou mudou código (produção) | `docker compose up -d --build` |
| Só mudou código em dev | Não precisa rebuild; salve o arquivo e o Vite atualiza. |

---

## Docker sem Compose

**Produção (build + Nginx):**

```sh
docker build -t utiliza-front-assistencia .
docker run -p 8081:8081 utiliza-front-assistencia
```

---

## Variáveis de ambiente

Crie um `.env` na raiz do projeto (ou use o que já existe). Para a API em outra URL:

```env
VITE_API_URL=http://localhost:3001
```

O `docker-compose.dev.yml` lê esse valor. Em produção, a URL da API é definida no build (variável no momento do `docker build`).

---

## Resumo rápido

| Objetivo | Comando |
|----------|---------|
| Desenvolvimento | `docker compose -f docker-compose.dev.yml up -d --build` |
| Produção | `docker compose up -d --build` |
| Parar (dev) | `docker compose -f docker-compose.dev.yml down` |
| Parar (produção) | `docker compose down` |
