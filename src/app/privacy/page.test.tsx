import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PrivacyPage, { metadata } from './page';

describe('PrivacyPage', () => {
  it('renders the core privacy policy sections and support links', () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole('heading', { name: 'Privacy Policy', level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Information We Collect', level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'How We Use Information', level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Cookies and Advertising', level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Third-Party Services', level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Data Security', level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Changes to This Policy', level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Contact Information', level: 2 })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'https://policies.google.com/technologies/partner-sites',
      })
    ).toHaveAttribute('href', 'https://policies.google.com/technologies/partner-sites');
    expect(
      screen.getByRole('link', { name: 'https://adssettings.google.com/' })
    ).toHaveAttribute('href', 'https://adssettings.google.com/');
  });

  it('exports privacy-specific metadata', () => {
    expect(metadata.title).toBe('Privacy Policy | Reddit Gallery Viewer');
    expect(metadata.description).toContain('privacy');
    expect(metadata.alternates?.canonical).toBe('/privacy');
  });
});
