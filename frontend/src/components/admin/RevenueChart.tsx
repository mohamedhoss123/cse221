import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="island-shell">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface-strong)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `$${value}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--lagoon-deep)"
              strokeWidth={2}
              dot={{ fill: 'var(--lagoon-deep)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
