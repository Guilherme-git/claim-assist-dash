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
