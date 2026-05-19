import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/')({
  component: SettingsIndexPage,
})

function SettingsIndexPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-l-8 border-black pl-8">
        <h1 className="text-6xl font-black text-black mb-4 uppercase tracking-tighter leading-none">
          SYSTEM <span className="text-[#ce0031]">CONFIGURATION</span>
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-black/60 uppercase tracking-[0.2em]">
            Core Operational Parameters Terminal
          </p>
          <div className="h-0.5 flex-1 bg-black/10" />
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-2 h-2 bg-[#ce0031]" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Terminal */}
        <div className="md:col-span-1 space-y-2">
          {[
            { label: 'GEN_PARAMS', active: true },
            { label: 'SECURITY_AUTH', path: '/admin/settings/security' },
            { label: 'FISCAL_RULES', disabled: true },
            { label: 'API_DIRECTIVE', disabled: true },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full text-left px-4 py-3 border-4 border-black font-black text-[10px] uppercase tracking-widest transition-all ${
                item.active 
                  ? 'bg-black text-white shadow-[4px_4px_0_0_#ce0031] -translate-x-1 -translate-y-1' 
                  : 'bg-white text-black hover:bg-black/5 active:shadow-none'
              } ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Configuration Hub */}
        <div className="md:col-span-3">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-black text-white text-[8px] font-black uppercase tracking-widest">
              HUB_STATUS: ACTIVE
            </div>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-black border-dashed pb-8">
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter">Property Identifier</h3>
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Global Asset Designation</p>
                </div>
                <div className="px-6 py-4 border-4 border-black bg-black text-[#ce0031] font-black text-lg tracking-tighter italic">
                  LUXESTAY_OPERATIONAL_UNIT_01
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-black border-dashed pb-8">
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter">Security Directorate</h3>
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Encryption & Access Protocols</p>
                </div>
                <Link 
                  to="/admin/settings/security"
                  className="inline-flex items-center justify-center h-14 px-8 font-black text-white bg-[#ce0031] border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 active:shadow-none transition-all uppercase text-xs tracking-widest"
                >
                  ACCESS_PROTOCOLS
                </Link>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter opacity-30">Fiscal Thresholds</h3>
                  <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Automated Revenue Management</p>
                </div>
                <div className="px-6 py-4 border-4 border-black border-dashed text-black/20 font-black text-xs uppercase tracking-widest">
                  LOCKED_PENDING_DIRECTIVE
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-black text-white border-4 border-black shadow-[8px_8px_0_0_#ce0031]">
            <div className="flex items-center gap-4">
              <div className="animate-pulse w-3 h-3 bg-[#ce0031] rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                System heartbeat stable // All parameters synchronized
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
