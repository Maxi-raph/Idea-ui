import { test } from 'vitest';
import { render } from '@testing-library/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen';

test('root renders without crashing', () => {
  const router = createRouter({ routeTree });
  render(<RouterProvider router={router} />);
});