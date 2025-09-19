import type React from 'react';
import type { Root } from 'react-dom/client';

export async function hydrate(
  type: 'csr' | 'ssr',
  Component: React.ReactNode,
  _props: Record<string, any>,
  mount?: (app: Root) => void,
) {
  if (type === 'csr') {
    const { createRoot } = await import('react-dom/client');

    const root = createRoot(document.querySelector('#app')!);

    mount?.(root);

    return root.render(Component);
  }

  const { hydrateRoot } = await import('react-dom/client');

  const root = hydrateRoot(document.querySelector('#app')!, Component);

  mount?.(root);

  return root;
}
