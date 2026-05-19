import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings/security')({
  component: SecuritySettingsPage,
})

import { ArrowLeft, ShieldCheck, UserMinus, Radio } from 'lucide-react'

function SecuritySettingsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-l-8 border-black pl-8">
        <Link
          to="/admin/settings"
          className="group mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK_TO_TERMINAL
        </Link>
        <h1 className="text-6xl font-black text-black mb-4 uppercase tracking-tighter leading-none">
          SECURITY <span className="text-[#ce0031]">DIRECTORATE</span>
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-black/60 uppercase tracking-[0.2em]">
            Credential & Session Management Module
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
            { label: 'GEN_PARAMS', path: '/admin/settings' },
            { label: 'SECURITY_AUTH', active: true },
            { label: 'FISCAL_RULES', disabled: true },
            { label: 'API_DIRECTIVE', disabled: true },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path || '#'}
              className={`w-full text-left px-4 py-3 border-4 border-black font-black text-[10px] uppercase tracking-widest transition-all ${
                item.active 
                  ? 'bg-black text-white shadow-[4px_4px_0_0_#ce0031] -translate-x-1 -translate-y-1' 
                  : 'bg-white text-black hover:bg-black/5 active:shadow-none'
              } ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Configuration Hub */}
        <div className="md:col-span-3">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-black text-white text-[8px] font-black uppercase tracking-widest">
              SEC_PRIORITY: HIGH
            </div>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-black border-dashed pb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black text-white">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter">Dual-Factor Auth</h3>
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest italic">Secondary Identity Verification</p>
                  </div>
                </div>
                <button className="h-14 px-8 border-4 border-black bg-black text-white font-black uppercase tracking-widest shadow-[4px_4px_0_0_#ce0031] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#ce0031] active:translate-y-0 transition-all text-xs">
                  INITIATE_UPGRADE
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black text-white">
                    <UserMinus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter">Session Liquidation</h3>
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest italic">Flush All Active Operational Tokens</p>
                  </div>
                </div>
                <button className="h-14 px-8 border-4 border-black bg-white text-[#ce0031] font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 transition-all text-xs">
                  TERMINATE_ALL
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-black text-white border-4 border-black shadow-[8px_8px_0_0_#ce0031]">
             <div className="flex items-center gap-4">
               <Radio className="w-4 h-4 text-[#ce0031] animate-pulse" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                 Encryption Standard: AES-256-GCM // Operational Data Isolated
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
