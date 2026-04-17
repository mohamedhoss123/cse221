import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/')({
  component: SettingsIndexPage,
})

function SettingsIndexPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-[var(--expressive-primary)] mb-2">
          General <span className="font-semibold text-[var(--expressive-primary)]">Settings</span>
        </h1>
        <p className="text-[var(--expressive-text)]">
          Manage your main application preferences and configurations
        </p>
      </div>

      <div className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] p-6 rounded-2xl max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--expressive-primary)]">Property Name</h3>
              <p className="text-sm text-[var(--expressive-text)]">The name of your hotel displayed to customers</p>
            </div>
            <div className="px-4 py-2 border-2 border-[var(--expressive-secondary)] bg-[var(--expressive-background)] rounded-xl font-mono text-sm">
              LuxeStay Hotel
            </div>
          </div>
          
          <hr className="border-[var(--expressive-secondary)]" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--expressive-primary)]">Security Preferences</h3>
              <p className="text-sm text-[var(--expressive-text)]">Manage roles, API keys, and access controls</p>
            </div>
            <Link 
              to="/admin/settings/security"
              className="inline-flex items-center justify-center h-10 px-4 font-semibold text-[var(--expressive-surface)] bg-[var(--expressive-primary)] border-2 border-[var(--expressive-secondary)] rounded-xl shadow-[4px_4px_0_0_var(--expressive-secondary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--expressive-secondary)] transition-all"
            >
              Configure Security
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
