import Fastify from 'fastify';

const app = Fastify({ logger: false });

app.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (request.method === 'OPTIONS') {
    reply.status(204).send();
  }
});

app.get('/health', async () => ({ ok: true, service: 'autonomous-media-os-api' }));

const channels = [
  {
    id: 'chan_1',
    name: 'Productivity Daily',
    platform: 'YouTube Shorts',
    tone: 'practical, concise, insightful',
    audience: 'makers and operators',
    rules: {
      allowed_topics: ['productivity', 'AI workflow', 'automation'],
      banned_topics: ['medical advice', 'politics'],
      forbidden_claims: ['guaranteed income'],
      asset_restrictions: ['no copyrighted music']
    },
    createdAt: '2026-10-11T00:00:00.000Z'
  }
];

const briefs = [
  {
    id: 'brief_1',
    channelId: 'chan_1',
    title: 'AI productivity myths',
    objective: 'Explain what AI actually helps with in daily workflows.',
    angle: 'Focus on repetitive work and manager decision friction.',
    targetAudience: 'operators and founders',
    status: 'in_review',
    constraints: {
      max_duration_seconds: 120,
      required_citations: true,
      banned_claims: ['miracle results']
    },
    sourceFacts: [
      { id: 'src_1', title: 'AI helps repetitive work', url: 'https://example.com/ai-productivity' }
    ],
    createdAt: '2026-10-11T00:00:00.000Z'
  }
];

const ideas = [
  {
    id: 'idea_1',
    briefId: 'brief_1',
    title: 'AI is not replacing your work, it is removing the boring parts',
    angle: 'Explain where AI creates leverage and where humans still matter.',
    hook: 'The real productivity win is not speed — it is removing admin drag.',
    reasoning: 'Strong fit for the audience and channel tone.',
    brandFitScore: 4.8,
    audienceAppealScore: 4.5,
    riskLevel: 'low',
    status: 'selected'
  },
  {
    id: 'idea_2',
    briefId: 'brief_1',
    title: 'Three tasks AI is great at and three jobs it is not',
    angle: 'Set realistic boundaries for AI capability.',
    hook: 'A lot of AI advice is too hype-driven.',
    reasoning: 'Very useful and easy to explain in a short video.',
    brandFitScore: 4.6,
    audienceAppealScore: 4.3,
    riskLevel: 'low',
    status: 'generated'
  }
];

const scriptDrafts = [
  {
    id: 'script_1',
    ideaId: 'idea_1',
    version: 1,
    title: 'AI is not replacing your work',
    hook: 'The boring part of your job is where AI wins.',
    body: 'Most people think AI is about replacement. It is not. It is about removing low-value repetition. The best strategies are clear: automate admin, structure decisions, and keep human judgment on the strategic part.',
    cta: 'Use AI to remove the work you do not want to do.',
    claimsUsed: [{ claim: 'AI helps repetitive workflows', sourceId: 'src_1', status: 'approved' }],
    promptVersion: 'v1',
    modelVersion: 'gpt-4o-mini',
    status: 'in_review'
  }
];

const reviews = [
  {
    id: 'review_1',
    scriptDraftId: 'script_1',
    verdict: 'needs_revision',
    comments: 'The claim should be more precise and mention the limits of AI in judgment-heavy work.',
    suggestedChanges: ['Add a sentence describing where humans still matter', 'Reduce overstatement'],
    riskNotes: 'Potential overclaiming',
    reviewerUserId: 'user_1'
  }
];

const renderJobs = [
  {
    id: 'render_1',
    scriptDraftId: 'script_1',
    status: 'queued',
    outputUrl: '',
    createdAt: '2026-10-11T00:00:00.000Z'
  }
];

const publishRecords = [] as any[];

app.get('/api/v1/channels', async () => ({ channels }));
app.post('/api/v1/channels', async (request, reply) => {
  const body = request.body as any;
  const channel = {
    id: `chan_${Date.now()}`,
    name: body.name || 'Untitled channel',
    platform: body.platform || 'YouTube Shorts',
    tone: body.tone || 'practical',
    audience: body.audience || 'general audience',
    rules: body.rules || {},
    createdAt: new Date().toISOString()
  };
  channels.push(channel);
  return reply.code(201).send({ channel });
});

app.get('/api/v1/briefs', async () => ({ briefs }));
app.post('/api/v1/briefs', async (request, reply) => {
  const body = request.body as any;
  const brief = {
    id: `brief_${Date.now()}`,
    channelId: body.channelId,
    title: body.title,
    objective: body.objective,
    angle: body.angle,
    targetAudience: body.targetAudience,
    status: 'draft',
    constraints: body.constraints || {},
    sourceFacts: body.sourceFacts || [],
    createdAt: new Date().toISOString()
  };
  briefs.push(brief);
  return reply.code(201).send({ brief });
});

app.get('/api/v1/briefs/:id', async (request) => {
  const { id } = request.params as { id: string };
  const brief = briefs.find((item) => item.id === id);
  if (!brief) {
    throw new Error('Brief not found');
  }

  return {
    brief,
    ideas: ideas.filter((item) => item.briefId === id),
    scripts: scriptDrafts.filter((draft) => ideas.some((idea) => idea.id === draft.ideaId && idea.briefId === id))
  };
});

