import axios from "axios"; //引用axios

// axios 配置
const request=axios.create({
  timeout:5000,
  baseUrl:"http://localhost:8081/community/"   // 我们在请求接口的时候就不同写前面 会自动我们补全
})

request.interceptors.request.use(    
  config => {
    return config;
  },
  err => {
    console.log(err)
  }
);

// // 请求拦截器（所有发送的请求都要从这儿过一次），通过这个，我们就可以把token传到后台，
// request.interceptors.request.use(    
//   config => {
//     // config.data = JSON.stringify(config.data);  // 这里我们也可以在过滤下 请求参数数据
//     config.headers = {    // 设置请求头   常用语post请求 
//       "Content-Type": "application/json",
//       "Authorization": window.sessionStorage.getItem('token')
//      };
//     console.log(config)
//     return config;
//   },
//   err => {
//     console.log(err)
//   }
// );
// //  响应拦截器    请求回来的结果 先在这里过一遍

// request.interceptors.response.use(
//   response => { 
//     if (response.status == 201) { //  请求回来的状态除了 200 其他的 均是不对的数据 在这里统一处
//       this.$router.push({
//         path: "/login"      //  如果回来状态不对 还是返回 请求页面
//       });
//     }
//     return response;   // 返回请求回来的数据
//   },
//   err => {
//     console.log(err)
//   }
// );
export default request;   // 把配置好的对象 导出
