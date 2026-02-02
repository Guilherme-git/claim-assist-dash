# 📊 Mapeamento dos Dados Reais da API

## 🔄 O que mudou

### Antes (Dados Mockados)
```typescript
{
  id: "ATD-001",
  cliente: "Maria Silva",
  tipo: "Guincho",
  status: "em_andamento",
  prioridade: "alta",
  prestador: "João Santos",
  hora: "14:30",
  local: "Av. Paulista, 1000"
}
```

### Agora (Dados Reais da API)
```typescript
{
  id: 2492,
  phone: "556696163223",
  request_reason: "breakdown_by_mechanical_failure_or_electric",
  status: "finished",
  plataform: "whatsapp",
  origin_address: "R. Emanoel Araujo Carvalho, 436...",
  created_at: "2026-02-01T17:03:57.000Z",
  // ... outros campos
}
```

## 🗺️ Mapeamento de Campos

| Campo Antigo | Campo Novo API | Transformação |
|-------------|----------------|---------------|
| `cliente` | `phone` | Formatado: `(66) 96163-223` |
| `tipo` | `request_reason` | Traduzido para português |
| `status` | `status` | Traduzido e mapeado |
| `prioridade` | ❌ Não existe | Removido da tabela |
| `prestador` | ❌ Não existe | Removido da tabela |
| `hora` | `created_at` | Formatado: `14:30` |
| `local` | `origin_address` | Direto da API |

## 📋 Estrutura Completa da Interface

```typescript
export interface AssociateService {
  id: number;                          // ID do atendimento
  associate_car_id: number | null;     // ID do veículo associado
  retell_call_id: string | null;       // ID da chamada (se houver)
  ezchat_conversation_id: string | null; // ID da conversa
  association: string;                 // Associação (ex: "solidy")
  plataform: string;                   // whatsapp, telefone, etc.
  phone: string;                       // Telefone do cliente
  request_reason: string | null;       // Motivo da solicitação
  service_form: ServiceForm | null;    // Formulário de serviço
  origin_address: string | null;       // Endereço de origem
  origin_location: Location | null;    // Coordenadas de origem
  destination_address: string | null;  // Endereço de destino
  destination_location: Location | null; // Coordenadas de destino
  status: string;                      // Status do atendimento
  created_at: string;                  // Data/hora de criação
  updated_at: string;                  // Data/hora de atualização
}
```

## 🎨 Status Mapeados

| Status da API | Label na UI | Cor |
|--------------|-------------|-----|
| `finished` | Finalizado | Verde (outline) |
| `waiting_identification` | Aguardando Identificação | Cinza (secondary) |
| `answering_service_form` | Preenchendo Formulário | Azul (default) |
| `waiting_origin_location` | Aguardando Localização | Amarelo (secondary) |
| `canceled` | Cancelado | Vermelho (destructive) |

## 🏷️ Tipos de Solicitação (request_reason)

| Valor da API | Label na UI |
|-------------|-------------|
| `breakdown_by_mechanical_failure_or_electric` | Pane Mecânica/Elétrica |
| `locked_vehicle` | Chaveiro |
| `collision` | Colisão |
| `flat_tire` | Pneu Furado |

## 📞 Formatação de Telefone

```typescript
// Entrada: "556696163223"
// Saída: "(66) 96163-223"

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('55')) {
    const number = cleaned.substring(2);
    return `(${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7)}`;
  }
  return phone;
}
```

## 🕐 Formatação de Data/Hora

