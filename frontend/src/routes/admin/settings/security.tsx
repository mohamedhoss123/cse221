import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/security')({
  component: SecuritySettingsPage,
})

function SecuritySettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          to="/admin/settings"
          className="text-sm font-semibold text-[var(--expressive-text)] hover:text-[var(--expressive-primary)] hover:underline mb-2 inline-block"
        >
          &larr; Back to Settings
        </Link>
        <h1 className="text-3xl font-light text-[var(--expressive-primary)] mb-2">
          Security <span className="font-semibold text-[var(--expressive-primary)]">Settings</span>
        </h1>
        <p className="text-[var(--expressive-text)]">
          Manage your account security and administrative access controls
        </p>
      </div>

      <div className="bg-[var(--expressive-surface)] border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] p-6 rounded-2xl max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--expressive-primary)]">Two-Factor Authentication</h3>
              <p className="text-sm text-[var(--expressive-text)]">Require a second step to verify your identity</p>
            </div>
            <button className="px-4 py-2 border-2 border-[var(--expressive-secondary)] bg-slate-100 text-[var(--expressive-text)] rounded-xl font-semibold shadow-[2px_2px_0_0_var(--expressive-secondary)]">
              Enable
            </button>
          </div>
          
          <hr className="border-[var(--expressive-secondary)]" />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--expressive-primary)]">Active Sessions</h3>
              <p className="text-sm text-[var(--expressive-text)]">Manage devices currently logged in to your account</p>
            </div>
            <button className="px-4 py-2 border-2 border-[var(--expressive-secondary)] bg-[var(--expressive-background)] text-[var(--expressive-primary)] rounded-xl font-semibold shadow-[2px_2px_0_0_var(--expressive-secondary)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--expressive-secondary)] transition-all">
              Log out all devices
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
