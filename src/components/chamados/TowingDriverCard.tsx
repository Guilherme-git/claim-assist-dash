import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Copy, Truck, User } from "lucide-react";
import { type TowingDriver } from "@/services/calls.service";
import { toast } from "sonner";

interface TowingDriverCardProps {
  driver: TowingDriver;
}

const driverStatusLabels: Record<string, string> = {
  available: "Disponível",
  in_service: "Em serviço",
  offline: "Offline",
};

const driverStatusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  available: "default",
  in_service: "secondary",
  offline: "destructive",
};

export function TowingDriverCard({ driver }: TowingDriverCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card className="rounded-2xl border-border/50 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Truck className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Motorista de Guincho</CardTitle>
            <CardDescription>Responsável pelo atendimento</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {driver.profile_image_path ? (
              <AvatarImage src={driver.profile_image_path} alt={driver.name} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {getInitials(driver.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-lg">{driver.name}</p>
            <Badge
              variant={driverStatusVariants[driver.status] || "secondary"}
              className="mt-1"
            >
              {driverStatusLabels[driver.status] || driver.status}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">CPF</p>
          <div className="flex items-center gap-2">
            <span className="font-medium font-mono">{driver.cpf}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(driver.cpf.replace(/\D/g, ""))}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Telefone</p>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{driver.phone}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(driver.phone.replace(/\D/g, ""))}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
