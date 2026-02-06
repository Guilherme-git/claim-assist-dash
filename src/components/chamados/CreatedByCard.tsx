import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Mail, Copy } from "lucide-react";
import { type CallUser } from "@/services/calls.service";
import { toast } from "sonner";

interface CreatedByCardProps {
  user: CallUser;
}

export function CreatedByCard({ user }: CreatedByCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  return (
    <Card className="rounded-2xl border-border/50 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <UserCog className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Atribuído para</CardTitle>
            <CardDescription>Operador responsável</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Nome</p>
          <p className="font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">E-mail</p>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm break-all">{user.email}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => copyToClipboard(user.email)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
