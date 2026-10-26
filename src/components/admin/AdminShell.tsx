'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';
import {
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  PenSquare,
  Settings2,
  ShieldAlert,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast, Toaster } from 'sonner';
import { Logo } from '@/components/layout/Logo';
import { GridLines } from '@/components/ui/GridLines';
import { adminKeys, countNewInquiries, fetchSettingsRow } from '@/lib/cms/admin';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { AdminButton, Field, Spinner, TextInput } from './ui';

/* ----------------------------------------------------------------------------- Auth */

type AuthStatus = 'loading' | 'signed-out' | 'forbidden' | 'recovery' | 'admin';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  problem?: string;
}

function useAdminAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let active = true;

    const resolve = async (session: Session | null) => {
      if (!session) {
        if (active) setState({ status: 'signed-out', user: null });
        return;
      }
      const { data, error } = await supabase.rpc('is_admin');
      if (!active) return;
      if (data === true) setState({ status: 'admin', user: session.user });
      else
        setState({
          status: 'forbidden',
          user: session.user,
          problem: error ? 'The CMS database isn’t set up yet — run the SQL migration in Supabase (see README).' : undefined,
        });
    };

    void supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setState({ status: 'recovery', user: session?.user ?? null });
        return;
      }
      // Supabase advises against awaiting its own calls inside this callback.
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') window.setTimeout(() => void resolve(session), 0);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return state;
}

async function signOut() {
  await getSupabase()?.auth.signOut();
  toast.success('Signed out');
}

interface AdminContextValue {
  user: User;
  /** False until "Import website content" has run; undefined while checking. */
  initialized: boolean | undefined;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used inside <AdminShell>');
  return context;
}

/* ----------------------------------------------------------------------------- Sign-in screens */

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-indigo px-4 py-10">
      <GridLines />
      <div aria-hidden className="absolute -right-40 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full border border-champagne/15" />
      <div aria-hidden className="absolute -bottom-52 -left-40 -z-10 h-[34rem] w-[34rem] rounded-full border border-champagne/10" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-14" />
          <p className="mt-5 text-[0.66rem] font-medium uppercase tracking-ultra text-champagne">Studio Dashboard</p>
        </div>
        <div className="rounded-[2rem] border border-champagne/30 bg-ivory p-7 shadow-2xl shadow-indigo-950/40 sm:p-9">{children}</div>
        <p className="mt-6 text-center text-xs text-ivory/50">
          <a href="/" className="transition-colors hover:text-champagne">
            ← Back to the website
          </a>
        </p>
      </div>
    </div>
  );
}

const authMessages: [RegExp, string][] = [
  [/invalid login credentials/i, 'The email or password is incorrect.'],
  [/email not confirmed/i, 'Please confirm your email address first — check your inbox for the link.'],
  [/rate limit|too many/i, 'Too many attempts. Please wait a minute and try again.'],
  [/failed to fetch|network/i, 'Network error — please check your internet connection.'],
];

