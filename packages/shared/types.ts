export type Channel = {
  id: string;
  name: string;
  platform: string;
  tone: string;
  audience: string;
  rules: Record<string, unknown>;
  createdAt: string;
};

export type Brief = {
  id: string;
  channelId: string;
  title: string;
  objective: string;
  angle: string;
  targetAudience: string;
  status: string;
  constraints: Record<string, unknown>;
  sourceFacts: Array<{ id: string; title: string; url: string }>;
  createdAt: string;
};

export type Idea = {
  id: string;
  briefId: string;
  title: string;
  angle: string;
  hook: string;
  reasoning: string;
  brandFitScore: number;
  audienceAppealScore: number;
  riskLevel: string;
  status: string;
};

export type ScriptDraft = {
  id: string;
  ideaId: string;
  version: number;
  title: string;
  hook: string;
  body: string;
  cta: string;
  claimsUsed: Array<{ claim: string; sourceId: string; status: string }>;
  promptVersion: string;
  modelVersion: string;
  status: string;
};
