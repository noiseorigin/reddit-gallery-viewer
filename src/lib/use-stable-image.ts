import { useEffect, useMemo, useRef, useState } from 'react';

import type { StableImageSources } from './image-sources';

export type StableImageStatus = 'idle' | 'loading' | 'loaded' | 'failed';

interface UseStableImageOptions {
  sources: StableImageSources;
  preloadFull?: boolean;
  preferFull?: boolean;
  onLoadSuccess?: () => void;
  onTerminalError?: () => void;
}

function getInitialSrc(sources: StableImageSources, preferFull: boolean): string {
  if (preferFull) {
    return sources.fullProxyUrl || sources.placeholderProxyUrl || sources.directFallbackUrl;
  }

  return sources.placeholderProxyUrl || sources.fullProxyUrl || sources.directFallbackUrl;
}

export function useStableImage({
  sources,
  preloadFull = false,
  preferFull = false,
  onLoadSuccess,
  onTerminalError,
}: UseStableImageOptions) {
  const initialSrc = useMemo(
    () => getInitialSrc(sources, preferFull),
    [preferFull, sources]
  );
  const loadReportedRef = useRef(false);
  const fallbackAttemptedRef = useRef(false);
  const [src, setSrc] = useState(initialSrc);
  const [status, setStatus] = useState<StableImageStatus>(initialSrc ? 'loading' : 'failed');
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  useEffect(() => {
    loadReportedRef.current = false;
    fallbackAttemptedRef.current = false;
    setSrc(initialSrc);
    setFallbackAttempted(false);
    setStatus(initialSrc ? 'loading' : 'failed');
  }, [initialSrc]);

  useEffect(() => {
    fallbackAttemptedRef.current = fallbackAttempted;
  }, [fallbackAttempted]);

  useEffect(() => {
    if (!preloadFull || !sources.fullProxyUrl || sources.fullProxyUrl === initialSrc) {
      return;
    }

    let isCancelled = false;
    const preloadImage = new Image();

    preloadImage.onload = () => {
      if (!isCancelled && !fallbackAttemptedRef.current) {
        setSrc(sources.fullProxyUrl);
        setStatus('loading');
      }
    };

    preloadImage.onerror = () => {};

    preloadImage.src = sources.fullProxyUrl;

    return () => {
      isCancelled = true;
    };
  }, [initialSrc, preloadFull, sources.fullProxyUrl]);

  const handleLoad = () => {
    setStatus('loaded');

    if (!loadReportedRef.current) {
      loadReportedRef.current = true;
      onLoadSuccess?.();
    }
  };

  const handleError = () => {
    if (
      !fallbackAttempted &&
      sources.directFallbackUrl &&
      src !== sources.directFallbackUrl
    ) {
      fallbackAttemptedRef.current = true;
      setFallbackAttempted(true);
      loadReportedRef.current = false;
      setSrc(sources.directFallbackUrl);
      setStatus('loading');
      return;
    }

    setStatus('failed');
    onTerminalError?.();
  };

  return {
    src,
    status,
    isLoading: status === 'loading' || status === 'idle',
    hasError: status === 'failed',
    handleLoad,
    handleError,
  };
}
