# 🐳 Guia Docker - Utiliza Front-End

## ⚠️ IMPORTANTE - LEIA PRIMEIRO!

Este projeto roda **DENTRO de um container Docker**, não diretamente na máquina host.

**Isso significa que:**
- ❌ `npm install` no host **NÃO FUNCIONA** para o dev server
- ✅ Deve usar `docker exec` para instalar pacotes
- ✅ Hot reload funciona automaticamente via volume mount

---

## 📦 Estrutura do Container

```
┌─────────────────────────────────────┐
│   Host Machine                      │
│   /var/www/utiliza/                 │
│   utiliza-front-assistencia/        │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Docker Container           │   │
│   │  Nome: utiliza-front-       │   │
│   │        assistencia-app-1    │   │
│   │                             │   │
│   │  Working Dir: /app          │   │
│   │  Port: 8080:8080            │   │
│   │                             │   │
│   │  Vite Dev Server            │   │
│   │  http://localhost:8080      │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🚀 Comandos Essenciais

### Instalar Pacote NPM

```bash
# ✅ CORRETO - Instala no container
docker exec utiliza-front-assistencia-app-1 npm install <package-name>

# Exemplo:
docker exec utiliza-front-assistencia-app-1 npm install react-currency-input-field
```

```bash
# ❌ ERRADO - Não funciona para o dev server
npm install <package-name>
# Erro resultante: "Failed to resolve import"
```

### Desinstalar Pacote

```bash
docker exec utiliza-front-assistencia-app-1 npm uninstall <package-name>
```

### Verificar Container

```bash
# Listar containers rodando
docker ps | grep front

# Ver logs em tempo real
docker logs utiliza-front-assistencia-app-1 -f

# Ver logs das últimas 50 linhas
docker logs utiliza-front-assistencia-app-1 --tail 50
```

### Acessar Shell do Container

```bash
# Abrir shell interativo
docker exec -it utiliza-front-assistencia-app-1 sh

# Dentro do container você pode:
# - cd /app
# - ls node_modules/
# - npm list
# - cat package.json
# - exit (para sair)
```

### Reiniciar Container

```bash
docker restart utiliza-front-assistencia-app-1
```

### Parar/Iniciar Container

```bash
# Parar
docker stop utiliza-front-assistencia-app-1

# Iniciar
docker start utiliza-front-assistencia-app-1
```

---

## 🔍 Troubleshooting

### ❌ Erro: "Failed to resolve import"

**Sintomas:**
```
[vite] Internal Server Error
Failed to resolve import "react-currency-input-field" from "src/..."
Does the file exist?
```

**Causa:**
Pacote instalado no host, mas não no container.

**Solução:**
```bash
docker exec utiliza-front-assistencia-app-1 npm install <package-name>
```

**Verificar se resolveu:**
```bash
# Deve listar o pacote
docker exec utiliza-front-assistencia-app-1 ls /app/node_modules/<package-name>
```

---

### ❌ Dev Server Não Responde

**Verificar se container está rodando:**
```bash
docker ps | grep front
```

**Se não estiver listado:**
```bash
docker start utiliza-front-assistencia-app-1
```

**Ver logs para identificar erro:**
```bash
docker logs utiliza-front-assistencia-app-1 -f
```

---

### ❌ Porta 8080 Ocupada

**Verificar mapeamento de portas:**
```bash
docker port utiliza-front-assistencia-app-1

# Esperado:
# 8080/tcp -> 0.0.0.0:8080
# 8080/tcp -> [::]:8080
```

**Verificar o que está usando a porta:**
```bash
lsof -i :8080
```

---

### ❌ Mudanças no Código Não Aparecem

**Verificar volume mount:**
```bash
docker inspect utiliza-front-assistencia-app-1 | grep -A 10 Mounts
```

**Deve mostrar:**
```json
"Mounts": [
  {
    "Source": "/var/www/utiliza/utiliza-front-assistencia",
    "Destination": "/app",
    "Mode": "rw"
  }
]
```

**Forçar rebuild:**
```bash
docker restart utiliza-front-assistencia-app-1
```

---

## 📝 Workflow Recomendado

### Desenvolvimento Normal

```bash
# 1. Editar código no host (VS Code, vim, etc)
vim /var/www/utiliza/utiliza-front-assistencia/src/components/MyComponent.tsx

# 2. Vite hot-reload automático via volume mount
# Aguarde ~2 segundos para ver mudanças no navegador
```

### Adicionar Nova Dependência

```bash
# 1. Instalar no container
docker exec utiliza-front-assistencia-app-1 npm install <package>

# 2. Aguardar hot reload (~5 segundos)

# 3. Usar no código
import MyPackage from 'my-package';

# 4. Atualizar package.json no host (opcional, já foi atualizado via volume)
```

### Debug de Erros

```bash
# 1. Ver logs em tempo real
docker logs utiliza-front-assistencia-app-1 -f

# 2. Se erro persistir, reiniciar
docker restart utiliza-front-assistencia-app-1

# 3. Verificar se container está saudável
docker ps | grep front
```

---

## 🎯 Casos de Uso Comuns

### Instalar Máscara de Moeda

```bash
docker exec utiliza-front-assistencia-app-1 npm install react-currency-input-field
```

### Instalar Biblioteca de Datas

```bash
docker exec utiliza-front-assistencia-app-1 npm install date-fns
```

### Instalar Ícones

```bash
docker exec utiliza-front-assistencia-app-1 npm install lucide-react
```

### Atualizar Dependência

```bash
docker exec utiliza-front-assistencia-app-1 npm update <package-name>
```

### Ver Todas as Dependências

```bash
docker exec utiliza-front-assistencia-app-1 npm list --depth=0
```

---

## 🔐 Informações do Container

| Propriedade | Valor |
|-------------|-------|
| **Nome** | `utiliza-front-assistencia-app-1` |
| **Imagem** | `utiliza-front-assistencia-app` |
| **Working Directory** | `/app` |
| **Porta Host** | `8080` |
| **Porta Container** | `8080` |
| **Volume Mount** | `/var/www/utiliza/utiliza-front-assistencia` → `/app` |
| **Dev Server** | Vite (http://localhost:8080) |
| **Node Modules** | `/app/node_modules/` |

---

## ✅ Checklist de Boas Práticas

- [x] Sempre use `docker exec` para `npm install/uninstall`
- [x] Verifique logs com `docker logs -f` para debug
- [x] Aguarde ~5 segundos após `npm install` para hot reload
- [x] Edite código no host, não precisa acessar o container
- [x] Use `docker restart` apenas se hot reload falhar
- [x] Não commit `node_modules/` (já está no .gitignore)
- [x] Verifique `docker ps` antes de reportar problemas

---

## 📚 Links Úteis

- **Vite Docs:** https://vitejs.dev/
- **Docker Docs:** https://docs.docker.com/
- **React Docs:** https://react.dev/

---

## 🆘 Ajuda Rápida

```bash
# Container não inicia?
docker start utiliza-front-assistencia-app-1

# Import não funciona?
docker exec utiliza-front-assistencia-app-1 npm install <package>

# Hot reload travou?
docker restart utiliza-front-assistencia-app-1

# Ver o que está acontecendo?
docker logs utiliza-front-assistencia-app-1 -f
```

---

**Última atualização:** 2026-02-09
