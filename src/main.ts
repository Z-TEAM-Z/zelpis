// CSR 主入口文件，根据路径动态加载对应的模板
const currentPath = window.location.pathname;

async function loadTemplate() {
  try {
    if (currentPath.startsWith('/a')) {
      // 加载 React 模板
      await import('../template/a/entry');
    } else if (currentPath.startsWith('/b/vue')) {
      // 加载 Vue 模板 B
      await import('../template/b/entry');
    } else if (currentPath.startsWith('/dashboard')) {
      // 加载 Dashboard 模板
      await import('../template/dashboard/index');
    } else {
      // 默认加载 React 模板
      await import('../template/a/entry');
    }
  } catch (error) {
    console.error('Failed to load template:', error);
    // 加载错误页面或默认页面
    document.querySelector('#app')!.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Loading Error</h1>
        <p>Failed to load the application template.</p>
        <p>Error: ${error}</p>
        <p>Current path: ${currentPath}</p>
      </div>
    `;
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTemplate);
} else {
  loadTemplate();
}
