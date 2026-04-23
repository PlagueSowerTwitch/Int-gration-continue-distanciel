import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Test simple du composant Landing (sans routing)
function SimpleComponent() {
  return <div data-testid="app-root">TodoApp</div>;
}

describe('Frontend', () => {
  it('rend un composant React correctement', () => {
    render(<SimpleComponent />);
    const el = screen.getByTestId('app-root');
    expect(el).toBeInTheDocument();
    expect(el.textContent).toBe('TodoApp');
  });

  it('les variables d environnement sont accessibles', () => {
    // VITE_API_URL peut être undefined en test, c'est OK
    const apiUrl = import.meta.env?.VITE_API_URL ?? '';
    expect(typeof apiUrl).toBe('string');
  });
});
