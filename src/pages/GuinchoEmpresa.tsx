import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const GuinchoEmpresa = () => {
  return (
    <DashboardLayout title="Guincho Empresa" subtitle="Gerencie as empresas de guincho cadastradas">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Guincho Empresa</h1>
          <p className="text-muted-foreground">Gerencie as empresas de guincho cadastradas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresas de Guincho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GuinchoEmpresa;