const authError = (message: string) => authMessages.find(([pattern]) => pattern.test(message))?.[1] ?? message;

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setBusy(true);
    const { error: signInError } = await getSupabase()!.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (signInError) setError(authError(signInError.message));
  };

  const forgot = async () => {
    setError('');
    if (!email.trim()) {
      setError('Enter your email above first, then click “Forgot password?” again.');
      return;
    }
    const { error: resetError } = await getSupabase()!.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/`,
    });
    if (resetError) setError(authError(resetError.message));
    else toast.success('Check your inbox', { description: `We sent a password reset link to ${email.trim()}.` });
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-indigo">Welcome back</h1>
        <p className="mt-1 text-sm text-charcoal-soft">Sign in to edit the Indigo Interiors website.</p>
      </div>
      <Field label="Email" htmlFor="admin-email">
        <TextInput
          id="admin-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@indigoegy.com"
          autoFocus
        />
      </Field>
      <Field label="Password" htmlFor="admin-password">
        <div className="relative">
          <TextInput
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-charcoal-muted hover:text-indigo"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>
      {error && (
        <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}
      <AdminButton type="submit" loading={busy} className="w-full">
        Sign in
      </AdminButton>
      <button type="button" onClick={forgot} className="w-full text-center text-sm text-charcoal-soft underline-offset-4 hover:text-indigo hover:underline">
        Forgot password?
      </button>
    </form>
  );
}

function NewPasswordForm() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    setBusy(true);
    const { error: updateError } = await getSupabase()!.auth.updateUser({ password });
    setBusy(false);
    if (updateError) setError(authError(updateError.message));
    else {
      toast.success('Password updated');
      window.location.replace('/admin/');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 font-serif text-2xl tracking-wide text-indigo">
          <KeyRound className="h-5 w-5 text-champagne-700" /> Choose a new password
        </h1>
        <p className="mt-1 text-sm text-charcoal-soft">You’ll use it to sign in from now on.</p>
      </div>
      <Field label="New password" htmlFor="new-password" hint="At least 8 characters.">
        <TextInput id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
      </Field>
      {error && (
        <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}
      <AdminButton type="submit" loading={busy} className="w-full">
        Save password
      </AdminButton>
    </form>
  );
}

function Forbidden({ user, problem }: { user: User | null; problem?: string }) {
  return (
    <div className="space-y-5 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-error/10 text-error">
        <ShieldAlert className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-indigo">No admin access</h1>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
          {problem ?? (
            <>
              <strong className="font-medium text-indigo">{user?.email}</strong> is signed in but isn’t an admin. In Supabase’s SQL editor run{' '}
              <code className="rounded bg-linen px-1.5 py-0.5 text-xs">select public.make_admin(&apos;{user?.email}&apos;);</code>
            </>
          )}
        </p>
      </div>
      <AdminButton variant="secondary" icon={LogOut} onClick={() => void signOut()} className="w-full">
        Sign in with another account
      </AdminButton>
    </div>
  );
}

function SetupRequired() {
  return (
    <AuthLayout>
      <div className="space-y-3 text-sm leading-relaxed text-charcoal-soft">
        <h1 className="font-serif text-2xl tracking-wide text-indigo">Connect Supabase</h1>
        <p>The dashboard needs your Supabase project. Add these to a <code className="rounded bg-linen px-1">.env.local</code> file, then rebuild:</p>
        <pre className="overflow-x-auto rounded-xl bg-indigo p-4 text-xs text-champagne">
          NEXT_PUBLIC_SUPABASE_URL=…{'\n'}NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=…
        </pre>
        <p>Full steps are in the project README.</p>
      </div>
    </AuthLayout>
  );
}

/* ----------------------------------------------------------------------------- Dashboard layout */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/admin/', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/settings/', label: 'Global Settings', icon: Settings2 },
  { href: '/admin/content/', label: 'Pages Content', icon: FileText },
  { href: '/admin/projects/', label: 'Portfolio', icon: FolderKanban },
  { href: '/admin/services/', label: 'Services & Process', icon: Wrench },
  { href: '/admin/blog/', label: 'Blog / Journal', icon: PenSquare },
  { href: '/admin/inquiries/', label: 'Project Inquiries', icon: Inbox },
];

const normalize = (path: string) => (path.endsWith('/') ? path : `${path}/`);

function Sidebar({ user, newCount, onNavigate }: { user: User; newCount: number; onNavigate?: () => void }) {
  const pathname = normalize(usePathname() ?? '/admin/');

  return (
    <div className="flex h-full flex-col bg-indigo text-ivory">
      <div className="px-6 pb-6 pt-7">
        <Link href="/admin/" onClick={onNavigate} aria-label="Dashboard overview">
          <Logo className="h-11" />
        </Link>
        <p className="mt-3 text-[0.6rem] font-medium uppercase tracking-ultra text-champagne/80">Studio Dashboard</p>
      </div>
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = item.href === '/admin/' ? pathname === '/admin/' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors',
                    active ? 'bg-champagne text-indigo shadow-sm' : 'text-ivory/75 hover:bg-white/5 hover:text-ivory',
                  )}
                >
                  <Icon aria-hidden className="h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
                  <span className="flex-1">{item.label}</span>
                  {item.href === '/admin/inquiries/' && newCount > 0 && (
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums', active ? 'bg-indigo text-champagne' : 'bg-champagne text-indigo')}>
                      {newCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-ivory/75 transition-colors hover:bg-white/5 hover:text-ivory"
        >
          <ExternalLink aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.6} />
          View website
        </a>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-start text-sm text-ivory/75 transition-colors hover:bg-white/5 hover:text-ivory"
        >
          <LogOut aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.6} />
          <span className="min-w-0 flex-1">
            Sign out
            <span className="block truncate text-xs text-ivory/45">{user.email}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

/** Live alerts for new briefs, wherever the admin is in the dashboard. */
function useInquiryAlerts() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const refresh = () => {
      void mutate(adminKeys.inquiries);
      void mutate(adminKeys.newInquiries);
      void mutate(adminKeys.stats);
    };
    const channel = supabase
      .channel('admin-inquiries')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_inquiries' }, (payload) => {
        const name = (payload.new as { client_name?: string }).client_name ?? 'a new client';
        toast.info(`New project inquiry from ${name}`, {
          action: { label: 'View', onClick: () => window.location.assign('/admin/inquiries/') },
          duration: 10000,
        });
        refresh();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'project_inquiries' }, refresh)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'project_inquiries' }, refresh)
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [mutate]);
}

function Dashboard({ user, children }: { user: User; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: settingsRow } = useSWR(adminKeys.settings, fetchSettingsRow);
  const { data: newCount = 0 } = useSWR(adminKeys.newInquiries, countNewInquiries, { refreshInterval: 120000 });
  useInquiryAlerts();

  useEffect(() => setMenuOpen(false), [pathname]);

  const initialized = settingsRow === undefined ? undefined : settingsRow !== null;

  return (
    <AdminContext.Provider value={{ user, initialized }}>
      <div className="min-h-[100svh] bg-linen lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="sticky top-0 hidden h-[100svh] lg:block">
          <Sidebar user={user} newCount={newCount} />
        </aside>

        <header className="sticky top-0 z-40 flex items-center justify-between bg-indigo px-4 py-3 lg:hidden">
          <Link href="/admin/" aria-label="Dashboard overview">
            <Logo className="h-9" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-ivory"
          >
            <Menu className="h-5 w-5" />
            {newCount > 0 && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-indigo bg-champagne" />}
          </button>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard menu">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-indigo-950/60" onClick={() => setMenuOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-2xl">
              <Sidebar user={user} newCount={newCount} onNavigate={() => setMenuOpen(false)} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-6 grid h-9 w-9 place-items-center rounded-lg text-ivory/70 hover:text-ivory"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}

/* ----------------------------------------------------------------------------- Shell */

const toasterOptions = {
  classNames: {
    toast: 'rounded-2xl border border-champagne/40 font-sans shadow-xl',
    title: 'text-indigo font-medium',
    description: 'text-charcoal-soft',
  },
};

/**
 * Every /admin page renders inside this shell. Signed-out visitors see the sign-in
 * form right where they are, so typing /admin opens the login page.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    // The dashboard is English and left-to-right whatever the website language.
    <div lang="en" dir="ltr" className="font-sans text-charcoal">
      {isSupabaseConfigured ? <AuthGate>{children}</AuthGate> : <SetupRequired />}
      <Toaster position="top-right" richColors closeButton toastOptions={toasterOptions} />
    </div>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const auth = useAdminAuth();

  if (auth.status === 'loading') {
    return (
      <div className="grid min-h-[100svh] place-items-center bg-indigo">
        <Spinner className="h-8 w-8 text-champagne" />
      </div>
    );
  }
  if (auth.status === 'recovery') {
    return (
      <AuthLayout>
        <NewPasswordForm />
      </AuthLayout>
    );
  }
  if (auth.status === 'signed-out') {
    return (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    );
  }
  if (auth.status === 'forbidden' || !auth.user) {
    return (
      <AuthLayout>
        <Forbidden user={auth.user} problem={auth.problem} />
      </AuthLayout>
    );
  }
  return <Dashboard user={auth.user}>{children}</Dashboard>;
}
