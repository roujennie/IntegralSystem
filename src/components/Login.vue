<template>
<div class="container">
    <div class="login">
        <img class="img" src="../assets/login_.jpg"/>
        <div class="box">
            <div class="title">欢迎登录社区流动人员管理系统</div>
            <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules" class="form">
                <el-form-item prop="tel">
                    手机号
                    <el-input placeholder="请输入手机号" prefix-icon="el-icon-user" v-model="loginForm.tel" clearable></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    密码
                    <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" show-password name="password" v-model="loginForm.password" clearable></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="addDialogVisible = true">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="注册用户" :visible.sync="addDialogVisible" width="60%" @close="addDialogClosed">
        <!--内容主体区域-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px" :inline="true">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="tel">
            <el-input v-model="addForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" show-password name="password"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="addForm.sex" :label=1 size="medium">男</el-radio>
            <el-radio v-model="addForm.sex" :label=0 size="medium">女</el-radio>
          </el-form-item>
          <el-form-item label="文化程度" prop="education">
            <el-select v-model="addForm.education" placeholder="请选择" style="width:100%" clearable>
              <el-option v-for="item in educationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select v-model="addForm.nation" placeholder="请选择" style="width:100%" clearable>
              <el-option v-for="item in nationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-if="addForm.cardid == null" v-model="addForm.cardid"></el-input>
            <el-input v-else v-model="addForm.cardid" dibled></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="role">
            <el-radio v-model="addForm.role" label=3 size="medium">本小区居民</el-radio>
            <el-radio v-model="addForm.role" label=4 size="medium">租客</el-radio>
            <el-radio v-model="addForm.role" label=5 size="medium">访客</el-radio>
          </el-form-item>
          <el-form-item label="与房主关系" prop="relation">
            <el-radio v-model="addForm.relation" :label=1 size="medium">本人</el-radio>
            <el-radio v-model="addForm.relation" :label=2 size="medium">亲戚朋友</el-radio>
            <el-radio v-model="addForm.relation" :label=3 size="medium">租客</el-radio>
          </el-form-item>
          <el-form-item label="户口所在地" prop="registration">
            <el-cascader :options="cityData" v-model="addForm.registration" style="width:100%"></el-cascader>
          </el-form-item>
          <el-form-item label="房屋地址" prop="building">
            <el-cascader :options="addressData" v-model="addForm.building" style="width:100%"></el-cascader>
          </el-form-item>
          <el-form-item label="工作单位" prop="workplace">
            <el-input v-model="addForm.workplace" clearable></el-input>
          </el-form-item>
          <!-- <div v-if="addForm.role == 3"> -->

          <!--租客、访客专属-->
          <!-- <div v-if="addForm.role == 4 || addForm.role == 5"> -->
            <el-form-item label="到达本小区时间" prop="reachtime">
                <el-date-picker v-model="addForm.reachtime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="预计停留时长" prop="staytime">
                <el-cascader :options="stayTime" v-model="addForm.staytime" style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item label="离开本小区时间" prop="leavetime">
                <el-date-picker v-model="addForm.leavetime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="访问事由" prop="reason">
                <el-input v-model="addForm.reason" clearable></el-input>
            </el-form-item>
            <el-form-item label="去向">
              <el-cascader :options="cityData" v-model="addForm.going" style="width:100%" :props="{ checkStrictly: true }"></el-cascader>
            </el-form-item>
            
          <!-- </div> -->
          
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    
</div>
</template>

