import { useState, useEffect, useRef } from "react";
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
import type { AssociateService } from "@/services/atendimentos.service";

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

// Simula mensagens baseadas no status e dados do atendimento
function generateMockMessages(atendimento: AssociateService): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const baseTime = new Date(atendimento.created_at);
  
  // Mensagem inicial da IA
  messages.push({
    id: "1",
    role: "ai",
    content: "Olá! Sou a assistente virtual da Utiliza. Como posso ajudá-lo hoje?",
    timestamp: new Date(baseTime.getTime()),
  });

  // Resposta do usuário
  messages.push({
    id: "2",
    role: "user",
    content: "Preciso de assistência, meu carro parou.",
    timestamp: new Date(baseTime.getTime() + 30000),
  });

  // IA pede identificação
  messages.push({
    id: "3",
    role: "ai",
    content: "Entendi! Para dar continuidade ao atendimento, preciso confirmar alguns dados. Qual o CPF do titular?",
    timestamp: new Date(baseTime.getTime() + 45000),
  });

  // Usuário responde CPF
  if (atendimento.associate_cars?.associates?.cpf) {
    messages.push({
      id: "4",
      role: "user",
      content: atendimento.associate_cars.associates.cpf,
      timestamp: new Date(baseTime.getTime() + 60000),
    });

    messages.push({
      id: "5",
      role: "ai",
      content: `Perfeito! Encontrei seu cadastro, ${atendimento.associate_cars.associates.name || "associado"}. Qual o motivo do seu acionamento?`,
      timestamp: new Date(baseTime.getTime() + 75000),
    });
  }

  // Motivo do pedido
  if (atendimento.request_reason) {
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

    messages.push({
      id: "6",
      role: "user",
      content: reasonLabels[atendimento.request_reason] || atendimento.request_reason,
      timestamp: new Date(baseTime.getTime() + 90000),
    });

    messages.push({
      id: "7",
      role: "ai",
      content: "Entendido. Preciso fazer algumas perguntas para direcionar melhor o atendimento.",
      timestamp: new Date(baseTime.getTime() + 105000),
    });
  }

  // Localização de origem
  if (atendimento.origin_address) {
    messages.push({
      id: "8",
      role: "ai",
      content: "Qual a sua localização atual? Pode enviar o endereço ou compartilhar a localização.",
      timestamp: new Date(baseTime.getTime() + 120000),
    });

    messages.push({
      id: "9",
      role: "user",
      content: atendimento.origin_address,
      timestamp: new Date(baseTime.getTime() + 150000),
    });
  }

  // Localização de destino
  if (atendimento.destination_address) {
    messages.push({
      id: "10",
      role: "ai",
      content: "E para onde o veículo deve ser levado?",
      timestamp: new Date(baseTime.getTime() + 165000),
    });

    messages.push({
      id: "11",
      role: "user",
      content: atendimento.destination_address,
      timestamp: new Date(baseTime.getTime() + 195000),
    });
  }

  // Status finalizado
  if (atendimento.status === "finished" || atendimento.status === "transferred") {
    messages.push({
      id: "12",
      role: "ai",
      content: "Perfeito! Seu chamado foi registrado com sucesso. Um prestador será acionado em breve. Obrigado por utilizar nossos serviços!",
      timestamp: new Date(baseTime.getTime() + 210000),
    });
  }

  return messages;
}

export function ChatModal({ open, onOpenChange, atendimento }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gera mensagens quando atendimento muda
  useEffect(() => {
    if (atendimento) {
      const mockMessages = generateMockMessages(atendimento);
      setMessages(mockMessages);
      setDisplayedMessages([]);
    }
  }, [atendimento]);

  // Efeito de "tempo real" - adiciona mensagens uma a uma
  useEffect(() => {
    if (!open || messages.length === 0) return;

    setDisplayedMessages([]);
    let index = 0;

    const interval = setInterval(() => {
      if (index < messages.length) {
        setDisplayedMessages((prev) => [...prev, messages[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [open, messages]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  if (!atendimento) return null;

  const associateName = atendimento.associate_cars?.associates?.name || "Associado";
  const associatePhone = atendimento.associate_cars?.associates?.phone || atendimento.phone;

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
                  #{atendimento.id}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDateTime(atendimento.created_at)}
            </div>
          </div>
        </DialogHeader>

        {/* Área de mensagens */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="py-4 space-y-3">
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

            {/* Indicador de digitando */}
            {displayedMessages.length < messages.length && (
              <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer info */}
        <div className="px-4 py-3 border-t bg-muted/30 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Plataforma: <strong className="capitalize">{atendimento.plataform}</strong></span>
            <span>Cliente: <strong className="capitalize">{atendimento.association}</strong></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
