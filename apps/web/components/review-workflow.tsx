'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

export function ReviewWorkflow({ scriptDraftId }: { scriptDraftId: string }) {
  const [script, setScript] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [verdict, setVerdict] = useState('needs_revision');
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const response = await apiGet<{ script: any; review: any }>('/api/v1/script-drafts/' + scriptDraftId);
      setScript(response.script);
      setReview(response.review);
    }

    load();
  }, [scriptDraftId]);

  async function submitReview() {
    try {
      const response = await apiPost<{ review: any }>('/api/v1/script-drafts/' + scriptDraftId + '/review', {
        verdict,
        comments,
        suggestedChanges: ['Tighten the final line', 'Add a sharper CTA'],
        riskNotes: 'Potential overstatement in the claim'
      });

      setReview(response.review);
      setStatus('Review submitted');
    } catch (error) {
      console.error(error);
      setStatus('Review failed');
    }
  }

  if (!script) {
    return <div className="p-8 text-slate-300">Loading review screen…</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Script review</h1>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Hook</p>
          <h2 className="mt-3 text-2xl font-semibold">{script.hook}</h2>
          <p className="mt-5 text-slate-300">{script.body}</p>
          <p className="mt-5 text-cyan-300">CTA: {script.cta}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold">Decision</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <button onClick={() => setVerdict('approved')} className={`rounded-xl border px-3 py-2 ${verdict === 'approved' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 text-slate-300'}`}>
              Approve
            </button>
            <button onClick={() => setVerdict('needs_revision')} className={`rounded-xl border px-3 py-2 ${verdict === 'needs_revision' ? 'border-amber-500 bg-amber-500/10 text-amber-300' : 'border-slate-700 text-slate-300'}`}>
              Needs revision
            </button>
            <button onClick={() => setVerdict('rejected')} className={`rounded-xl border px-3 py-2 ${verdict === 'rejected' ? 'border-red-500 bg-red-500/10 text-red-300' : 'border-slate-700 text-slate-300'}`}>
              Reject
            </button>
          </div>

          <textarea
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            className="mt-5 min-h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            placeholder="Leave review notes..."
          />

          <button onClick={submitReview} className="mt-5 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950">
            Submit review
          </button>

          {status && <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{status}</div>}
          {review && <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300"><strong>Previous verdict:</strong> {review.verdict}<br /><strong>Comments:</strong> {review.comments}</div>}
        </section>
      </div>
    </main>
  );
}
