import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AboutPage, { metadata } from './page';

describe('AboutPage', () => {
  it('renders the about page heading and core product copy', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('heading', { name: 'About Reddit Gallery Viewer', level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText(/simpler way to browse image-heavy subreddits/i)).toBeInTheDocument();
    expect(screen.getByText(/no login, no app, and no extra setup/i)).toBeInTheDocument();
    expect(screen.getByText(/designers collecting references/i)).toBeInTheDocument();
    expect(screen.getByText(/filters adult-marked image posts from the gallery/i)).toBeInTheDocument();
  });

  it('exports about page metadata', () => {
    expect(metadata.title).toBe('About | Reddit Gallery Viewer');
    expect(metadata.alternates?.canonical).toBe('/about');
  });
});
