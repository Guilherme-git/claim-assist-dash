import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  ArrowRightLeft,
  User as UserIcon,
  Loader2,
  Check,
} from "lucide-react";
import { callsService, type User, type Call } from "@/services/calls.service";

interface TransferCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  call: Call | null;
  onSuccess?: () => void;
}

export function TransferCallModal({ open, onOpenChange, call, onSuccess }: TransferCallModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset ao abrir o modal
  useEffect(() => {
    if (open) {
      setSelectedUser(null);
      setSearchQuery("");
      setUsers([]);
    }
  }, [open]);

  // Buscar usuários conforme o usuário digita (com debounce)
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
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTransfer = async () => {
    if (!selectedUser || !call) return;

    setIsTransferring(true);
    try {
      await callsService.transferCall(call.id, selectedUser.id);

      toast({
        title: "Chamado transferido com sucesso!",
        description: `Chamado #CH-${call.id} foi transferido para ${selectedUser.name}.`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao transferir chamado:", error);
      toast({
        variant: "destructive",
        title: "Erro ao transferir chamado",
        description: error?.response?.data?.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsTransferring(false);
    }
  };


  const getUserInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Transferir Chamado
          </DialogTitle>
          <DialogDescription>
            {call && `Selecione o atendente para transferir o chamado #CH-${call.id}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Informações do Chamado */}
          {call && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chamado:</span>
                  <span className="font-mono font-medium">#{call.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Associado:</span>
                  <span className="font-medium">
                    {call.associate_cars?.associates?.name || "—"}
                  </span>
                </div>
                {call.users && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Atendente Atual:</span>
                    <span className="font-medium">{call.users.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seleção de Usuário */}
          <div className="space-y-2">
            <Label>
              Atendente <span className="text-destructive">*</span>
            </Label>

            <div className="rounded-lg border">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Buscar por nome ou email..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>
                    {searchQuery.length < 2
                      ? "Digite pelo menos 2 caracteres para buscar"
                      : isLoadingUsers
                        ? "Buscando..."
                        : "Nenhum usuário encontrado."}
                  </CommandEmpty>
                  <ScrollArea className="max-h-[300px]">
                    <CommandGroup>
                      {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name}
                            onSelect={() => setSelectedUser(user)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-8 w-8 bg-primary/10">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                  {getUserInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  selectedUser?.id === user.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isTransferring}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!selectedUser || isTransferring}
            >
              {isTransferring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transferir Chamado
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
