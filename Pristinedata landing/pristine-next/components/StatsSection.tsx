import { Icon } from '@iconify/react'

export function StatsSection() {
  return (
    <section className="overflow-hidden text-white bg-slate-900 dark:bg-slate-900/50 pt-24 pb-24 relative border-t border-b border-transparent dark:border-slate-800">
      <div className="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900 dark:from-slate-950 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-16 items-center">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-8 text-indigo-400">
              <Icon icon="solar:global-circle-bold" width={20} />
              <span className="text-xs font-semibold uppercase tracking-widest">Unrivaled Scale</span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-10">
              <div className="relative group">
                <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.9] mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">700M+</span>
                </h2>
                <p className="text-white text-xl md:text-2xl font-medium tracking-tight group-hover:text-indigo-200 transition-colors">Contacts.</p>
              </div>
              <div className="relative group">
                <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.9] mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">90%</span>
                </h2>
                <p className="md:text-2xl group-hover:text-emerald-200 transition-colors text-xl font-medium text-white tracking-tight">Accuracy.</p>
              </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md border-l-2 border-slate-800 pl-6">
              The world&apos;s largest database meets the highest accuracy standards. While others offer stale data, we offer verified reality at scale.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: 'solar:users-group-rounded-bold', color: 'text-indigo-400', label: 'Global Coverage (700M+)' },
                { icon: 'solar:check-circle-bold', color: 'text-emerald-400', label: 'Real-time Verification Engine' },
              ].map(({ icon, color, label }) => (
                <div key={label} className="flex items-center gap-4 text-sm font-medium text-slate-300">
                  <div className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center ${color} border border-slate-700`}>
                    <Icon icon={icon} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative perspective-midrange group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full translate-x-10 translate-y-10 group-hover:bg-indigo-500/30 transition-all duration-700" />
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:rotate-y-5 hover:rotate-x-5 transform-style-preserve-3d">
              <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-200">Validation Log</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wide">Scanning Live</span>
              </div>

              <div className="space-y-3">
                {[
                  { email: 'alex.m@stripe.com', status: 'VALID', color: 'text-emerald-400', icon: 'solar:check-read-linear', dot: 'bg-emerald-500', opacity: '', strike: false },
                  { email: 'j.doe@uber.com', status: 'VALID', color: 'text-emerald-400', icon: 'solar:check-read-linear', dot: 'bg-emerald-500', opacity: 'opacity-80', strike: false },
                  { email: 'sarah@deadstartup.io', status: 'BOUNCE', color: 'text-[#F43F5E]', icon: 'solar:close-circle-linear', dot: 'bg-[#F43F5E]', opacity: 'opacity-50', strike: true },
                  { email: 'mike@vercel.com', status: 'VERIFYING...', color: 'text-emerald-400', icon: 'solar:check-read-linear', dot: 'bg-emerald-500', opacity: 'opacity-30', strike: false },
                ].map(({ email, status, color, icon, dot, opacity, strike }) => (
                  <div key={email} className={`flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 ${opacity}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      <div className={`text-sm text-slate-200 font-mono ${strike ? 'line-through text-slate-400' : ''}`}>{email}</div>
                    </div>
                    <div className={`text-[10px] font-bold ${color} font-mono flex items-center gap-1.5`}>
                      <Icon icon={icon} width={12} /> {status}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white mb-1 tracking-tight">712M</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Total Records</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400 mb-1 tracking-tight">98.2%</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Deliverability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
