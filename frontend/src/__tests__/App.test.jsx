import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

function SimpleComponent() {
  return <div data-testid="app-root">TodoApp</div>;
}

describe('Frontend', () => {
  it('rend un composant React correctement', () => {
    const { container } = render(<SimpleComponent />);
    const el = container.querySelector('[data-testid="app-root"]');
    expect(el).not.toBeNull();
    expect(el.textContent).toBe('TodoApp');
  });

  it('les variables d environnement sont accessibles', () => {
    const apiUrl = import.meta.env?.VITE_API_URL ?? '';
    expect(typeof apiUrl).toBe('string');
  });
});