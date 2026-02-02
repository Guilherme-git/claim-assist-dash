# 🧪 Como Testar a Conexão da API

## ✅ O que foi feito

### 1. **Serviço criado**
- Arquivo: `src/services/atendimentos.service.ts`
- Rota da API: `http://localhost:3001/associate-services`
- Método: `GET`

### 2. **Página atualizada**
- Arquivo: `src/pages/Atendimentos.tsx`
- Os dados agora vêm da API (não mais mockados)
- Estados de loading, erro e vazio implementados

## 🚀 Como Testar

### Passo 1: Certifique-se que a API está rodando

```bash
# A API backend deve estar rodando em:
# http://localhost:3001
```

Teste se a API está respondendo:
```bash
curl http://localhost:3001/associate-services
```

### Passo 2: Acesse a página de Atendimentos

```
http://localhost:8080/atendimentos
```

## 🔍 O que você vai ver

### ⏳ Se estiver carregando:
- Spinner animado com texto "Carregando atendimentos..."

### ❌ Se der erro:
- Ícone de alerta vermelho
- Mensagem: "Erro ao carregar dados"
- Botão "Tentar Novamente"
- **Motivos possíveis:**
  - API não está rodando em `http://localhost:3001`
  - Endpoint `/associate-services` não existe
  - CORS bloqueando a requisição

### ✅ Se funcionar:
- Tabela com todos os atendimentos da API
- Cada linha mostra: ID, Cliente, Tipo, Status, etc.

### 📭 Se não houver dados:
- Mensagem: "Nenhum atendimento encontrado"

## 🔧 Verificar no Console do Navegador

Abra o DevTools (F12) e veja a aba **Console**:

```javascript
// Se der erro, você verá algo como:
Erro ao buscar atendimentos: AxiosError {...}

// Se funcionar, não deve ter erro
```

Veja a aba **Network**:
- Procure por uma requisição para `associate-services`
- Status deve ser `200 OK`
- Response deve mostrar os dados JSON

## 📊 Formato Esperado da API

A API deve retornar um array de objetos neste formato:

```json
[
  {
    "id": "ATD-001",
    "cliente": "Maria Silva",
    "tipo": "Guincho",
    "status": "em_andamento",
    "prioridade": "alta",
    "prestador": "João Santos",
    "hora": "14:30",
    "local": "Av. Paulista, 1000"
  }
]
```

### Valores aceitos:

**Status:**
- `em_andamento`
- `aguardando`
- `concluido`
- `cancelado`

**Prioridade:**
- `baixa`
- `media`
- `alta`
- `urgente`

## 🐛 Problemas Comuns

### Erro: "Network Error"
**Solução:** Verifique se a API está rodando:
```bash
# Terminal 1: Backend
cd /caminho/para/backend
npm start  # ou yarn start

# Terminal 2: Frontend
cd /var/www/utiliza/utiliza-front-assistencia
npm run dev
```

### Erro: "CORS policy"
**Solução:** Configure CORS no backend:
```javascript
// No backend (Express.js exemplo)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080'
}));
```

### Erro: 404 Not Found
**Solução:** Verifique se a rota existe no backend:
```javascript
// Deve ter algo assim no backend:
app.get('/associate-services', (req, res) => {
  // retornar dados
});
```

## 📝 Próximos Passos

Depois que funcionar, você pode:

1. **Adicionar filtros** - Filtrar por status, tipo, etc.
2. **Adicionar busca** - Buscar por cliente ou ID
3. **Adicionar paginação** - Se tiver muitos dados
4. **Adicionar refresh automático** - Atualizar a cada X segundos
5. **Criar outros serviços** - Para POST, PUT, DELETE

## 🔄 Exemplo de Refresh Automático

Se quiser atualizar os dados a cada 30 segundos:

```typescript
useEffect(() => {
  fetchAtendimentos();

  // Atualiza a cada 30 segundos
  const interval = setInterval(() => {
    fetchAtendimentos();
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

## ✨ Testando Agora

1. ✅ Certifique-se que o backend está rodando
2. ✅ Acesse: `http://localhost:8080/atendimentos`
3. ✅ Abra o DevTools (F12) → Aba Network
4. ✅ Veja se a requisição `associate-services` aparece
5. ✅ Verifique se retornou status 200

**Qualquer erro, olhe a mensagem no console do navegador!**
