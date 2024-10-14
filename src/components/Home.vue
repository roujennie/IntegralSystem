<template>
  <!--布局容器-->
  <el-container class="main_container">
    <!--顶部栏-->
    <el-header class="home_header">
      <span class="title"> 社区流动人员管理系统 </span>
      <el-dropdown @command="loginOut">
        <span class="el-dropdown-link" style="color:#fff">
          您好！{{loginInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container>
      <!--左侧侧边栏-->
      <!-- <el-aside class="home_aside" width="200px">
        <el-scrollbar style="width:100%">
          <el-menu router :default-active="$route.path" :default-openeds="['1','2','3','4']">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-s-marketing"></i>数据分析</template>
              <el-menu-item-group>
                <el-menu-item index="/analyze">数据分析</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-s-custom"></i>个人中心</template>
              <el-menu-item-group>
                <el-menu-item index="/person/center">个人中心</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-user-solid"></i>用户管理</template>
              <el-menu-item-group>
                <el-menu-item index="/user/list">管理者列表</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="/user/permission">权限列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title"><i class="el-icon-s-home"></i>人口管理</template>
              <el-menu-item-group>
                <el-menu-item index="/mobilityPeople/list">社区居民列表</el-menu-item>
                <el-menu-item index="/mobilityPeople/where">流动人口去向列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-aside> -->
      <el-aside class="home_aside" width="200px" >
        <el-scrollbar style="width:100%">
          <el-menu class="sub_meuns_wapper"
                 mode="vertical"
                 :default-active="$route.path">
          <!-- 菜单组件 -->
          <side-Meuns :routes="getRoutes"></side-Meuns>
        </el-menu>

        </el-scrollbar>
      </el-aside>

      <!--主要区域容器-->
      <el-main class="home_main">
        <!-- <router-view></router-view> -->
        <router-view/>
      </el-main>
      
    </el-container>

  </el-container>
</template>

<script>
import sideMeuns from '../components/sideMeuns'
export default {
    computed: {
      getRoutes() {
        return global.antRouter
      }

    },
    components: {
      sideMeuns
    },
    data() {
        return {
          loginInfo:{
            name:null
          },
          userRole: 'Topest',
        };
    },
    created(){
      this.getLoginInfo();
    },
    methods: {
      loginOut() {
        //清空token
        window.sessionStorage.clear();
        localStorage.setItem("userRole", 'unload');
        window.location.href = window.location.origin + window.location.pathname
        
        //跳转到登录页
        // this.$router.push("/login");
        this.$router.push("/");

        this.$message.success("您已成功退出登录!");

      },
      async getLoginInfo(){
        let token = sessionStorage.getItem('token')
        await this.$http.post("user/loginInfo?token="+token)
        .then((res=>{
          // console.log(res)
          if(res.data == null){
            this.$message.console.error("会话已过期，请重新登录！");
            this.$router.push("/");
          }
          this.loginInfo = res.data.loginInfo
        }).bind(this))
      }
    }
};
</script>

<style lang='less' scoped>
.main_container {
  height: 100vh;
}
.el-header {
  background-color: #001529;
  line-height: 60px;
  .title{
    color: #fff;
  }
}
.home_header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  // color: #001529;
  height: 100%;
}


</style>