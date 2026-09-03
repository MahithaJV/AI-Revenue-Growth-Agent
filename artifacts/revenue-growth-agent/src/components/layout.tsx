import { Activity, BarChart3, BookOpen, ChevronRight, Command, Gauge, Settings2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { type ReactNode } from 'react';

const nav = [
  { href: '/', label: 'Command center', icon: Gauge },
  { href: '/catalog', label: 'Catalog signals', icon: BookOpen },
  { href: '/analytics', label: 'Sales analytics', icon: BarChart3 },
  { href: '/activity', label: 'Activity trace', icon: Activity },
];

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-[0_8px_18px_rgba(66,205,165,.15)]"><Command size={19} strokeWidth={2.5} /></div>
          <div className="sidebar-wordmark"><div className="font-display text-[15px] font-semibold leading-tight">MarginPilot</div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.48)]">Revenue agent</div></div>
        </div>
        <div className="sidebar-caption px-5 pb-3 pt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.36)]">Workspace</div>
        <nav className="space-y-1 px-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? location === '/' : location.startsWith(href);
            return <Link href={href} className={`nav-link group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${active ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]' : 'text-[hsl(var(--sidebar-foreground)/.58)] hover:bg-[hsl(var(--sidebar-accent)/.65)] hover:text-[hsl(var(--sidebar-foreground))]'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} key={href}><Icon size={17} strokeWidth={active ? 2.3 : 1.8} /><span className="nav-label">{label}</span>{active && <ChevronRight className="nav-label ml-auto opacity-60" size={14} />}</Link>;
          })}
        </nav>
        <div className="sidebar-caption px-5 pb-3 pt-9 text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.36)]">Controls</div>
        <nav className="space-y-1 px-3">
          <Link href="/settings" className={`nav-link group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${location.startsWith('/settings') ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]' : 'text-[hsl(var(--sidebar-foreground)/.58)] hover:bg-[hsl(var(--sidebar-accent)/.65)] hover:text-[hsl(var(--sidebar-foreground))]'}`} data-testid="link-nav-settings"><Settings2 size={17} /><span className="nav-label">Rules & connection</span></Link>
        </nav>
        <div className="mt-auto p-4">
          <div className="sidebar-footer-copy rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.55)] p-3.5">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold"><ShieldCheck size={14} className="text-[hsl(var(--sidebar-primary))]" />Guardrails active</div>
            <p className="text-[10px] leading-4 text-[hsl(var(--sidebar-foreground)/.48)]">Every recommendation is checked against your margin rules.</p>
          </div>
          <div className="sidebar-footer-copy mt-3 flex items-center gap-2 px-1 text-[10px] text-[hsl(var(--sidebar-foreground)/.36)]"><Sparkles size={12} />Built for operator decisions</div>
        </div>
      </aside>
      <div className="sidebar-mobile"><Link href="/" className="flex items-center gap-2.5" data-testid="link-mobile-home"><div className="grid size-8 place-items-center rounded-lg bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"><Command size={16} /></div><span className="font-display text-sm font-semibold">MarginPilot</span></Link><Link href="/settings" className="rounded-lg p-2 text-[hsl(var(--sidebar-foreground)/.7)]" data-testid="link-mobile-settings"><Settings2 size={19} /></Link></div>
      <main className="main-wrap">{children}</main>
    </div>
  );
}