import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.some((item) => Number(item.ingresos || 0) > 0);

  return (
    <div className="card section-card p-6 mt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Evolución</p>
          <h2 className="text-xl font-bold text-slate-900">Ingresos mensuales</h2>
        </div>
      </div>

      <div className="h-80">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9dce4" />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `S/ ${value}`}
              />
              <Tooltip
                formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, "Ingresos"]}
                contentStyle={{ borderRadius: "12px", borderColor: "#e9dce4" }}
              />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#7a1f3d"
                strokeWidth={3}
                dot={{ r: 4, fill: "#7a1f3d" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#e8dce5] bg-[#fcf7fa] text-sm text-slate-500">
            Aún no hay facturas emitidas para mostrar en el gráfico.
          </div>
        )}
      </div>
    </div>
  );
}