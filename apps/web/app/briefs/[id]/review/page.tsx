"use client";

import { ReviewWorkflow } from '@/components/review-workflow';

export default function ReviewPage({ params }: { params: { id: string } }) {
  return <ReviewWorkflow scriptDraftId={params.id} />;
}
