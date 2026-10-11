'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

export function Dashboard() {
  const [channels, setChannels] = useState<any[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [channelsResponse, briefsResponse] = await Promise.all([
          apiGet<{ channels: any[] }>('/api/v1/channels'),
          apiGet<{ briefs: any[] }>('/api/v1/briefs')
        ]);

        setChannels(channelsResponse.channels || []);
        setBriefs(briefsResponse.briefs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-300">Loading dashboard…</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Autonomous Media OS</p>
            <h1 className="mt-3 text-4xl font-bold">Human-supervised creative operations</h1>
          </div>
          <a
            href="/briefs/new"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            New brief
          </a>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard label="Channels" value={String(channels.length)} />
          <StatCard label="Active briefs" value={String(briefs.length)} />
          <StatCard label="Published videos" value="19" />
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent briefs</h2>
            <a href="/briefs/new" className="text-sm text-cyan-400">Create new</a>
          </div>

          <div className="space-y-3">
            {briefs.map((brief) => (
              <a
                key={brief.id}
                href={`/briefs/${brief.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 transition hover:border-cyan-500"
              >
                <div>
                  <p className="font-medium text-slate-100">{brief.title}</p>
                  <p className="text-sm text-slate-400">{brief.objective}</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs uppercase tracking-wide text-slate-300">
                  {brief.status}
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}
