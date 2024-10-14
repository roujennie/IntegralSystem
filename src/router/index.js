import Vue from 'vue'
import Router from 'vue-router'
const index = () => import('@/components/index')
const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')
const UserList = () => import('@/components/user/list')
const center = () => import('@/components/person/center')
const mobilityPeopleList = () => import('@/components/mobilityPeople/list')
const mobilityPeopleWhere = () => import('@/components/mobilityPeople/where')
const analyze = () => import('@/components/analyze')
const permission = () => import('@/components/user/permission')

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export const permissionRouter = [
  { 
    path: '/person',
    component: Home,
    meta:{
      title:'个人中心',
      roles:['1','2','3','4','5'],
      icon:"el-icon-s-custom"
    },
    children:[{    
      path: '',
      component: center,
      meta:{
        title:'个人中心',
        roles:['1','2','3','4','5'],
        icon:"el-icon-s-custom"
      },
    },
  ]
  },
  {    
    path: '/user',
    component: Home,
    meta:{
      title:'角色管理',
      roles:['1'],
      icon:"el-icon-user-solid"
    },
    children:[{    
      path: 'list',
      component: UserList,
      meta:{
        title:'管理角色列表',
        roles:['1'],
      }
    },
    {
      path: 'permission',
      component: permission,
      meta:{
        title:'菜单列表',
        roles:['1'],
      }
    },]
  },
  {    
    path: '/mobilityPeople',
    component: Home,
    meta:{
      title:'人口管理',
      roles:['1','2'],
      icon:"el-icon-s-home"
    },
    children:[{
      path: 'list',
      component: mobilityPeopleList,
      meta:{
        title:'社区居民列表',
        roles:['1','2']
      }
    },
    {
      path: 'where',
      component: mobilityPeopleWhere,
      meta:{
        title:'流动人口去向列表',
        roles:['1','2']
      }
    },]
  },
  { 
    path: '/analyze',
    component: Home,
    meta:{
      title:'人员动态展示',
      roles:['1','2'],
      icon:"el-icon-s-marketing"
    },
    children:[{    
      path: '',
      component: analyze,
      meta:{
        title:'人员动态展示',
        roles:['1','2'],
        icon:"el-icon-s-marketing"
      },
    },
  ]
  },
      
]
//公共路由
export const fixedRouter = [
  	// { 
    //   path: '/', 
    //   redirect: '/login' 
    // },
    { 
      path: '', 
      component: Login,
      hidden: true
    },
    { 
      path: '', 
      component: Home ,
      children:[{
        path: 'index',
        component: index,
        meta:{
          title:'首页',
          roles:[1,2,3,4,5],
          icon:"el-icon-info"
        }
      },]
    },
]

export default new Router({
  mode:'history',
	routes: fixedRouter
})