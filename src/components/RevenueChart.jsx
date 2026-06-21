import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { mes: "Ene", ingresos: 4500 },
  { mes: "Feb", ingresos: 7000 },
  { mes: "Mar", ingresos: 6200 },
  { mes: "Abr", ingresos: 9800 },
  { mes: "May", ingresos: 12000 },
  { mes: "Jun", ingresos: 15000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-xl font-bold mb-4">
        Ingresos Mensuales
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#D4AF37"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}