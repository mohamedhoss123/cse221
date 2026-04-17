import { Card, CardContent } from '#/components/ui/card'
import { type ComponentType } from 'react'
import { type LucideProps } from 'lucide-react'

interface DashboardStatsProps {
  title: string
  value: string | number
  icon: ComponentType<LucideProps>
  description?: string
}

export default function DashboardStats({
  title,
  value,
  icon: Icon,
  description,
}: DashboardStatsProps) {
  return (
    <Card className="island-shell">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#000]">{title}</p>
            <p className="text-2xl font-bold text-[var(--expressive-primary)]">{value}</p>
            {description && (
              <p className="text-xs text-[#000]">{description}</p>
            )}
          </div>
          <Icon className="h-8 w-8 text-[var(--expressive-accent)]" />
        </div>
      </CardContent>
    </Card>
  )
}
