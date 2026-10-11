'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

export function BriefDetail({ briefId }: { briefId: string }) {
  const [brief, setBrief] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const response = await apiGet<{ brief: any; ideas: any[] }>('/api/v1/briefs/' + briefId);
      setBrief(response.brief);
      setIdeas(response.ideas || []);
    }

    load();
  }, [briefId]);

  async function generateIdeas() {
    setIsGenerating(true);
    try {
      const response = await apiPost<{ ideas: any[] }>(`/api/v1/briefs/${briefId}/ideas/generate`, {});
      setIdeas((current) => [...current, ...response.ideas]);
      setStatus('Ideas generated');
    } catch (error) {
      console.error(error);
      setStatus('Failed to generate ideas');
    } finally {
      setIsGenerating(false);
    }
  }

  async function selectIdea(ideaId: string) {
    try {
      await apiPost(`/api/v1/ideas/${ideaId}/select`, {});
      setStatus('Idea selected');
    } catch (error) {
      console.error(error);
      setStatus('Failed to select idea');
    }
  }

  if (!brief) {
    return <div className="p-8 text-slate-300">Loading brief…</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Brief</p>
            <h1 className="mt-3 text-3xl font-bold">{brief.title}</h1>
          </div>
          <button
            onClick={generateIdeas}
            disabled={isGenerating}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {isGenerating ? 'Generating…' : 'Generate ideas'}
          </button>
        </header>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Objective</p>
          <p className="mt-2 text-lg">{brief.objective}</p>
          <p className="mt-4 text-sm text-slate-300">Angle: {brief.angle}</p>
          <p className="mt-2 text-sm text-slate-300">Audience: {brief.targetAudience}</p>
        </section>

        {status && <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{status}</div>}

        <section className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{idea.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{idea.angle}</p>
                </div>
                <button
                  onClick={() => selectIdea(idea.id)}
                  className="rounded-lg border border-cyan-500 px-3 py-2 text-sm text-cyan-300"
                >
                  Select idea
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-slate-700 px-2 py-1">Brand fit: {idea.brandFitScore}</span>
                <span className="rounded-full border border-slate-700 px-2 py-1">Audience: {idea.audienceAppealScore}</span>
                <span className="rounded-full border border-slate-700 px-2 py-1">Risk: {idea.riskLevel}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
