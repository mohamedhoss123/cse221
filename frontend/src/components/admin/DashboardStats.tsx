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
    <Card className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--expressive-text-muted)] uppercase tracking-wider mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-black text-[var(--expressive-text)] mb-1">
              {value}
            </h3>
            {description && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  {description}
                </span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] flex items-center justify-center text-[var(--expressive-primary)] group-hover:bg-[var(--expressive-primary)] group-hover:text-white transition-colors duration-300">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
