'use client';

interface DownloadButtonProps {
  downloadUrl: string;
  originalUrl: string;
  title: string;
  className?: string;
}

function buildDownloadName(title: string, originalUrl: string): string {
  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'reddit-image';
  const extensionMatch = originalUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)(?:$|\?)/);
  const extension = extensionMatch?.[1] ?? 'jpg';

  return `${safeTitle}.${extension}`;
}

export function DownloadButton({
  downloadUrl,
  originalUrl,
  title,
  className = '',
}: DownloadButtonProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href={downloadUrl}
        download={buildDownloadName(title, originalUrl)}
        onClick={(event) => event.stopPropagation()}
        className="inline-flex min-h-10 items-center justify-center rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Download image
      </a>
      <a
        href={originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700 transition-colors hover:border-orange-300 hover:text-orange-800"
      >
        Open original
      </a>
    </div>
  );
}
