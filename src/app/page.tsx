'use client';

import { Suspense } from 'react';
import { GalleryPage } from '@/components/GalleryPage';

function GalleryContent() {
  return <GalleryPage />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
