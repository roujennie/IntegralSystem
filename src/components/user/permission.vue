<template>
<div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-tree :data="permissionList" :props="defaultProps" node-key="id"
        :default-expanded-keys="[1,2,3,4,5,6]" @node-click="handleNodeClick"></el-tree>
    </el-card>
  </div>
</template>

<script>
export default {
// import 引入的组件需要注入到对象中才能使用
components: {},
props: {},
data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        permissionList:[]
      };
},
created() {
    this.getPermissionList()
},
methods: {
  handleNodeClick(data) {
    // console.log(data);
  },
  async getPermissionList(){
      await this.$http.get("permission/search")
      .then((res=>{
        // console.log(res)
        if(res.status != 200) this.$message.error("查询失败！");
        this.permissionList = res.data
        this.$message.success("查询成功！");
      }).bind(this))

      // await this.$http.get("user/searchOneByUserName?userName="+this.loginInfo.userName)
      // .then((res=>{
      //   console.log(res.data)
      //   this.loginInfo = res.data.data
      // }).bind(this))
    }
},
// 计算属性 类似于 data 概念
computed: {},
// 监控 data 中的数据变化
watch: {},
// 生命周期 - 创建完成（可以访问当前this 实例）
setup () {
},
// 生命周期 - 挂载完成（可以访问 DOM 元素）
onMounted () {
},
onBeforeMount () {
}, // 生命周期 - 挂载之前
onBeforeUpdate () {
}, // 生命周期 - 更新之前
onUpdated () {
}, // 生命周期 - 更新之后
onBeforeUnmount () {
}, // 生命周期 - 销毁之前
onUnmounted () {
}, // 生命周期 - 销毁完成
onErrorCaptured () {
} // 如果页面有 keep-alive 缓存功能,这个函数会触发
}
</script>

<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 18px;
}
.el-card{
  margin-bottom: 18px;
}
.el-row {
  margin-bottom: 18px;
  .el-col {
    display: flex;
    align-items: center;
    span {
      font-weight: bolder;
      white-space: nowrap;
      margin-right: 16px;
    }
  }
}
</style>