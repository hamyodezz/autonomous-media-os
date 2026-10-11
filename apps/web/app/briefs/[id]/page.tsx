"use client";

import { BriefDetail } from '@/components/brief-detail';

export default function BriefPage({ params }: { params: { id: string } }) {
  return <BriefDetail briefId={params.id} />;
}
