<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--搜索与添加区域-->  
      <el-form :model="searchForm">
        <el-row :gutter="24" class="el-row">
          <el-col :span="8">
            <span label="姓名" prop="name">姓名</span>
            <el-input v-model="searchForm.name" clearable placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="8">
            <span>角色类型</span>
            <el-select v-model="searchForm.role" multiple placeholder="请选择" style="width: 100%">
              <el-option v-for="item in roleList" :key="item.role" :label="item.name" :value="item.role"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span label="联系电话" prop="tel">联系电话</span>
            <el-input v-model="searchForm.tel" clearable placeholder="请输入内容" ></el-input>
          </el-col> 
        </el-row>
        <el-row :gutter="24" class="el-row">
          <el-col :span="24" style="display: flex; justify-content: center; align-items: center">
            <el-button type="primary" icon="el-icon-search" @click="getUserList">搜索</el-button>
            <el-button plain icon="el-icon-refresh" @click="searchDialogClosed">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!--用户列表区域-->
    <el-card>
      <div slot="header" class="clearfix">
        <span>管理者列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addDialogVisible = true">添加用户</el-button>
      </div>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="电话" prop="tel"></el-table-column>
        <el-table-column label="角色" prop="role">
          <template slot-scope="scope">
            <span v-if="scope.row.role == 1">管理员</span>
            <span v-if="scope.row.role == 2">社区工作人员</span>
            <!-- <span v-if="scope.row.role == 3">社区居民</span> -->
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value=1 :inactive-value=0 @change="userStatusChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" @click="removeUserById(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <!--详情按钮-->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <el-button @click="showDetailDialog(scope.row.id)" type="warning" icon="el-icon-s-order" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.current"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!--添加用户的对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!--内容主体区域-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="tel">
            <el-input v-model="addForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" >
            <el-input v-model="addForm.password" show-password name="password"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-radio v-model="addForm.role" label=1 size="medium">管理员</el-radio>
            <el-radio v-model="addForm.role" label=2 size="medium">社区工作人员</el-radio>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="addForm.status" :active-value=1 :inactive-value=0></el-switch>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户的对话框-->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!--内容主体区域-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="姓名">
            <el-input v-model="editForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="tel">
            <el-input v-model="editForm.tel" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" placeholder="请输入密码" show-password name="password"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="editForm.role" placeholder="请选择一个角色" style="width: 100%">
              <el-option v-for="item in roleList" :key="item.role" :label="item.name" :value="Number(item.role)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!--详情居民的对话框-->
      <el-dialog title="详情居民信息" :visible.sync="detailDialogVisible" width="50%" @close="detailDialogClosed" >
        <!--内容主体区域-->
        <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{detailForm.name}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{detailForm.tel}}
        </el-descriptions-item>
        
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-price-tag"></i>
            角色类型
          </template>
          <el-tag size="small">{{detailForm.role == 1 ? '管理员' : '社区工作人员'}}</el-tag>
        </el-descriptions-item>

      </el-descriptions>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        //合法的手机号码
        return cb();
      }
      cb(new Error("手机号码格式不正确"));
    };

    return {
      //获取用户列表的参数对象
      searchForm: {
        name:null,
        tel:null,
        role:[],
        current: 1,
        size: 5,
      },
      userList: [],
      total: 0,
      //控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改用户的对话框的显示与隐藏
      editDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        name: "",
        password: "",
        tel: "",
        role: "",
        status:""
      },
      //添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "姓名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6,  max: 15, message: "密码的长度在6~15个字符之间", trigger: "blur"},
        ],
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择一种角色" }],
        status: [{ required: true, message: "请选择一种状态" }],
      },
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6,  max: 15, message: "密码的长度在6~15个字符之间", trigger: "blur"},
        ],
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择一种角色", trigger: "blur" }],
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      roleList: [],
      // 已选中的角色id
      selectedRoleId: "",
      editRoleForm: {},
      //详情表单的的表单数据
      detailForm: {},
      //控制详情居民的对话框的显示与隐藏
      detailDialogVisible: false,
    };
  },
  created() {
    this.getUserList();
    this.getRoleList();
  },
  methods: {
    async getUserList() {
      let form = JSON.parse(JSON.stringify(this.searchForm))
      form = this.$qs.stringify(form,{arrayFormat: 'repeat'})
      form = decodeURIComponent(form)
      const { data: res } = await this.$http.get("user/search?"+form);
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.records;
      this.total = res.data.total;
      this.$message.success("查询成功！");
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.searchForm.size = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.searchForm.current = newPage;
      this.getUserList();
    },
    //监听 Switch状态的改变
    async userStatusChanged(userInfo) {
      const { data: res } = await this.$http.post("user/update",userInfo);
      // console.log(res)
      if (res.meta.status !== 200) {
        userInfo.status = !userInfo.status;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击确定按钮，进行添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return;
        //可以发起添加用户的请求
        console.log("要提交的用户表单",this.addForm)
        const { data: res } = await this.$http.post("user/add", this.addForm);
        // console.log(res)
        if (res.meta.status !== 201)
          return this.$message.error("添加用户失败！");
        this.$message.success("添加用户成功!");
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    //展示修改用户的对话框
    async showEditDialog(id) {
      console.log(id);
      const { data: res } = await this.$http.get("user/searchOneById?id=" + id);
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error("查询用户信息失败!");
      this.editForm = res.data;
      this.editDialogVisible = true;
      //console.log(editForm)    
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户的表单预验证
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        //console.log(valid)
        if (!valid) return;
        //可以发起修改用户的请求
        // console.log(this.editForm)
        const { data: res } = await this.$http.post("user/update",this.editForm);
        // //console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error("更新用户信息失败!");
        //隐藏添加用户的对话框
        this.editDialogVisible = false;
        //刷新数据列表
        this.getUserList();
        //提示修改成功
        this.$message.success("更新用户信息用户成功!");
      });
    },
    //根据id删除用户信息
    async removeUserById(id) {
      console.log(id)
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm("此操作将永久删除该用户, 是否继续?","提示",{
        confirmButtonText: "确定",cancelButtonText: "取消",type: "warning",}
      ).catch((err) => err);
      //如果用户确认删除，则返回值为字符串 confirm
      //如果用户取消删除，则返回值为字符串 cancel
      //console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.get("user/delete?id=" + id);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败！");
      this.$message.success("删除用户成功!");
      //刷新用户列表
      this.getUserList();
    },
    async getRoleList() {
      // 在展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http.get("role/search");
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error("获取角色列表失败！");
      res.data.roleList.splice(2,5)
      this.roleList = res.data.roleList;
    },
    //展示详情居民的对话框
    async showDetailDialog(id) {
      console.log(id);
      const { data: res } = await this.$http.get("user/searchOneById?id=" + id);
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error("查询居民信息失败!");
      this.detailForm = res.data;
      this.detailDialogVisible = true;
      console.log(this.detailForm)
      
    },
    //监听详情居民对话框的关闭事件
    detailDialogClosed() {
      this.detailDialogVisible = false;
    },
    //监听添加居民对话框的关闭事件
    searchDialogClosed() {
      this.searchForm = this.$options.data().searchForm
      // this.searchForm = {}
      console.log("已重置表单",this.searchForm)
    },
    
  },
};
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
.el-dialog{
  .roleDialog{
    p{
      margin-bottom: 16px;
    }
  }
}
</style>