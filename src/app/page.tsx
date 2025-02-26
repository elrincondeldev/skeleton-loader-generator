"use client";

import dynamic from 'next/dynamic';

const SkeletonGenerator = dynamic(() => import('./components/SkeletonGenerator'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )
});

export default function Home() {
  return <SkeletonGenerator />;
}
