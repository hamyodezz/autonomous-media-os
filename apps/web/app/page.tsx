import Link from 'next/link';

const briefs = [
  { id: 1, title: 'AI productivity myths', status: 'Ready for review' },
  { id: 2, title: 'Creator workflow automation', status: 'Draft' },
  { id: 3, title: 'Brand safety fundamentals', status: 'Approved' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Autonomous Media OS</p>
            <h1 className="mt-3 text-4xl font-bold">Human-supervised creative operations</h1>
          </div>
          <Link
            href="/briefs/new"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            New brief
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard label="Active briefs" value="12" />
          <StatCard label="Approved scripts" value="28" />
          <StatCard label="Published videos" value="19" />
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent briefs</h2>
            <button className="text-sm text-cyan-400">View all</button>
          </div>

          <div className="space-y-3">
            {briefs.map((brief) => (
              <div
                key={brief.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-100">{brief.title}</p>
                  <p className="text-sm text-slate-400">Brief #{brief.id}</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs uppercase tracking-wide text-slate-300">
                  {brief.status}
                </span>
              </div>
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
