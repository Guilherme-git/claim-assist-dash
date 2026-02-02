# 📡 Guia de Uso da API

## 🚀 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (já criado):

```env
VITE_API_URL=http://localhost:3001
```

**Importante:** No Vite, todas as variáveis devem começar com `VITE_`

### 2. Estrutura de Arquivos

```
src/
├── lib/
│   └── api.ts              # Configuração do Axios
└── services/
    └── example.service.ts  # Exemplos de uso
```

## 📚 Como Usar

### Método 1: Importação Direta

```typescript
import api from '@/lib/api';

// GET
const response = await api.get('/endpoint');

// POST
const response = await api.post('/endpoint', { data });

// PUT
const response = await api.put('/endpoint/1', { data });

// DELETE
const response = await api.delete('/endpoint/1');
```

### Método 2: Criar Serviços (Recomendado)

Crie arquivos em `src/services/`:

```typescript
// src/services/atendimentos.service.ts
import api from '@/lib/api';

export interface Atendimento {
  id: number;
  cliente: string;
  status: string;
  data: string;
}

export const atendimentosService = {
  getAll: async (): Promise<Atendimento[]> => {
    const { data } = await api.get<Atendimento[]>('/atendimentos');
    return data;
  },

  getById: async (id: number): Promise<Atendimento> => {
    const { data } = await api.get<Atendimento>(`/atendimentos/${id}`);
    return data;
  },

  create: async (atendimento: Omit<Atendimento, 'id'>): Promise<Atendimento> => {
    const { data } = await api.post<Atendimento>('/atendimentos', atendimento);
    return data;
  },

  update: async (id: number, atendimento: Partial<Atendimento>): Promise<Atendimento> => {
    const { data } = await api.put<Atendimento>(`/atendimentos/${id}`, atendimento);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/atendimentos/${id}`);
  },
};
```

### Método 3: Com React Query (Melhor Prática)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atendimentosService } from '@/services/atendimentos.service';

function AtendimentosPage() {
  const queryClient = useQueryClient();

  // GET com cache automático
  const { data: atendimentos, isLoading, error } = useQuery({
    queryKey: ['atendimentos'],
    queryFn: atendimentosService.getAll,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  // POST/PUT/DELETE com invalidação de cache
  const createMutation = useMutation({
    mutationFn: atendimentosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: atendimentosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      cliente: 'João Silva',
      status: 'Pendente',
      data: new Date().toISOString(),
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados</div>;

  return (
    <div>
      <button onClick={handleCreate}>Novo Atendimento</button>
      {atendimentos?.map(atendimento => (
        <div key={atendimento.id}>
          {atendimento.cliente}
          <button onClick={() => handleDelete(atendimento.id)}>Deletar</button>
        </div>
      ))}
    </div>
  );
}
```

## 🔒 Autenticação

O interceptor já está configurado para adicionar o token automaticamente:

```typescript
// Login
const { data } = await api.post('/auth/login', { email, password });
localStorage.setItem('token', data.token);

// Logout
localStorage.removeItem('token');
```

## ⚙️ Funcionalidades Incluídas

✅ **Interceptor de Request**
- Adiciona token JWT automaticamente nas requisições
- Lê do `localStorage.getItem('token')`

✅ **Interceptor de Response**
- Tratamento automático de erros 401, 403, 404, 500
- Redirect para `/auth` em caso de token inválido
- Logs de erro no console

✅ **Timeout**
- Configurado para 10 segundos
- Ajuste em `src/lib/api.ts` se necessário

✅ **Headers Padrão**
- `Content-Type: application/json`

## 🔧 Configurações Avançadas

### Mudar URL da API

```bash
# .env
VITE_API_URL=https://api.producao.com
```

### Adicionar Headers Customizados

```typescript
// Requisição específica
api.get('/endpoint', {
  headers: {
    'X-Custom-Header': 'valor',
  },
});

// Globalmente
api.defaults.headers.common['X-Custom-Header'] = 'valor';
```

### Upload de Arquivos

```typescript
const formData = new FormData();
formData.append('file', file);

await api.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Query Parameters

```typescript
// Opção 1: Manualmente
await api.get('/users?status=active&page=1');

// Opção 2: Com params
await api.get('/users', {
  params: {
    status: 'active',
    page: 1,
  },
});
```

## 🐛 Tratamento de Erros

```typescript
try {
  const data = await atendimentosService.getAll();
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Erro do Axios
    if (error.response) {
      // Servidor respondeu com erro
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // Requisição enviada mas sem resposta
      console.error('Sem resposta do servidor');
    } else {
      // Erro ao configurar requisição
      console.error('Erro:', error.message);
    }
  }
}
```

## 📝 Boas Práticas

1. **Sempre use TypeScript** para definir tipos de resposta
2. **Crie serviços** ao invés de fazer chamadas diretas
3. **Use React Query** para cache e sincronização
4. **Trate erros** adequadamente em cada componente
5. **Não commite o .env** (já está no .gitignore)
6. **Use variáveis de ambiente** para URLs diferentes (dev, staging, prod)

## 🔗 Próximos Passos

1. Substitua os exemplos em `example.service.ts` pelos seus endpoints reais
2. Configure o React Query no `main.tsx` se ainda não estiver
3. Teste a conexão com sua API em `http://localhost:3001`
