import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router';

const siderRoutes = [
  {
    path: 'iframe',
    component: () => import('./complex-view/iframe-view/iframe-view.vue'),
  },
  {
    path: 'schema',
    component: () => import('./complex-view/schema-view/schema-view.vue'),
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    redirect: '/view/dashboard/schema',
    name: 'Dashboard',
    children: [{
      path: '/view/dashboard/iframe',
      component: () => import('./complex-view/iframe-view/iframe-view.vue'),
    },{
      path: '/view/dashboard/schema',
      component: () => import('./complex-view/schema-view/schema-view.vue'),
    },{
      path: '/view/dashboard/sider',
      component: () => import('./complex-view/sider-view/sider-view.vue'),
      children: siderRoutes,
    },{
      path: '/view/dashboard/sider/:chapters+',
      component: () => import('./complex-view/sider-view/sider-view.vue'),
    }]
  }
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 添加动态路由的方法
export function addDashboardRoute(route: RouteRecordRaw) {
  // 确保路径以 /view/dashboard/ 开头
  if (!route.path.startsWith('/view/dashboard/')) {
    route.path = `/view/dashboard${route.path.startsWith('/') ? '' : '/'}${route.path}`;
  }
  
  // 添加到 Dashboard 路由的 children 中
  router.addRoute('Dashboard', route);
}

// 批量添加路由的方法
export function addDashboardRoutes(routes: RouteRecordRaw[]) {
  routes.forEach(route => addDashboardRoute(route));
}

// 获取当前 Dashboard 的所有子路由
export function getDashboardRoutes() {
  const dashboardRoute = router.getRoutes().find(route => route.name === 'Dashboard');
  return dashboardRoute?.children || [];
}

export default router;