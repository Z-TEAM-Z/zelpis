import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
// @ts-expect-error any
import Blog from '../pages/blog.vue';
// @ts-expect-error any
import Home from '../pages/home.vue';

const routes = [
  { path: '/', component: Home },
  {
    path: '/blog',
    children: [
      { path: '', component: Blog },
      {
        path: ':id',
        component: Blog,
        props(to) {
          const { id } = to.params;
          return { id, name: `blog ${id}` };
        },
      },
    ],
  },
] satisfies RouteRecordRaw[];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