```typescript
// Entrada: "2026-02-01T17:03:57.000Z"
// Saída: "17:03"

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

## 📄 Paginação

A API retorna:
```typescript
{
  data: AssociateService[],  // Array de atendimentos
  pagination: {
    total: 1650,              // Total de registros
    current_page: 1,          // Página atual
    per_page: 10,             // Registros por página
    last_page: 165,           // Última página
    from: 1,                  // Registro inicial
    to: 10                    // Registro final
  }
}
```

## 🎯 Colunas da Tabela (Nova Estrutura)

1. **ID** - `#2492`
2. **Telefone** - `(66) 96163-223` (formatado)
3. **Tipo** - Badge com o tipo de solicitação
4. **Status** - Badge colorido com ícone
5. **Plataforma** - `whatsapp`, `telefone`, etc.
6. **Endereço Origem** - Endereço completo ou "—"
7. **Hora** - Hora de criação (14:30)
8. **Ações** - Menu dropdown

## 🔍 Campos Removidos vs Campos Novos

### ❌ Removidos (não existem na API)
- `prioridade` (baixa, média, alta, urgente)
- `prestador` (nome do prestador de serviço)
- `cliente` (nome do cliente)

### ✅ Adicionados (novos da API)
- `plataform` (whatsapp, telefone)
- `association` (solidy)
- `associate_car_id` (ID do veículo)
- `service_form` (formulário completo)
- `origin_location` (coordenadas GPS)
- `destination_location` (coordenadas GPS)

## 🧪 Exemplo de Requisição

```typescript
// Buscar página 1
const response = await atendimentosService.getAll(1);

// Retorno:
{
  data: [
    {
      id: 2492,
      phone: "556696163223",
      status: "finished",
      // ... outros campos
    }
  ],
  pagination: {
    total: 1650,
    current_page: 1,
    per_page: 10,
    // ...
  }
}
```

## 📊 ServiceForm (Formulário de Serviço)

Contém informações detalhadas do atendimento:

```typescript
{
  payload: {
    vehicle_cargo: "Não",
    associate_items: "Não",
    vehicle_symptom: "panela motor",
    vehicle_is_lowered: "Não",
    any_wheel_is_locked: "Não",
    number_of_passengers: "1",
    uber_will_be_necessary: "Não",
    vehicle_is_easily_accessible: "Sim",
    documents_and_key_are_in_scene: "Sim"
  },
  flow_token: "2975921d-5f88-48b0-98cd-13bdc77bf842"
}
```

## 🗺️ Location (Localização GPS)

```typescript
{
  type: "Point",
  coordinates: [-54.6124384, -16.4636749]  // [longitude, latitude]
}
```

## 🎬 Próximos Passos

1. ✅ **Dados sendo exibidos** - Funcionando!
2. 🔜 **Adicionar filtros** - Filtrar por status, tipo, etc.
3. 🔜 **Adicionar busca** - Buscar por ID ou telefone
4. 🔜 **Modal de detalhes** - Ver todos os dados ao clicar
5. 🔜 **Integração com mapa** - Mostrar localização GPS
6. 🔜 **Ações** - Ligar, ver detalhes, cancelar, etc.

## 📌 Observações Importantes

### Campos podem ser `null`
Muitos campos podem vir como `null` da API:
- `origin_address` - Se ainda não definiu local
- `request_reason` - Se ainda não escolheu tipo
- `service_form` - Se não preencheu formulário
- `associate_car_id` - Se não identificou veículo

### Tratamento de null
```typescript
// Sempre verificar antes de usar:
{atd.origin_address ? (
  <span>{atd.origin_address}</span>
) : (
  <span>—</span>
)}
```

### Status Dinâmicos
Se a API retornar um status novo que não está mapeado, o código usa um fallback:
```typescript
const statusInfo = statusConfig[atd.status] || {
  label: atd.status,
  variant: "secondary",
  icon: AlertCircle
};
```

## 🚀 Teste Agora!

1. Certifique-se que a API está rodando em `http://localhost:3001`
2. Acesse `http://localhost:8080/atendimentos`
3. Veja os dados reais carregando!
4. Navegue entre as páginas (botões Anterior/Próximo)
5. Veja os detalhes no menu "..." de cada linha

**Tudo funcionando!** 🎉
