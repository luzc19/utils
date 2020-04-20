import axios from 'axios';
import Qs from 'qs';
import { Loading, Message } from 'element-ui';
import { pull } from 'lodash';
import router from '@/router';

// 添加loading提示，并在返回时去除
const loadingTips = {
  loadingInstance: null,
  queue: [],
  set(name, tips) {
    this.queue.push(name);
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        text: typeof tips === 'string' ? tips : '',
        fullscreen: true,
      });
    }
  },
  close(name) {
    pull(this.queue, name);
    if (this.queue.length === 0 && this.loadingInstance) {
      this.loadingInstance.close();
      this.loadingInstance = null;
    }
  },
};

axios.defaults.baseURL = '/api/';
axios.interceptors.request.use((config) => {
  const newConfig = Object.assign({}, config, {
    headers: {
      ...config.headers,
      outsideRequestId: Date.now() + '-' + Math.ceil((Math.random() * 10000)),
    },
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'brackets' });
    },
  });
  if (newConfig.loadingTips) {
    // 默认加上前缀斜杠
    loadingTips.set(newConfig.url.charAt(0) === '/' ? newConfig.url : '/' + newConfig.url, newConfig.loadingTips);
  }
  return newConfig;
}, error => Promise.reject(error));

axios.interceptors.response.use((response) => {
  // config 被加上了baseURL前缀，去除掉
  loadingTips.close('/' + response.config.url.replace(response.config.baseURL, ''));
  if (response.config.errorTips !== false && !response.data.success) {
    if (response.data.code === 210) {
      // 跳转登录会关闭iframe导致提示也一起被关闭，所以使用顶层提示message
      window.top.$topVue.$message({ type: 'error', message: response.data.message });
      router.push('/Login');
    } else {
      // 当前frame提示message
      Message({ type: 'error', message: response.data.message });
    }
  }
  return response.data;
}, (error) => {
  console.error(error);
  loadingTips.close('/' + error.config.url.replace(error.config.baseURL, ''));
  if (error.config.errorTips !== false) {
    Message({
      type: 'error',
      message: '服务器或者网络错误',
    });
  }
  return Promise.reject(error);
});

function install(framework) {
  Object.defineProperty(framework.prototype, '$axios', { value: axios });
}

export default {
  install,
};
