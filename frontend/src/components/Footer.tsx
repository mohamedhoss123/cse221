export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t-4 border-black px-8 py-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
            © {year} LUXESTAY_OPERATIONAL_DIRECTORATE
          </p>
          <div className="flex gap-1">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-1.5 h-1.5 bg-[#ce0031]" />
             ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <p className="text-[8px] font-black uppercase tracking-widest text-black/40 border-l-2 border-black/10 pl-4">
            CORE_SYSTEM: TANSTACK_V5
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-black/40 border-l-2 border-black/10 pl-4">
            ENCRYPTION: AES_256
          </p>
        </div>
      </div>
    </footer>
  )
}