<script>
import cityData from '../components/mobilityPeople/citydata.js'
import addressData from '../components/mobilityPeople/address.js'
import nationData from '../components/mobilityPeople/nation.js'
export default {
// import 引入的组件需要注入到对象中才能使用
components: {},
props: {},
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
        cityData,
        addressData,
        nationData,
        cityDataSec:[],
        //登录表单的数据绑定对象
        loginForm: {
            tel:"19817597240",
            // tel:"18857353810",
            password: "1234567"
        },
        //表单的验证规则对象
        loginFormRules: {
        //验证用户名是否合法
          tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        //验证密码是否合法
          password: [
              { required: true, message: "请输入登录密码", trigger: "blur" },
              { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
          ]
        },
        //控制添加用户的对话框的显示与隐藏
        addDialogVisible: false,
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
      },
      educationList: [{
          value: '文盲/半文盲',
          label: '文盲/半文盲'
        },{
          value: '小学',
          label: '小学'
        },{
          value: '初中',
          label: '初中'
        },{
          value: '高中',
          label: '高中'
        }, {
          value: '大学本科/专科',
          label: '大学本科/专科'
        }, {
          value: '硕士',
          label: '硕士'
        }, {
          value: '博士',
          label: '博士'
        }],
      value: '',
      stayTime: [{
          value: 1,
          label: '1小时'
        }, {
          value: 2,
          label: '3小时'
        }, {
          value: 3,
          label: '12小时'
        }, {
          value: 4,
          label: '1天'
        }, {
          value: 5,
          label: '3天'
        },
        {
          value: 6,
          label: '7天'
        },{
          value: 7,
          label: '半个月'
        },{
          value: 8,
          label: '1个月'
        },{
          value: 9,
          label: '3个月'
        },{
          value: 10,
          label: '长期'
      }],
    };
},
methods: {
    async login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        await this.$http.post("user/login", this.loginForm)
        .then((res=>{
            // console.log("res.data",res.data.length)
            if (res.data.status == 0){
                return this.$message.error("登录失败！您的账号暂时被禁止登录，请联系管理员！");
            }else if(res.data.count == 0 || res.data.token == undefined){
                return this.$message.error("登录失败！用户名或密码错误！");
            }else this.$message.success("登录成功！");
            // console.log("token",res.data.token)
            window.sessionStorage.setItem("token", res.data.token);
            localStorage.setItem('userRole', res.data.role);
            
            // this.$router.push("/home");
            this.$router.push("/index");
        }).bind(this))
        
      });
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
        //访问房屋不为空并且带有，则分割成数组
        if(this.addForm.building != null && this.addForm.building.indexOf(",") == -1){
          this.addForm.building = this.addForm.building.join(",");
        }
        //处理停留时间
        if(this.addForm.staytime != null){
          this.addForm.staytime = this.addForm.staytime.toString();
        }
        //处理到达时间
        if(this.addForm.reachtime != null){
          this.addForm.reachtime = this.addForm.reachtime.valueOf();
        }
        //处理离开时间
        if(this.addForm.leavetime != null){
          this.addForm.leavetime = this.addForm.leavetime.valueOf();
        }
        //户口所在地不为空并且带有，则分割成数组 一级省市
        if(this.addForm.registration != null){
          if(this.addForm.registration.indexOf(",") == -1){
            this.addForm.registration = this.addForm.registration[0];
          }else if(this.addForm.registration.indexOf(",") != -1){
            this.addForm.registration = this.addForm.registration.join(",");
          }
        }
        //访问房屋不为空并且带有，则分割成数组
        if(this.addForm.going != null && this.addForm.going.indexOf(",") == -1){
          this.addForm.going = this.addForm.going.join(",");
        }

        console.log("要提交的用户表单",this.addForm)
        const { data: res } = await this.$http.post("resident/add", this.addForm);
        console.log(res)
        if (res.meta.status == 400)
          return this.$message.error("注册失败！该手机号已被注册！");
        if (res.meta.status !== 201)
          return this.$message.error("添加用户失败！");
        this.$message.success("添加用户成功!");
        this.loginForm = this.addForm
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        this.login()
        
      });
    },
    //获取citydata二级列表
    getCityDataSec(){
      for(var i = 0;i<this.cityData.length;i++){
        //去除最后三个children未定义
        if(this.cityData[i].children != undefined){
          for(var j= 0;j<this.cityData[i].children.length;j++){
          this.cityDataSec.push(this.cityData[i].children[j].label)
        }
        }
      }
    }
  },
  mounted(){
    this.getCityDataSec();
  }
}
</script>

<style lang='less' scoped>
.container{
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #dbe8f4 100%,#639dd0 0%);
    width: 100vw;
    height: 100vh;
    .login{
        background-color: #fff;
        border-radius: 50px 5px 50px 5px;
        width: 90%;
        height: 85%;
        display: grid;
        grid-template-columns:3fr 2fr;
        align-items: center;
        padding: 30px;
        .img{
            width: 75%;
        }
        .box{
            width: 80%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .title{
                font-size: 24px;
                margin-bottom: 30px;
                text-align-last:justify;
                text-align:justify;
                text-justify:distribute-all-lines;
                width: 100%;
            }
            .form{
                width: 100%;
                .btns{
                    // display: flex;
                    // justify-content: space-between;
                    // align-items: center;
                    // width: 100%;
                    button{
                        // width: 200px;
                        // flex: 1;
                        width: 48%;
                        // margin-top: 20px;
                        // background-color: #6495ED;
                    }
                }
            }
            
        }
        
    }
    
}
</style>