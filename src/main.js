import Vue from 'vue'
import App from './App.vue'
// import 'default-passive-events'
import router from './router/index.js'
import axios from 'axios'
import './utils/global'//全局
import './permission.js'
//qs库
import qs from 'qs'
Vue.prototype.$qs= qs;
//axios全局注册
Vue.prototype.$http = axios

axios.defaults.baseURL = 'http://localhost:8081/community/'


axios.interceptors.request.use(    
  config => {
    NProgress.start()
    config.headers = { 
      "Authorization": sessionStorage.getItem('token'),
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      // "token":sessionStorage.getItem('token')
     };
    // console.log(config)
    return config;
  },
  err => {
    console.log(err)
  }
);

axios.interceptors.response.use(
  async (config) => {
    NProgress.done()
    config.headers = { 
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
     };
    if(config.data.error == "error"){
      // message.error("会话已过期，请重新登录！");
      router.push('/')
    }
    // console.log(config)
    return config;
  }, error => {
    // console.log(config)
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


import echarts from "echarts";
Vue.prototype.$echarts = echarts;

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 自定义格式化时间的全局过滤器
Vue.filter('dateFormat',function(originVal){
  const dt =new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() +'').padStart(2,'0')
//padStart(2,'0') 意思是不足两位自动补0
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
