import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Receipt, CreditCard, Calendar, DollarSign } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import {
  type CallBill,
  billStatusLabels,
  billStatusVariants,
  paymentMethodLabels,
} from "@/services/calls.service";

interface BillsCardProps {
  bills: CallBill[];
}

export function BillsCard({ bills }: BillsCardProps) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(value));
  };

  const totalValue = bills.reduce((acc, bill) => acc + parseFloat(bill.value), 0);

  return (
    <Card className="rounded-2xl border-border/50 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Faturas</CardTitle>
              <CardDescription>Cobranças do chamado</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalValue.toString())}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {bills.length === 0 ? (
          <p className="text-muted-foreground italic text-center py-4">
            Nenhuma fatura registrada
          </p>
        ) : (
          bills.map((bill, index) => (
            <div key={bill.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{formatCurrency(bill.value)}</span>
                  </div>
                  <Badge variant={billStatusVariants[bill.status] || "secondary"}>
                    {billStatusLabels[bill.status] || bill.status}
                  </Badge>
                </div>

                {bill.description && (
                  <p className="text-sm text-muted-foreground">{bill.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {bill.payment_method && (
                    <div>
                      <p className="text-muted-foreground">Método</p>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {paymentMethodLabels[bill.payment_method] || bill.payment_method}
                        </span>
                      </div>
                    </div>
                  )}

                  {bill.payment_date && (
                    <div>
                      <p className="text-muted-foreground">Pago em</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{formatDateTime(bill.payment_date)}</span>
                      </div>
                    </div>
                  )}

                  {bill.due_date && (
                    <div>
                      <p className="text-muted-foreground">Vencimento</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{formatDateTime(bill.due_date)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