app.post('/api/v1/briefs/:id/ideas/generate', async (request, reply) => {
  const { id } = request.params as { id: string };
  const brief = briefs.find((item) => item.id === id);
  if (!brief) {
    return reply.code(404).send({ error: 'Brief not found' });
  }

  const generated = [
    {
      id: `idea_${Date.now()}_a`,
      briefId: id,
      title: `${brief.title}: stop thinking AI is magic`,
      angle: 'Explain the real utility of AI in repetitive work without hype.',
      hook: 'It is not magic; it is leverage for boring tasks.',
      reasoning: 'Strong fit for channel tone and audience.',
      brandFitScore: 4.9,
      audienceAppealScore: 4.8,
      riskLevel: 'low',
      status: 'generated'
    },
    {
      id: `idea_${Date.now()}_b`,
      briefId: id,
      title: `${brief.title}: where AI should never be trusted alone`,
      angle: 'Define where human judgment still matters more than speed.',
      hook: 'AI can accelerate the process, but the best decisions still need a human.',
      reasoning: 'Good contrast angle for a high-trust channel.',
      brandFitScore: 4.7,
      audienceAppealScore: 4.5,
      riskLevel: 'medium',
      status: 'generated'
    }
  ];

  ideas.push(...generated);
  return { ideas: generated };
});

app.post('/api/v1/ideas/:id/select', async (request, reply) => {
  const { id } = request.params as { id: string };
  const item = ideas.find((idea) => idea.id === id);
  if (!item) {
    return reply.code(404).send({ error: 'Idea not found' });
  }
  item.status = 'selected';
  return { idea: item };
});

app.post('/api/v1/ideas/:id/scripts/generate', async (request, reply) => {
  const { id } = request.params as { id: string };
  const idea = ideas.find((item) => item.id === id);
  if (!idea) {
    return reply.code(404).send({ error: 'Idea not found' });
  }

  const draft = {
    id: `script_${Date.now()}`,
    ideaId: id,
    version: 1,
    title: idea.title,
    hook: idea.hook,
    body: `The real productivity win is not speed alone. It is removing the repetitive work that slows people down. AI is best at cleaning up the boring parts: drafting, summarizing, sorting, and organizing low-value tasks. But the final judgment still belongs to the human. That is where strategic thinking and taste matter most.`,
    cta: 'Use AI to remove friction, not to replace judgment.',
    claimsUsed: [{ claim: 'AI reduces low-value repetitive work', sourceId: 'src_1', status: 'approved' }],
    promptVersion: 'v1',
    modelVersion: 'gpt-4o-mini',
    status: 'in_review'
  };

  scriptDrafts.push(draft);
  return { script: draft };
});

app.get('/api/v1/script-drafts', async () => ({ scriptDrafts }));
app.get('/api/v1/script-drafts/:id', async (request) => {
  const { id } = request.params as { id: string };
  const draft = scriptDrafts.find((item) => item.id === id);
  if (!draft) {
    throw new Error('Script draft not found');
  }
  return { script: draft, review: reviews.find((item) => item.scriptDraftId === id) };
});

app.post('/api/v1/script-drafts/:id/review', async (request, reply) => {
  const { id } = request.params as { id: string };
  const body = request.body as any;
  const draft = scriptDrafts.find((item) => item.id === id);
  if (!draft) {
    return reply.code(404).send({ error: 'Script draft not found' });
  }

  const review = {
    id: `review_${Date.now()}`,
    scriptDraftId: id,
    verdict: body.verdict || 'needs_revision',
    comments: body.comments || 'Needs clarity on the final point.',
    suggestedChanges: body.suggestedChanges || ['Tighten the hook', 'Clarify the bounded scope of AI'],
    riskNotes: body.riskNotes || 'Potential overstatement',
    reviewerUserId: 'user_1'
  };

  reviews.push(review);
  return { review };
});

app.get('/api/v1/render-jobs', async () => ({ renderJobs }));
app.post('/api/v1/script-drafts/:id/render', async (request, reply) => {
  const { id } = request.params as { id: string };
  const draft = scriptDrafts.find((item) => item.id === id);
  if (!draft) {
    return reply.code(404).send({ error: 'Script draft not found' });
  }

  const job = {
    id: `render_${Date.now()}`,
    scriptDraftId: id,
    status: 'queued',
    outputUrl: 'https://example.com/rendered/video.mp4',
    createdAt: new Date().toISOString()
  };

  renderJobs.push(job);
  return { renderJob: job };
});

app.post('/api/v1/render-jobs/:id/publish', async (request, reply) => {
  const { id } = request.params as { id: string };
  const job = renderJobs.find((item) => item.id === id);
  if (!job) {
    return reply.code(404).send({ error: 'Render job not found' });
  }

  const record = {
    id: `publish_${Date.now()}`,
    renderJobId: id,
    platform: 'YouTube Shorts',
    publishedUrl: 'https://example.com/published/video',
    publishedAt: new Date().toISOString(),
    approvalTrail: [{ approvedBy: 'user_1', approvedAt: new Date().toISOString() }]
  };

  publishRecords.push(record);
  job.status = 'completed';
  return { publishRecord: record };
});

app.get('/api/v1/publish-records', async () => ({ publishRecords }));

app.options('*', async (_, reply) => {
  reply.status(200).send();
});

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log('API listening on http://localhost:4000');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
