import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { AssociateService } from '@/services/atendimentos.service';

interface WebSocketEvent {
  timestamp: string;
  event: string;
  data: AssociateService;
}

interface UseWebSocketOptions {
  onAssociateServiceCreated?: (data: AssociateService) => void;
  onAssociateServiceUpdated?: (data: AssociateService) => void;
  enabled?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onAssociateServiceCreated, onAssociateServiceUpdated, enabled = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Armazena callbacks em refs para evitar reconexões
  const onCreatedRef = useRef(onAssociateServiceCreated);
  const onUpdatedRef = useRef(onAssociateServiceUpdated);

  // Atualiza refs quando callbacks mudam
  useEffect(() => {
    onCreatedRef.current = onAssociateServiceCreated;
    onUpdatedRef.current = onAssociateServiceUpdated;
  }, [onAssociateServiceCreated, onAssociateServiceUpdated]);

  useEffect(() => {
    if (!enabled) {
      // Se desabilitado e havia conexão, desconecta
      if (socketRef.current) {
        console.log('👋 Desconectando WebSocket (disabled)...');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Se já está conectado, não reconecta
    if (socketRef.current?.connected) {
      return;
    }

    // Configuração da URL do WebSocket
    const WEBSOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    console.log('🔌 Conectando ao WebSocket em', WEBSOCKET_URL);

    // Cria a conexão WebSocket
    const socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    // Evento: Conexão estabelecida
    socket.on('connect', () => {
      console.log('✅ Conectado ao WebSocket. ID:', socket.id);
      setIsConnected(true);
    });

    // Evento: Desconexão
    socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado do WebSocket:', reason);
      setIsConnected(false);
    });

    // Evento: Erro de conexão
    socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão WebSocket:', error.message);
      setIsConnected(false);
    });

    // Evento: Tentativa de reconexão
    socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Tentando reconectar... (tentativa ${attempt})`);
    });

    // Evento: Reconexão bem-sucedida
    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconectado após ${attemptNumber} tentativas`);
      setIsConnected(true);
    });

    // Escuta: Novo atendimento criado
    socket.on('associate_service:created', (payload: WebSocketEvent) => {
      console.log('\n📥 NOVO ATENDIMENTO RECEBIDO VIA WEBSOCKET!');
      console.log('═══════════════════════════════════════');
      console.log('Timestamp:', payload.timestamp);
      console.log('ID do Atendimento:', payload.data.id);
      console.log('Status:', payload.data.status);
      console.log('Associação:', payload.data.association);
      console.log('Telefone:', payload.data.phone);
      console.log('═══════════════════════════════════════\n');

      if (onCreatedRef.current) {
        onCreatedRef.current(payload.data);
      }
    });

    // Escuta: Atendimento atualizado
    socket.on('associate_service:updated', (payload: WebSocketEvent) => {
      console.log('\n📝 ATENDIMENTO ATUALIZADO VIA WEBSOCKET!');
      console.log('═══════════════════════════════════════');
      console.log('Timestamp:', payload.timestamp);
      console.log('ID do Atendimento:', payload.data.id);
      console.log('Status:', payload.data.status);
      console.log('═══════════════════════════════════════\n');

      if (onUpdatedRef.current) {
        onUpdatedRef.current(payload.data);
      }
    });

    // Cleanup ao desmontar
    return () => {
      console.log('👋 Desconectando WebSocket...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled]); // Apenas 'enabled' como dependência

  return {
    isConnected,
    socket: socketRef.current,
  };
}
