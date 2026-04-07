import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactPage, { metadata } from './page';

describe('ContactPage', () => {
  it('renders the contact page heading and email link', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', { name: 'Contact', level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'discostrawberrycat@outlook.com' })
    ).toHaveAttribute('href', 'mailto:discostrawberrycat@outlook.com');
  });

  it('exports contact page metadata', () => {
    expect(metadata.title).toBe('Contact | Reddit Gallery Viewer');
    expect(metadata.alternates?.canonical).toBe('/contact');
  });
});
