import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Phone, Clock } from "lucide-react";
import { formatPhone, formatDateTime } from "@/lib/utils";
import { atendimentosService, type AssociateService } from "@/services/atendimentos.service";
import { useWebSocket } from "@/hooks/useWebSocket";

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
}

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atendimento: AssociateService | null;
}

// Labels para o service_form
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

// Gera mensagens baseadas nos dados reais do atendimento
function generateMessagesFromData(atendimento: AssociateService): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const baseTime = new Date(atendimento.created_at);
  let timeOffset = 0;
  let msgId = 1;

  // Mensagem inicial da IA
  messages.push({
    id: String(msgId++),
    role: "ai",
    content: "Olá! Sou a assistente virtual da Utiliza. Como posso ajudá-lo hoje?",
    timestamp: new Date(baseTime.getTime() + timeOffset),
  });
  timeOffset += 15000;

  console.log('🚗 DEBUG PLACA - associate_cars:', atendimento.associate_cars);
  console.log('🚗 DEBUG PLACA - plate:', atendimento.associate_cars?.plate);

  // Solicita a placa do veículo
  messages.push({
    id: String(msgId++),
    role: "ai",
    content: "Então DIGITE SOMENTE A PLACA do veículo para darmos continuidade ao atendimento. 👇🏼",
    timestamp: new Date(baseTime.getTime() + timeOffset),
  });
  timeOffset += 10000;
  console.log('✅ Mensagem de solicitação da placa adicionada');

  // Placa do veículo (se disponível)
  if (atendimento.associate_cars?.plate) {
    console.log('✅ Adicionando resposta com a placa:', atendimento.associate_cars.plate);
    messages.push({
      id: String(msgId++),
      role: "user",
      content: atendimento.associate_cars.plate,
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 10000;
  } else {
    console.log('⚠️ Placa não encontrada');
  }

  // Se tem request_reason, adiciona as mensagens de identificação e motivo
  if (atendimento.request_reason) {
    // Pergunta sobre o motivo do contato
    messages.push({
      id: String(msgId++),
      role: "ai",
      content: "Qual o motivo do contato?",
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 10000;

    // Motivo do acionamento
    messages.push({
      id: String(msgId++),
      role: "user",
      content: reasonLabels[atendimento.request_reason] || atendimento.request_reason,
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 10000;

    messages.push({
      id: String(msgId++),
      role: "ai",
      content: "Entendido. Preciso fazer algumas perguntas para direcionar melhor o atendimento.",
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 10000;
  }

  // Processa service_form (respostas do formulário)
  const raw = atendimento.service_form;
  console.log('🔍 DEBUG - service_form RAW:', raw);

  let serviceFormPayload: Record<string, string> | undefined;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    const nested = obj.payload;
    if (nested != null && typeof nested === "object" && !Array.isArray(nested)) {
      console.log('📦 service_form formato aninhado (payload):', nested);
      serviceFormPayload = nested as Record<string, string>;
    } else {
      const { flow_token: _ft, ...rest } = obj;
      const flat = rest as Record<string, string>;
      console.log('📦 service_form formato plano:', flat);
      serviceFormPayload = Object.keys(flat).length > 0 ? flat : undefined;
    }
  }

  console.log('✅ serviceFormPayload final:', serviceFormPayload);

  // Adiciona perguntas e respostas do service_form
  if (serviceFormPayload) {
    console.log(`📝 Processando ${Object.keys(serviceFormPayload).length} campos do service_form`);
    Object.entries(serviceFormPayload).forEach(([key, value]) => {
      console.log(`  - Campo: ${key} = ${value}`);
      if (value && value !== "" && value !== "null") {
        const question = serviceFormLabels[key] || key.replace(/_/g, " ");

        messages.push({
          id: String(msgId++),
          role: "ai",
          content: question,
          timestamp: new Date(baseTime.getTime() + timeOffset),
        });
        timeOffset += 10000;

        messages.push({
          id: String(msgId++),
          role: "user",
          content: String(value),
          timestamp: new Date(baseTime.getTime() + timeOffset),
        });
        timeOffset += 8000;
      } else {
        console.log(`  ⚠️ Campo ${key} ignorado (valor vazio ou null)`);
      }
    });
  } else {
    console.log('❌ Nenhum serviceFormPayload encontrado');
  }

  // Localização de origem
  if (atendimento.origin_address) {
    messages.push({
      id: String(msgId++),
      role: "ai",
      content: "Por gentileza, me envie sua localização atual",
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 15000;

    messages.push({
      id: String(msgId++),
      role: "user",
      content: atendimento.origin_address,
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 10000;
  }

  // Localização de destino
  if (atendimento.destination_address) {
    messages.push({
      id: String(msgId++),
      role: "ai",
      content: "Agora me envie a localização de destino",
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 15000;

    messages.push({
      id: String(msgId++),
      role: "user",
      content: atendimento.destination_address,
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
    timeOffset += 10000;
  }

  // Mensagem final baseada no status
  if (atendimento.status === "finished" || atendimento.status === "transferred") {
    messages.push({
      id: String(msgId++),
      role: "ai",
      content: "Perfeito! Seu chamado foi registrado com sucesso. Um prestador será acionado em breve. Obrigado por utilizar nossos serviços!",
      timestamp: new Date(baseTime.getTime() + timeOffset),
    });
  }

  console.log(`📊 Total de mensagens geradas: ${messages.length}`);
  console.log('📋 Mensagens:', messages.map(m => `[${m.role}] ${m.content.substring(0, 50)}...`));

  return messages;
}

export function ChatModal({ open, onOpenChange, atendimento }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [currentAtendimento, setCurrentAtendimento] = useState<AssociateService | null>(atendimento);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // DEBUG: Log de renderização
  console.log(`🎨 RENDER #${Date.now()} - displayedMessages: ${displayedMessages.length} itens`,
    displayedMessages.map(m => `[${m.id}:${m.role}]`).join(', '));

  // Reset ao abrir/fechar modal
  useEffect(() => {
    if (open) {
      setIsInitialLoad(true);
      setDisplayedMessages([]);
    }
  }, [open]);

  // Função para atualizar atendimento
  const updateAtendimento = useCallback(async () => {
    if (!atendimento) return;

    console.log('🔄 updateAtendimento chamado para ID:', atendimento.id);
    try {
      const updated = await atendimentosService.getById(String(atendimento.id));
      setCurrentAtendimento(updated);
      const newMessages = generateMessagesFromData(updated);
      console.log(`🔢 Gerando ${newMessages.length} novas mensagens`);
      setMessages(newMessages);
    } catch (error) {
      console.error('Erro ao buscar atendimento:', error);
    }
  }, [atendimento]);

  // Busca inicial ao abrir o modal
  useEffect(() => {
    if (open && atendimento) {
      console.log(`🔍 Carregando conversa do atendimento #${atendimento.id}...`);
      updateAtendimento();
    }
  }, [open, atendimento, updateAtendimento]);

  // Callback estável para o WebSocket
  const handleAssociateServiceUpdated = useCallback((updatedAtendimento) => {
    // Só atualiza se for o atendimento que está sendo visualizado
    if (open && atendimento && updatedAtendimento.id === atendimento.id) {
      console.log(`📝 Conversa atualizada via WebSocket - Atendimento #${atendimento.id}`);
      console.log('🔄 Atualizando histórico de mensagens...');
      updateAtendimento();
    }
  }, [open, atendimento, updateAtendimento]);

  // WebSocket: escuta atualizações do atendimento específico em tempo real
  const { isConnected } = useWebSocket({
    onAssociateServiceUpdated: handleAssociateServiceUpdated,
    enabled: open, // Só conecta quando o modal está aberto
  });

  // Efeito de "tempo real" - adiciona mensagens uma a uma
  useEffect(() => {
    console.log(`🎬 Efeito de exibição #${Date.now()} - open: ${open}, messages: ${messages.length}, isInitialLoad: ${isInitialLoad}, displayed: ${displayedMessages.length}`);

    if (!open || messages.length === 0) {
      console.log('⏸️ Efeito pausado (modal fechado ou sem mensagens)');
      return;
    }

    // Se não há mensagens novas, não faz nada
    if (messages.length <= displayedMessages.length) {
      console.log('⏸️ Sem mensagens novas para exibir');
      return;
    }

    let isCancelled = false;

    // Se é o carregamento inicial, começa do zero
    if (isInitialLoad) {
      console.log(`▶️ Iniciando animação inicial de ${messages.length} mensagens`);
      setDisplayedMessages([]);
      let index = 0;

      const showNextMessage = () => {
        if (isCancelled) {
          console.log('⛔ Animação cancelada');
          return;
        }

        if (index < messages.length) {
          const currentMessage = messages[index];
          console.log(`  📨 Exibindo mensagem ${index + 1}/${messages.length}: [${currentMessage.role}] ${currentMessage.content.substring(0, 30)}...`);
          setDisplayedMessages((prev) => [...prev, currentMessage]);
          index++;

          // Define o delay para a próxima mensagem
          if (index < messages.length) {
            const currentDelay = 1000;
            setTimeout(showNextMessage, currentDelay);
          } else {
            console.log('✅ Animação inicial completa');
            setIsInitialLoad(false);
          }
        }
      };

      setTimeout(showNextMessage, 0);
    } else {
      // Animação de mensagens novas (WebSocket)
      const newMessagesCount = messages.length - displayedMessages.length;
      console.log(`➕ Animando ${newMessagesCount} novas mensagens via WebSocket`);
      let index = displayedMessages.length;

      const showNextMessage = () => {
        if (isCancelled) {
          console.log('⛔ Animação de novas mensagens cancelada');
          return;
        }

        if (index < messages.length) {
          const currentMessage = messages[index];
          console.log(`  📨 Exibindo nova mensagem ${index + 1}/${messages.length}: [${currentMessage.role}] ${currentMessage.content.substring(0, 30)}...`);
          setDisplayedMessages((prev) => [...prev, currentMessage]);
          index++;

          // Define o delay para a próxima mensagem
          if (index < messages.length) {
            const currentDelay = 1000;
            setTimeout(showNextMessage, currentDelay);
          } else {
            console.log('✅ Novas mensagens exibidas');
          }
        }
      };

      // Aguarda um tempo antes de mostrar a primeira mensagem nova
      // para dar tempo de exibir o indicador de "digitando"
      const initialDelay = 1000;
      setTimeout(showNextMessage, initialDelay);
    }

    return () => {
      console.log('🧹 Limpando animação - marcando como cancelada');
      isCancelled = true;
    };
  }, [open, messages, isInitialLoad]); // Removido displayedMessages.length

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  if (!currentAtendimento) return null;

  const associateName = currentAtendimento.associate_cars?.associates?.name || "Associado";
  const associatePhone = currentAtendimento.associate_cars?.associates?.phone || currentAtendimento.phone;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        {/* Header estilo WhatsApp */}
        <DialogHeader className="px-4 py-3 bg-primary/5 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {associateName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-base font-semibold">
                {associateName}
              </DialogTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {formatPhone(associatePhone)}
                <span className="mx-1">•</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  #{currentAtendimento.id}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDateTime(currentAtendimento.created_at)}
            </div>
          </div>
        </DialogHeader>

        {/* Área de mensagens */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="py-4 space-y-3">
            {(() => {
              console.log(`🖼️ Renderizando ${displayedMessages.length} mensagens no DOM`);
              const ids = displayedMessages.map(m => m.id);
              const uniqueIds = new Set(ids);
              if (ids.length !== uniqueIds.size) {
                console.warn(`⚠️ DUPLICAÇÃO DETECTADA! IDs duplicados:`, ids);
              }
              return null;
            })()}
            {displayedMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 animate-in slide-in-from-bottom-2 duration-300 ${
                  message.role === "ai" ? "justify-start" : "justify-end"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.role === "ai" && (
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    message.role === "ai"
                      ? "bg-muted text-foreground rounded-bl-md"
                      : "bg-primary text-primary-foreground rounded-br-md"
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <span
                    className={`text-[10px] mt-1 block ${
                      message.role === "ai"
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Indicador de digitando - estilo ondas sonoras */}
            {displayedMessages.length < messages.length && (() => {
              const nextMessage = messages[displayedMessages.length];
              const isAI = nextMessage.role === "ai";

              return (
                <div className={`flex items-end gap-2 ${isAI ? "justify-start" : "justify-end"}`}>
                  {isAI && (
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`px-4 py-3 rounded-2xl ${
                    isAI
                      ? "bg-muted rounded-bl-md"
                      : "bg-primary/20 rounded-br-md"
                  }`}>
                    <div className="flex items-center gap-[3px] h-5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`w-[3px] rounded-full animate-sound-wave ${
                            isAI ? "bg-primary/60" : "bg-primary/80"
                          }`}
                          style={{
                            animationDelay: `${i * 120}ms`,
                            height: "100%",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {!isAI && (
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })()}
          </div>
        </ScrollArea>

        {/* Footer info */}
        <div className="px-4 py-3 border-t bg-muted/30 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Plataforma: <strong className="capitalize">{currentAtendimento.plataform}</strong></span>
            <span>Cliente: <strong className="capitalize">{currentAtendimento.association}</strong></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
