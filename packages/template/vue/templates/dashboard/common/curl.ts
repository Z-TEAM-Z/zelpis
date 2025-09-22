// @ts-ignore
import md5 from 'md5';
import { ElMessage } from 'element-plus';
import axios from 'axios';

// 扩展 window 类型
declare global {
  interface Window {
    projKey?: string;
  }
}

interface CurlOptions {
  url?: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  headers?: Record<string, any>;
  query?: Record<string, any>;
  data?: any;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  errorMessage?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  metadatas?: any;
  message?: string;
  code?: number;
}

/**
 * 前端封装的curl方法
 * @param options 请求参数
 */
const curl = ({
  url = '', // 请求地址
  method = 'get', // 请求方法
  headers = {}, // 请求头
  query = {}, // 请求参数 url query
  data = {}, // post body
  timeout = 30000, // 超时
  responseType = 'json', // 返回数据类型
  errorMessage = '网络异常',
}: CurlOptions): Promise<ApiResponse> => {
  // 接口签名处理（让接口变动态）
  const signKey = 'mshsiksjksnnmsma';
  const st = Date.now();
  const dtoHeaders = {
    ...headers,
    s_t: st,
    s_sign: md5(`${signKey}_${st}`),
  };
  if (url.indexOf('/api/proj/') > -1 && window.projKey) {
    dtoHeaders.proj_key = window.projKey;
  }

  // 构造请求参数(把参数转换为axios参数)
  const ajaxSettings = {
    url,
    method,
    params: query,
    data,
    timeout,
    responseType,
    headers: dtoHeaders,
  };
  return axios
    .request(ajaxSettings)
    .then((res) => {
      const resData = res.data || {};
      // 后端API返回数据格式
      const { success } = resData;
      // 失败
      if (!success) {
        const { message, code } = resData;
        console.log('🚀 ~ returnaxios.request ~ message:', message);
        if (code === 442) {
          ElMessage.error('请求参数异常');
        } else if (code === 445) {
          ElMessage.error('请求不合法');
        } else if (code === 446) {
          ElMessage.error('项目标识不存在');
        } else if (code === 5000) {
          ElMessage.error(message);
        } else {
          ElMessage.error(errorMessage);
        }
        return Promise.resolve({ success, message, code });
      }
      // 成功
      const { data, metadatas } = resData;
      return Promise.resolve({ success, data, metadatas });
    })
    .catch((err) => {
      const { message } = err;
      if (message.match(/timeout/)) {
        return Promise.resolve({
          success: false,
          message: 'Request timeout',
          code: 504,
        });
      }
      return Promise.resolve(err);
    });
};

export default curl;
