import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolBySlug, TOOLS } from '@/lib/tools';
import SuiteShell from '@/components/SuiteShell';

interface ToolPageProps {
  params: { slug: string };
}

/** Pre-render a route for every tool in the registry. */
export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: ToolPageProps): Metadata {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — AI PO Xavi Marín Suite`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  return <SuiteShell tool={tool} />;
}
