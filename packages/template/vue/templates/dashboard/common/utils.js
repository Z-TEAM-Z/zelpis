const utils = {
  /**
   * 防抖
   * @param {防抖的方法} fn
   * @param {防抖的时间} delay
   */
  debounce: (fn, delay=0) => {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  },
    
  /**
   * 节流
   * @param {节流的方法} fn
   * @param {节流的时间} delay
   */
  throttle: (fn, delay=0) => {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime > delay) {
        fn.apply(this, args);
        lastTime = now;
      }
    };
  },
};
export default utils;
