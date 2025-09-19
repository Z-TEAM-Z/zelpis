import { createHashRouter } from 'react-router';
import { Blog } from '../pages/blog';
import { Home } from '../pages/home';

export const router = createHashRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/blog',
    children: [
      { index: true, Component: Blog },
      {
        path: ':id',
        Component: Blog,
        loader: async (args) => {
          const { id } = args.params;
          return { id, name: `blog ${id}` };
        },
      },
    ],
  },
]);
