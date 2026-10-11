'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';

export function NewBriefForm() {
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [angle, setAngle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        channelId: 'chan_1',
        title,
        objective,
        angle,
        targetAudience,
        constraints: {
          max_duration_seconds: 120,
          required_citations: true,
          banned_claims: ['miracle results']
        },
        sourceFacts: [
          {
            id: 'source_generated',
            title: 'Channel brief source',
            url: 'https://example.com/brief-source'
          }
        ]
      };

      const response = await apiPost<{ brief: any }>('/api/v1/briefs', payload);
      setStatus(`Brief created: ${response.brief.title}`);
      setTitle('');
      setObjective('');
      setAngle('');
      setTargetAudience('');
    } catch (error) {
      setStatus('Failed to create brief');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">New brief</p>
          <h1 className="mt-3 text-3xl font-bold">Create a new creative brief</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="AI productivity myths"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Objective</label>
            <textarea
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="Explain what AI helps with in repetitive workflows."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Angle</label>
            <textarea
              value={angle}
              onChange={(event) => setAngle(event.target.value)}
              className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="Focus on the difference between "boring task automation" and "real strategic work.""
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Target audience</label>
            <input
              value={targetAudience}
              onChange={(event) => setTargetAudience(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              placeholder="Founders, operators, and advanced creators"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Creating…' : 'Create brief'}
            </button>
            <a href="/" className="text-sm text-slate-400">Back to dashboard</a>
          </div>

          {status && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{status}</div>}
        </form>
      </div>
    </main>
  );
}
