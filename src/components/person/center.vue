<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="showEditDialog(loginInfo.id)" v-if="loginInfo.role != 1 && loginInfo.role !=2">修改信息</el-button>
      </div>

      <el-descriptions class="des" :column="3" border :labelStyle="LS" :contentStyle="CS">
          <el-descriptions-item>
              <template slot="label">
              <i class="el-icon-user"></i>
                  姓名
              </template>
              {{loginInfo.name}}
          </el-descriptions-item>

          <el-descriptions-item>
              <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              联系方式
              </template>
              {{loginInfo.tel}}
          </el-descriptions-item>
      
          <el-descriptions-item>
              <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              角色类型
              </template>
              <p v-if="loginInfo.role == 1">管理员</p>
              <p v-else-if="loginInfo.role == 2">社区工作人员</p>
              <p v-else-if="loginInfo.role == 3">本小区居民</p>
              <p v-else-if="loginInfo.role == 4">租客</p>
              <p v-else>访客</p>
          </el-descriptions-item>

          
          

      </el-descriptions>
      
      <el-descriptions v-if="loginInfo.role == 3 ||loginInfo.role == 4 || loginInfo.role == 5" class="des" :column="3" border :labelStyle="LS" :contentStyle="CS">
        <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              照片
              <p style="font-size: 4px;">*点击图片可放大预览</p>
            </template>
            <img @click="handlePreview" v-if="loginInfo.imageurl != null" :src="localUrl+loginInfo.imageurl" alt="" style="width:50px;height:50px;">
            <img v-else src="../../../static/Snipaste_2023-05-13_02-21-54.jpg" alt="" style="width:50px;height:50px;">
          </el-descriptions-item>
        
        <el-descriptions-item>
          <template slot="label">
            <i :class="loginInfo.sex == 2 ? 'el-icon-female':'el-icon-male'"></i>
            性别
          </template>
          <!-- {{loginInfo.sex == 1 ? '男':'女'}} -->
          <p v-if="loginInfo.sex == 1">男</p>
          <p v-else-if="loginInfo.sex == 0">女</p>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-help"></i>
            民族
          </template>
          {{loginInfo.nationName}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-operation"></i>
            文化程度
          </template>
          {{loginInfo.education}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-star-off"></i>
            身份证号
          </template>
          {{loginInfo.cardid}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-c-scale-to-original"></i>
            与房主关系
          </template>
          <div v-if="loginInfo.relation == 1">本人</div>
          <div v-if="loginInfo.relation == 2">亲戚朋友</div>
          <div v-if="loginInfo.relation == 3">租客</div>
        </el-descriptions-item>

        <!-- <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{loginInfo.tel}}
        </el-descriptions-item> -->

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            户口所在地
          </template>
          {{loginInfo.registration}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-suitcase"></i>
            工作单位
          </template>
          {{loginInfo.workplace}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            所在楼
          </template>
          {{loginInfo.building}}
        </el-descriptions-item>

        <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-timer"></i>
              到达本小区时间
            </template>
            <!-- loginInfo.reachtime | dateFormat -->
            <p v-if="loginInfo.reachtime == null"></p>
            <p v-else>{{loginInfo.reachtime | dateFormat}}</p>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-alarm-clock"></i>
              预计停留时长
            </template>
            {{loginInfo.stayTime}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-timer"></i>
              离开本小区时间
            </template>
            <!-- {{loginInfo.leavetime | dateFormat}} -->
            <p v-if="loginInfo.leavetime == null"></p>
            <p v-else>{{loginInfo.leavetime | dateFormat}}</p>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-edit"></i>
              离开/访问事由
            </template>
            {{loginInfo.reason}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-edit"></i>
              去向
            </template>
            {{loginInfo.going}}
          </el-descriptions-item>

      </el-descriptions>
        
        <!-- <el-descriptions class="des" :column="3" border v-if="loginInfo.role == 4 || loginInfo.role == 5" :labelStyle="LS" :contentStyle="CS">
          

      </el-descriptions> -->

      <!--修改居民的对话框-->
      <el-dialog title="修改居民信息" :visible.sync="editDialogVisible" width="60%" @close="editDialogClosed">
        <!--内容主体区域-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px" :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="editForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="editForm.sex" :label=1 size="medium" >男</el-radio>
            <el-radio v-model="editForm.sex" :label=0 size="medium">女</el-radio>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="editForm.cardid"></el-input>
          </el-form-item>
          <el-form-item label="文化程度" prop="education">
            <el-select v-model="editForm.education" placeholder="请选择" style="width:100%" clearable>
              <el-option v-for="item in educationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select v-model="editForm.nation" placeholder="请选择" style="width:100%" clearable>
              <el-option v-for="item in nationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="与房主关系" prop="relation">
            <el-radio v-model="editForm.relation" :label=1 size="medium">本人</el-radio>
            <el-radio v-model="editForm.relation" :label=2 size="medium">亲戚朋友</el-radio>
            <el-radio v-model="editForm.relation" :label=3 size="medium">租客</el-radio>
          </el-form-item>
          <el-form-item label="户口所在地" prop="registration">
            <el-cascader :options="cityData" v-model="editForm.registration" style="width:100%" :props="{ checkStrictly: true }"></el-cascader>
          </el-form-item>
          <el-form-item label="联系方式" prop="tel">
            <el-input v-model="editForm.tel" placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="房屋地址" prop="building">
            <el-cascader :options="addressData" v-model="editForm.building" style="width:100%"></el-cascader>
          </el-form-item>
          <el-form-item label="工作单位" prop="workplace">
            <el-input v-model="editForm.workplace"></el-input>
          </el-form-item>
          <el-form-item label="居民类型" prop="role">
            <el-radio v-model="editForm.role" :label=3 size="medium">本小区居民</el-radio>
            <el-radio v-model="editForm.role" :label=4 size="medium">租客</el-radio>
            <el-radio v-model="editForm.role" :label=5 size="medium">访客</el-radio>
          </el-form-item>
          <el-form-item label="到达本小区时间" prop="reachtime">
            <el-date-picker v-model="editForm.reachtime" type="datetime" placeholder="选择日期时间" style="width:100%" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="预计停留时长" prop="staytime">
            <el-select v-model="editForm.staytime" placeholder="请选择" style="width:100%" clearable>
              <el-option v-for="item in stayTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="离开本小区时间">
            <el-date-picker v-model="editForm.leavetime" type="datetime" placeholder="选择日期时间" style="width:100%" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="离开/访问事由">
            <el-input v-model="editForm.reason" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="去向">
            <el-cascader :options="cityData" v-model="editForm.going" style="width:100%" :props="{ checkStrictly: true }"></el-cascader>
          </el-form-item>
          <el-form-item label="照片" prop="photo">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="true" :limit="1"
              :on-success="handleAvatarSuccess" 
              :before-upload="beforeAvatarUpload" 
              :on-preview="handlePreview" list-type="picture"
              :on-remove="handleRemove"
              :file-list="editForm.fileList"
              >
              <image v-if="editForm.imageurl != null" :src="localUrl+editForm.imageurl" class="avatar"/>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
    title="图片预览"
    :visible.sync="previewVisible"
    width="50%"
    >
    <img :src="previewPath" alt="" class="previewImg" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../mobilityPeople/citydata.js'
import addressData from '../mobilityPeople/address.js'
import nationData from '../mobilityPeople/nation.js'
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
    // 这里存放数据
    return {
      LS:{
        "max-width":"60px",
        "word-break":"break-all"
      },
      CS:{
        "max-width":"50px",
        "word-break":"break-all"
      },
      cityData,
      addressData,
      nationData,
      loginInfo:{
        name:null
      },
      //控制修改居民的对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
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
      // 图片预览的url路径
      previewPath: '',
      // 图片预览对话框的显示与隐藏
      previewVisible: false,
      //图片上传路径
      uploadUrl:'http://localhost:8081/community/resident/upload',
      //本地资源路径
      localUrl:"http://localhost:8081/community/file/",
    };
  },
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  created() {
    this.getLoginInfo()
  },
  // 方法集合
  methods: {
    async getLoginInfo(){
      let token = sessionStorage.getItem('token')
      await this.$http.post("user/loginInfo?token="+token)
      .then((res=>{
        console.log(res)
        
        this.loginInfo = res.data.loginInfo

        if(this.loginInfo.staytime != null){
          let index1 = this.stayTime.findIndex(v => v.value == this.loginInfo.staytime)
          this.loginInfo.stayTime = this.stayTime[index1].label
        }

        if(this.loginInfo.nation != null){
          let index = this.nationData.findIndex(v => v.id == this.loginInfo.nation)
          this.loginInfo.nationName = this.nationData[index].name
        }

      }).bind(this))

      // await this.$http.get("user/searchOneByUserName?userName="+this.loginInfo.userName)
      // .then((res=>{
      //   console.log(res.data)
      //   this.loginInfo = res.data.data
      // }).bind(this))
    },
    //展示修改居民的对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("resident/searchOneById?id=" + id);
      this.editForm = res.data;
      if(this.editForm.registration != null){
        this.editForm.registration = this.editForm.registration.split(",")
      }
      if(this.editForm.building != null){
        this.editForm.building = this.editForm.building.split(",")
      }
      if(this.editForm.going != null){
        this.editForm.going = this.editForm.going.split(",")
      }

      //修改照片回显
      if(this.editForm.imageurl != null){
        this.editForm.fileList = [{
          name: this.editForm.imageurl,
          url:this.localUrl+this.editForm.imageurl
        }]
      }

      this.editForm = JSON.parse(JSON.stringify(this.editForm))
      this.editDialogVisible = true;
      // console.log(this.editForm)
    },
    //监听修改居民对话框的关闭事件
    editDialogClosed() {
      // this.$refs.editFormRef.resetFields();
      this.editForm = this.$options.data().editForm
      console.log("已重置表单",this.editForm)
    },
    //修改居民的表单预验证
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        //console.log(valid)
        if (!valid) return;
        //发起修改居民的请求
        if(this.editForm.building != null && this.editForm.building.indexOf(",") == -1){
          this.editForm.building = this.editForm.building.join(",");
        }

        if(this.editForm.registration != null && this.editForm.registration.indexOf(",") == -1){
          this.editForm.registration = this.editForm.registration.join(",");
        }

        if(this.editForm.going != null && this.editForm.going.indexOf(",") == -1){
          this.editForm.going = this.editForm.going.join(",");
        }
        
        //处理停留时间
        if(this.editForm.staytime != null){
          this.editForm.staytime = this.editForm.staytime.toString();
        }
        //处理到达时间
        if(this.editForm.reachtime != null){
          this.editForm.reachtime = this.editForm.reachtime.valueOf();
        }
        //处理离开时间
        if(this.editForm.leavetime != null){
          this.editForm.leavetime = this.editForm.leavetime.valueOf();
        }

        console.log("要提交的表单是",this.editForm)
        const { data: res } = await this.$http.post("resident/update",this.editForm);
        // //console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error("更新居民信息失败!");
        //隐藏添加居民的对话框
        this.editDialogVisible = false;
        //刷新数据列表
        this.getLoginInfo();
        //提示修改成功
        this.$message.success("更新居民信息居民成功!");
      });
    },
    //照片上传成功
    handleAvatarSuccess(response) {
        console.log(response)
        if(this.editForm.imageurl == null)this.editForm.imageurl = response.message.dFileName
        // console.log(this.addForm)
        this.$message.success('上传成功!');
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传失败！图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传失败！图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 处理图片预览事件
    handlePreview(file){
      // this.previewPath = file.response.message.uploadFile
      if(this.loginInfo.imageurl != null){
        this.previewPath = this.localUrl+this.loginInfo.imageurl
      }else{
        this.previewPath = this.localUrl+file.response.message.dFileName
      }
      
      this.previewVisible = true
    },
    //处理移除图片的操作 
     handleRemove(file){
      // console.log(file)
      file.response = null
      this.addForm.imageurl = null
      this.editForm.imageurl = null
      //console.log(this.addForm)
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
  .des:empty::before{
	content:'--';
	color:gray;
}
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