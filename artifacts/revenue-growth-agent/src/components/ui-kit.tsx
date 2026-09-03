import { type ReactNode } from 'react';
import { AlertTriangle, Check, CircleDot, LoaderCircle, X } from 'lucide-react';

export type StatusTone = 'success' | 'running' | 'blocked' | 'failed' | 'neutral';

const statusConfig: Record<StatusTone, { label: string; className: string; icon: typeof Check }> = {
  success: { label: 'Complete', className: 'bg-[hsl(161_63%_92%)] text-[hsl(161_63%_26%)]', icon: Check },
  running: { label: 'Running', className: 'bg-[hsl(38_88%_91%)] text-[hsl(28_70%_32%)]', icon: LoaderCircle },
  blocked: { label: 'Blocked', className: 'bg-[hsl(215_24%_91%)] text-[hsl(215_24%_39%)]', icon: CircleDot },
  failed: { label: 'Failed', className: 'bg-[hsl(4_70%_92%)] text-[hsl(4_70%_37%)]', icon: X },
  neutral: { label: 'Pending', className: 'bg-[hsl(215_19%_90%)] text-[hsl(215_15%_43%)]', icon: CircleDot },
};

export function StatusPill({ status, label }: { status: StatusTone; label?: string }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${config.className}`} data-testid={`status-pill-${status}`}>
      <Icon size={12} className={status === 'running' ? 'animate-spin' : ''} />
      {label ?? config.label}
    </span>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-7 flex items-end justify-between gap-4">
      <div>
        <div className="eyebrow mb-2">{eyebrow}</div>
        <h1 className="font-display text-3xl font-semibold tracking-[-.04em] text-[hsl(var(--foreground))] md:text-[34px]" data-testid="text-page-title">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function SectionLabel({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="eyebrow">{children}</h2>{trailing}</div>;
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[hsl(var(--muted))] ${className}`} aria-label="Loading" />;
}

export function QueryState({ loading, error, onRetry, children }: { loading: boolean; error: unknown; onRetry?: () => void; children: ReactNode }) {
  if (loading) return <div className="grid gap-3"><SkeletonBlock className="h-20" /><SkeletonBlock className="h-40" /></div>;
  if (error) return (
    <div className="card-surface flex items-start gap-3 border-[hsl(4_70%_76%)] p-5" data-testid="state-error">
      <AlertTriangle className="mt-0.5 text-[hsl(var(--destructive))]" size={18} />
      <div><div className="font-semibold">Signal unavailable</div><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">The agent could not read this surface right now.</p>{onRetry && <button className="mt-3 text-xs font-bold text-[hsl(var(--primary))] underline" onClick={onRetry} data-testid="button-retry">Retry connection</button>}</div>
    </div>
  );
  return <>{children}</>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="card-surface flex min-h-40 flex-col items-center justify-center p-6 text-center" data-testid="state-empty"><div className="mb-3 grid size-9 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><CircleDot size={17} /></div><div className="font-display font-semibold">{title}</div><p className="mt-1 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">{description}</p></div>;
}