import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

interface DateRangeFilterProps {
  onFilter: (startDate: string, endDate: string) => void;
  onClear: () => void;
}

export function DateRangeFilter({ onFilter, onClear }: DateRangeFilterProps) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const formatDateToAPI = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onFilter(formatDateToAPI(startDate), formatDateToAPI(endDate));
    }
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onClear();
  };

  const isFilterApplied = startDate && endDate;
  const canApply = startDate && endDate;

  return (
    <Card className="p-4 rounded-2xl border-border/50 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrar por período:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Data Início */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal rounded-xl",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data início"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">até</span>

          {/* Data Fim */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal rounded-xl",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data fim"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                locale={ptBR}
                disabled={(date) => {
                  if (!startDate) return false;
                  return date < startDate;
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Botões de ação */}
          <Button
            onClick={handleApplyFilter}
            disabled={!canApply}
            className="rounded-xl"
            size="sm"
          >
            Aplicar Filtro
          </Button>

          {isFilterApplied && (
            <Button
              onClick={handleClear}
              variant="ghost"
              size="sm"
              className="rounded-xl gap-1"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}

          <Button
            onClick={() => navigate("/acompanhamento")}
            variant="outline"
            size="sm"
            className="rounded-xl gap-2"
          >
            <Eye className="h-4 w-4" />
            Acompanhamento
          </Button>
        </div>
      </div>
    </Card>
  );
}
