<template>
  <div class="box">
    <!-- 遍历路由表，生成左侧菜单 -->
    <template v-for="item in meuns" >
      <div v-if="!item.hidden" v-bind:key="item.id">
        <!-- 一级菜单的情况 -->
        <template v-if="item.children&&item.children.length===1">
          <router-link :to="item.path+'/'+item.children[0].path">
            <!--index跟浏览器地址对应，这样菜单才能显示选中状态  -->
            <el-menu-item :index="item.path+'/'+item.children[0].path">
              <template slot="title">
                <!-- 设置icon -->
                <i v-if="item.children[0].meta.icon" :class="item.children[0].meta.icon"></i>
                <!-- 菜单名称 -->
                {{item.children[0].meta.title}}
              </template>
            </el-menu-item>
          </router-link>
        </template>
        <!-- 一级菜单的情况 end-->
        <!-- 多级菜单 -->
        <template v-else>
          <el-submenu :index="item.path">
            <template slot="title">
              <i :class="item.meta.icon"></i>
              {{item.meta.title}}
            </template>
            <!-- 遍历子菜单 -->
            <template v-for="itemChild in item.children"  >
              <div v-if="!itemChild.hidden" v-bind:key="itemChild.id">
                <!-- 2级菜单时-->
                <template >
                  <router-link :to="item.path+'/'+itemChild.path">
                    <el-menu-item :index="item.path+'/'+itemChild.path">
                      <i v-if="itemChild.meta.icon" :class="itemChild.meta.icon"></i>
                      {{itemChild.meta.title}}</el-menu-item>
                  </router-link>
                </template>
              </div>
            </template>
            <!-- 遍历子菜单 end-->
          </el-submenu>
        </template>
        <!-- 多级菜单 end-->
      </div>
    </template>
  </div>
</template>
<script>

export default {
  name: 'sideMeuns',
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      meuns: ''
    }
  },

  mounted() {
    this.meuns = this.routes
  }
}

</script>

<style lang='less' scoped>
.router-link-active{
  text-decoration: none;
}
a{
  text-decoration: none;
}
</style>