import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { StableImageSources } from './image-sources';
import { useStableImage } from './use-stable-image';

class MockImage extends EventTarget {
  static instances: MockImage[] = [];

  onload: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  private currentSrc = '';

  constructor() {
    super();
    MockImage.instances.push(this);
  }

  set src(value: string) {
    this.currentSrc = value;
  }

  get src() {
    return this.currentSrc;
  }

  triggerLoad() {
    this.onload?.(new Event('load'));
  }

  triggerError() {
    this.onerror?.(new Event('error'));
  }
}

function Harness({
  sources,
  preloadFull = false,
  preferFull = false,
  onLoadSuccess,
  onTerminalError,
}: {
  sources: StableImageSources;
  preloadFull?: boolean;
  preferFull?: boolean;
  onLoadSuccess?: () => void;
  onTerminalError?: () => void;
}) {
  const image = useStableImage({
    sources,
    preloadFull,
    preferFull,
    onLoadSuccess,
    onTerminalError,
  });

  return (
    <>
      <div data-testid="status">{image.status}</div>
      <img
        data-testid="image"
        alt="test"
        src={image.src}
        onLoad={image.handleLoad}
        onError={image.handleError}
      />
    </>
  );
}

describe('useStableImage', () => {
  const originalImage = globalThis.Image;

  beforeEach(() => {
    MockImage.instances = [];
    globalThis.Image = MockImage as unknown as typeof Image;
  });

  afterEach(() => {
    globalThis.Image = originalImage;
    vi.restoreAllMocks();
  });

  it('falls back to the direct URL once after a proxy error', async () => {
    const onTerminalError = vi.fn();
    const onLoadSuccess = vi.fn();

    render(
      <Harness
        sources={{
          placeholderProxyUrl: '/api/proxy-image?url=placeholder',
          fullProxyUrl: '/api/proxy-image?url=full',
          directFallbackUrl: 'https://i.redd.it/direct.jpg',
        }}
        onLoadSuccess={onLoadSuccess}
        onTerminalError={onTerminalError}
      />
    );

    const image = screen.getByTestId('image');

    expect(image).toHaveAttribute('src', '/api/proxy-image?url=placeholder');
    expect(screen.getByTestId('status')).toHaveTextContent('loading');

    fireEvent.error(image);

    await waitFor(() => {
      expect(image).toHaveAttribute('src', 'https://i.redd.it/direct.jpg');
    });

    fireEvent.load(image);

    expect(screen.getByTestId('status')).toHaveTextContent('loaded');
    expect(onLoadSuccess).toHaveBeenCalledTimes(1);
    expect(onTerminalError).not.toHaveBeenCalled();
  });

  it('switches to the full proxy URL only after the preload succeeds', async () => {
    render(
      <Harness
        preloadFull
        sources={{
          placeholderProxyUrl: '/api/proxy-image?url=placeholder',
          fullProxyUrl: '/api/proxy-image?url=full',
          directFallbackUrl: 'https://i.redd.it/direct.jpg',
        }}
      />
    );

    const image = screen.getByTestId('image');

    expect(image).toHaveAttribute('src', '/api/proxy-image?url=placeholder');
    expect(MockImage.instances).toHaveLength(1);

    await act(async () => {
      MockImage.instances[0].triggerLoad();
    });

    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/api/proxy-image?url=full');
    });

    expect(screen.getByTestId('status')).toHaveTextContent('loading');
  });

  it('enters a failed state after the fallback source also errors', async () => {
    const onTerminalError = vi.fn();

    render(
      <Harness
        sources={{
          placeholderProxyUrl: '/api/proxy-image?url=placeholder',
          fullProxyUrl: '/api/proxy-image?url=placeholder',
          directFallbackUrl: 'https://i.redd.it/direct.jpg',
        }}
        onTerminalError={onTerminalError}
      />
    );

    const image = screen.getByTestId('image');

    fireEvent.error(image);

    await waitFor(() => {
      expect(image).toHaveAttribute('src', 'https://i.redd.it/direct.jpg');
    });

    fireEvent.error(image);

    expect(screen.getByTestId('status')).toHaveTextContent('failed');
    expect(onTerminalError).toHaveBeenCalledTimes(1);
  });

  it('does not switch back to the proxy source after a direct fallback has loaded', async () => {
    render(
      <Harness
        preloadFull
        sources={{
          placeholderProxyUrl: '/api/proxy-image?url=placeholder',
          fullProxyUrl: '/api/proxy-image?url=full',
          directFallbackUrl: 'https://i.redd.it/direct.jpg',
        }}
      />
    );

    const image = screen.getByTestId('image');

    fireEvent.error(image);

    await waitFor(() => {
      expect(image).toHaveAttribute('src', 'https://i.redd.it/direct.jpg');
    });

    fireEvent.load(image);

    await act(async () => {
      MockImage.instances[0].triggerLoad();
    });

    expect(image).toHaveAttribute('src', 'https://i.redd.it/direct.jpg');
    expect(screen.getByTestId('status')).toHaveTextContent('loaded');
  });
});
