import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { hour: "00h", atendimentos: 12 },
  { hour: "02h", atendimentos: 8 },
  { hour: "04h", atendimentos: 5 },
  { hour: "06h", atendimentos: 15 },
  { hour: "08h", atendimentos: 35 },
  { hour: "10h", atendimentos: 48 },
  { hour: "12h", atendimentos: 42 },
  { hour: "14h", atendimentos: 55 },
  { hour: "16h", atendimentos: 62 },
  { hour: "18h", atendimentos: 58 },
  { hour: "20h", atendimentos: 45 },
  { hour: "22h", atendimentos: 28 },
];

export function AttendanceChart() {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in-up h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Atendimentos por Hora</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Volume de chamados nas últimas 24 horas</p>
        </div>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
            <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 100%, 22%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(160, 100%, 22%)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(160, 100%, 22%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(240, 6%, 90%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="hour" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(240, 4%, 46%)", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(240, 4%, 46%)", fontSize: 12, fontWeight: 500 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.15)",
                padding: "12px 16px",
              }}
              labelStyle={{ color: "hsl(240, 10%, 4%)", fontWeight: 600, marginBottom: "4px" }}
              itemStyle={{ color: "hsl(160, 100%, 22%)", fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="atendimentos"
              stroke="hsl(160, 100%, 22%)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAtendimentos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
