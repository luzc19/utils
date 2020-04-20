// 引入基础框架，库
import Vue from 'vue';
import ElementUI from 'element-ui';
import VueImg from 'v-img';
import vGallery from 'v-gallery';

// 引入监控
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
// 引入应用基础设置
import './element-variables.scss';
import './common.css';
import './assets/fonts/iconfont.css';
import './components/cty-table.css';
import App from './App.vue';
import router from './router';
import directives from './directives';
import axiosConfig from './axiosConfig';

// 引入业务相关
import ctyLink from './components/cty-link.vue';
import money from './components/money.vue';

// 配置监控
if (process.env.VUE_APP_ENV === 'production') {
  Raven
    .config('http://7dd7a28715424979b935717e4f2d50a8@sentry.autocloudpro.com/3', {
      ignoreErrors: ['cancel'],
    })
    .addPlugin(RavenVue, Vue)
    .install();
}

Vue.use(vGallery);
Vue.use(ElementUI, { size: 'small' });
Vue.use(VueImg);
Vue.use(directives);
Vue.use(axiosConfig);

Vue.component('ctyLink', ctyLink);
Vue.component('money', money);

Vue.config.productionTip = false;

// 定义全局的空节点接收全局事件
// 使用时在created 周期函数中调用 window.eventCenter.$on()
// 在各组件中 window.eventCenter.$emit()
// 如非必要，慎用全局事件
window.eventCenter = new Vue({});

window.$topVue = new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
