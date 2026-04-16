import { Card, CardContent } from '#/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface DashboardStatsProps {
  title: string
  value: string | number
  icon: LucideIcon
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
            <p className="text-sm text-[var(--sea-ink-soft)]">{title}</p>
            <p className="text-2xl font-bold text-[var(--sea-ink)]">{value}</p>
            {description && (
              <p className="text-xs text-[var(--sea-ink-soft)]">{description}</p>
            )}
          </div>
          <Icon className="h-8 w-8 text-[var(--lagoon-deep)]" />
        </div>
      </CardContent>
    </Card>
  )
}
