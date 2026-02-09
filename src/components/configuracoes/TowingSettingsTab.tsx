import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CurrencyInput from "react-currency-input-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, DollarSign, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  towingSettingsService,
  type TowingSetting,
  type CreateTowingSettingPayload,
  type UpdateTowingSettingPayload,
} from "@/services/towingSettings.service";

// Lista de UFs (pode ser movida para um arquivo separado se necessário)
const UFS = [
  { id: 1, code: "AC", name: "Acre" },
  { id: 2, code: "AL", name: "Alagoas" },
  { id: 3, code: "AP", name: "Amapá" },
  { id: 4, code: "AM", name: "Amazonas" },
  { id: 5, code: "BA", name: "Bahia" },
  { id: 6, code: "CE", name: "Ceará" },
  { id: 7, code: "DF", name: "Distrito Federal" },
  { id: 8, code: "ES", name: "Espírito Santo" },
  { id: 9, code: "GO", name: "Goiás" },
  { id: 10, code: "MA", name: "Maranhão" },
  { id: 11, code: "MT", name: "Mato Grosso" },
  { id: 12, code: "MS", name: "Mato Grosso do Sul" },
  { id: 13, code: "MG", name: "Minas Gerais" },
  { id: 14, code: "PA", name: "Pará" },
  { id: 15, code: "PB", name: "Paraíba" },
  { id: 16, code: "PR", name: "Paraná" },
  { id: 17, code: "PE", name: "Pernambuco" },
  { id: 18, code: "PI", name: "Piauí" },
  { id: 19, code: "RJ", name: "Rio de Janeiro" },
  { id: 20, code: "RN", name: "Rio Grande do Norte" },
  { id: 21, code: "RS", name: "Rio Grande do Sul" },
  { id: 22, code: "RO", name: "Rondônia" },
  { id: 23, code: "RR", name: "Roraima" },
  { id: 24, code: "SC", name: "Santa Catarina" },
  { id: 25, code: "SP", name: "São Paulo" },
  { id: 26, code: "SE", name: "Sergipe" },
  { id: 27, code: "TO", name: "Tocantins" },
];

export function TowingSettingsTab() {
  const [settings, setSettings] = useState<TowingSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TowingSetting | null>(null);
  const [formData, setFormData] = useState({
    uf_id: "",
    excess_km_price: "",
    departure_price: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TowingSetting | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await towingSettingsService.getAll();
      setSettings(response.data);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: TowingSetting) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        uf_id: item.uf.id.toString(),
        excess_km_price: item.excess_km_price.toString(),
        departure_price: item.departure_price.toString(),
      });
    } else {
      setEditingItem(null);
      setFormData({
        uf_id: "",
        excess_km_price: "",
        departure_price: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      uf_id: "",
      excess_km_price: "",
      departure_price: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.excess_km_price || !formData.departure_price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!editingItem && !formData.uf_id) {
      toast({
        title: "Erro",
        description: "Selecione um estado",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      if (editingItem) {
        // Atualizar
        const payload: UpdateTowingSettingPayload = {
          excess_km_price: parseFloat(formData.excess_km_price),
          departure_price: parseFloat(formData.departure_price),
        };

        await towingSettingsService.update(editingItem.id, payload);

        toast({
          title: "Sucesso",
          description: "Configuração atualizada com sucesso",
        });
      } else {
        // Criar
        const payload: CreateTowingSettingPayload = {
          uf_id: parseInt(formData.uf_id),
          excess_km_price: parseFloat(formData.excess_km_price),
          departure_price: parseFloat(formData.departure_price),
        };

        await towingSettingsService.create(payload);

        toast({
          title: "Sucesso",
          description: "Configuração criada com sucesso",
        });
      }

      handleCloseDialog();
      loadSettings();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      const errorMessage = error?.response?.data?.error || "Erro ao salvar configuração";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (item: TowingSetting) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await towingSettingsService.delete(itemToDelete.id);
      toast({
        title: "Sucesso",
        description: "Configuração excluída com sucesso",
      });
      loadSettings();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a configuração",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="rounded-2xl border-border/50 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configurações de Guincho por Estado</CardTitle>
              <CardDescription>
                Gerencie os valores de guincho para cada estado
              </CardDescription>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="rounded-xl gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Configuração
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : settings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma configuração cadastrada</p>
              <p className="text-sm mt-2">Clique em "Nova Configuração" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Preço por KM Excedente</TableHead>
                  <TableHead>Preço de Partida</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{setting.uf.code}</span>
                        <span className="text-muted-foreground">
                          - {setting.uf.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>R$ {setting.excess_km_price.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>R$ {setting.departure_price.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(setting)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(setting)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Configuração" : "Nova Configuração"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Atualize os valores de guincho para este estado"
                : "Cadastre os valores de guincho para um novo estado"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="uf">Estado *</Label>
                <Select
                  value={formData.uf_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, uf_id: value })
                  }
                  disabled={!!editingItem}
                >
                  <SelectTrigger id="uf" className="rounded-xl">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {UFS.map((uf) => (
                      <SelectItem key={uf.id} value={uf.id.toString()}>
                        {uf.code} - {uf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excess_km_price">Preço por KM Excedente (R$) *</Label>
                <CurrencyInput
                  id="excess_km_price"
                  name="excess_km_price"
                  placeholder="R$ 3,40"
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  value={formData.excess_km_price}
                  onValueChange={(value) =>
                    setFormData({ ...formData, excess_km_price: value || "" })
                  }
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departure_price">Preço de Partida (R$) *</Label>
                <CurrencyInput
                  id="departure_price"
                  name="departure_price"
                  placeholder="R$ 145,00"
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  value={formData.departure_price}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departure_price: value || "" })
                  }
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="rounded-xl"
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a configuração de{" "}
              <strong>{itemToDelete?.uf.name} ({itemToDelete?.uf.code})</strong>?
              <br />
              <br />
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
