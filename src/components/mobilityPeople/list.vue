<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人口管理</el-breadcrumb-item>
      <el-breadcrumb-item>社区居民列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="searchForm">
        <el-row :gutter="24" class="el-row">
          <el-col :span="8">
            <span label="姓名" prop="name">姓名</span>
            <el-input v-model="searchForm.name" clearable placeholder="请输入内容，支持模糊查询" ></el-input>
          </el-col>
          <el-col :span="8">
            <span label="工作单位" prop="workplace">工作单位</span>
            <el-input v-model="searchForm.workplace" clearable placeholder="请输入内容，支持模糊查询" ></el-input>
          </el-col>
          <el-col :span="8">
            <span label="联系方式" prop="tel">联系方式</span>
            <el-input v-model="searchForm.tel" clearable placeholder="请输入内容，支持模糊查询" ></el-input>
          </el-col>   
        </el-row>
        <el-row :gutter="24" class="el-row">
          <!-- <el-col :span="8">
            <span>所在房屋</span>
            <el-cascader :options="addressData" v-model="searchForm.building" style="width:100%" :props="{ multiple: true,checkStrictly: true }"></el-cascader>
          </el-col> -->
          <el-col :span="8">
            <span>居民类型</span>
            <el-select v-model="searchForm.role" multiple placeholder="请选择" style="width: 100%" clearable>
              <el-option v-for="item in roleList" :key="item.role" :label="item.name" :value="item.role"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 底部区域 -->
        <el-row :gutter="24" class="el-row" >
          <el-col :span="24" style="display:flex;justify-content: center;align-items: center;">
              <el-button type="primary" icon="el-icon-search" @click="getResidentList">搜索</el-button>
              <el-button plain icon="el-icon-refresh" @click="searchDialogClosed">重置</el-button>
          </el-col> 
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>社区居民列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addDialogVisible = true">添加居民</el-button>
      </div>
      <el-table :data="residentList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="照片" prop="imageURL">
          <template slot-scope="scope">
            <img style="width:50px;height:50px" v-if="scope.row.imageurl != null " :src="localUrl+scope.row.imageurl"/>
            <img style="width:50px;height:50px" v-else src="../../../static/Snipaste_2023-05-13_02-21-54.jpg"/>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-else-if="scope.row.sex == 0">女</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" prop="tel"></el-table-column>
        <el-table-column label="与房主关系" prop="relation">
          <template slot-scope="scope">
            <span v-if="scope.row.relation == 1">本人</span>
            <span v-if="scope.row.relation == 2">亲戚朋友</span>
            <span v-if="scope.row.relation == 3">租客</span>
          </template>
        </el-table-column>
        <el-table-column label="居住地址" prop="building"></el-table-column>
        <el-table-column label="居民类型" prop="role">
          <template slot-scope="scope">
            <span v-if="scope.row.role == 3">本小区居民</span>
            <span v-if="scope.row.role == 4">租客</span>
            <!-- <span v-if="scope.row.role == 5">访客</span> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false" >
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

      <!--添加居民的对话框-->
      <el-dialog title="添加居民" :visible.sync="addDialogVisible" width="60%" @close="addDialogClosed">
        <!--内容主体区域-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px" :inline="true" class="demo-form-inline">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="tel">
            <el-input v-model="addForm.tel" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" show-password name="password" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="addForm.sex" :label=1 size="medium">男</el-radio>
            <el-radio v-model="addForm.sex" :label=0 size="medium">女</el-radio>
          </el-form-item>
          <el-form-item label="文化程度" prop="education">
            <el-select v-model="addForm.education" placeholder="请选择" clearable>
              <el-option v-for="item in educationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select v-model="addForm.nation" placeholder="请选择" clearable>
              <el-option v-for="item in nationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardid">
            <el-input v-model="addForm.cardid" clearable></el-input>
          </el-form-item>
          <el-form-item label="户口所在地" prop="registration">
            <el-cascader :options="cityData" v-model="addForm.registration" style="width:100%" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="房屋地址" prop="building">
            <el-cascader :options="addressData" v-model="addForm.building" style="width:100%" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="工作单位" prop="workplace">
            <el-input v-model="addForm.workplace" clearable></el-input>
          </el-form-item>
          <el-form-item label="居民类型" prop="role">
            <el-radio v-model="addForm.role" label=3 size="medium">本小区居民</el-radio>
            <el-radio v-model="addForm.role" label=4 size="medium">租客</el-radio>
          </el-form-item>
          <el-form-item label="与房主关系" prop="relation">
            <el-radio v-model="addForm.relation" :label=1 size="medium">本人</el-radio>
            <el-radio v-model="addForm.relation" :label=2 size="medium">亲戚朋友</el-radio>
            <el-radio v-model="addForm.relation" :label=3 size="medium">租客</el-radio>
          </el-form-item>

          <!--租客、访客专属-->
          <!-- <div v-if="addForm.role == 4 || addForm.role == 5"> -->
            <el-form-item label="到达本小区时间" prop="reachtime">
              <el-date-picker v-model="addForm.reachtime" type="datetime" placeholder="选择日期时间" style="width:100%" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="预计停留时长" prop="staytime">
              <el-cascader :options="stayTime" v-model="addForm.staytime" style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item label="离开本小区时间" prop="leavetime">
              <el-date-picker v-model="addForm.leavetime" type="datetime" placeholder="选择日期时间" style="width:100%" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="访问事由" prop="reason">
              <el-input v-model="addForm.reason" clearable></el-input>
            </el-form-item>
            <el-form-item label="去向">
              <el-cascader :options="cityData" v-model="addForm.going" style="width:100%" :props="{ checkStrictly: true }"></el-cascader>
            </el-form-item>
          <!-- </div> -->

          <el-form-item label="照片" prop="photo">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="true" :limit="1"
              :on-success="handleAvatarSuccess" 
              :before-upload="beforeAvatarUpload" 
              :on-preview="handlePreview" list-type="picture"
              :on-remove="handleRemove">
              <image v-if="addForm.imageurl" :src="addForm.imageurl" class="avatar"/>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>

        </el-form>

        
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addResidentList">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改居民的对话框-->
      <el-dialog title="修改居民信息" :visible.sync="editDialogVisible" width="60%" @close="editDialogClosed">
        <!--内容主体区域-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="150px" :inline="true" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="editForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="tel">
            <el-input v-model="editForm.tel" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" show-password clearable placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="editForm.sex" :label=1 size="medium">男</el-radio>
            <el-radio v-model="editForm.sex" :label=0 size="medium">女</el-radio>
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
          <el-form-item label="身份证号" prop="cardid">
            <el-input v-if="editForm.cardid == null" v-model="editForm.cardid"></el-input>
            <el-input v-else v-model="editForm.cardid" dibled></el-input>
          </el-form-item>
          <el-form-item label="户口所在地" prop="registration">
            <el-cascader :options="cityData" v-model="editForm.registration" style="width:100%" :props="{ checkStrictly: true }"></el-cascader>
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
          </el-form-item>
          <el-form-item label="与房主关系" prop="relation">
            <el-radio v-model="editForm.relation" :label=1 size="medium">本人</el-radio>
            <el-radio v-model="editForm.relation" :label=2 size="medium">亲戚朋友</el-radio>
            <el-radio v-model="editForm.relation" :label=3 size="medium">租客</el-radio>
          </el-form-item>
          <el-form-item label="到达本小区时间" prop="reachtime">
              <el-date-picker v-model="editForm.reachtime" type="datetime" placeholder="选择日期时间" style="width:100%" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="预计停留时长" prop="staytime">
              <el-cascader :options="stayTime" v-model="editForm.staytime" style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item label="离开本小区时间" prop="leavetime">
              <el-date-picker v-model="editForm.leavetime" type="datetime" placeholder="选择日期时间" style="width:100%" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="访问事由" prop="reason">
              <el-input v-model="editForm.reason" clearable></el-input>
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

      <!--详情居民的对话框-->
      <el-dialog title="详情居民信息" :visible.sync="detailDialogVisible" width="50%" @close="detailDialogClosed" >
        <!--内容主体区域-->
        <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            照片
            <p style="font-size: 4px;">*点击图片可放大预览</p>
          </template>
          <img @click="handlePreview" v-if="detailForm.imageurl != null" :src="localUrl+detailForm.imageurl" alt="" style="width:50px;height:50px;">
          <img v-else src="../../../static/Snipaste_2023-05-13_02-21-54.jpg" alt="" style="width:50px;height:50px;">
        </el-descriptions-item>

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
            联系方式
          </template>
          {{detailForm.tel}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i :class="detailForm.sex == 2 ? 'el-icon-female':'el-icon-male'"></i>
            性别
          </template>
          <!-- {{detailForm.sex == 1 ? '男':'女'}} -->
          <p v-if="detailForm.sex == 1">男</p>
          <p v-if="detailForm.sex == 0">女</p>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-operation"></i>
            文化程度
          </template>
          {{detailForm.education}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-help"></i>
            民族
          </template>
          {{detailForm.nationName}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-star-off"></i>
            身份证号
          </template>
          {{detailForm.cardid}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            户口所在地
          </template>
          {{detailForm.registration}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            房屋地址
          </template>
          {{detailForm.building}}
        </el-descriptions-item>
      
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-suitcase"></i>
            工作单位
          </template>
          {{detailForm.workplace}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-collection-tag"></i>
            居民类型
          </template>
          <el-tag size="small" v-if="detailForm.role == 3 ">本小区居民</el-tag>
          <el-tag size="small" v-if="detailForm.role == 4 ">租客</el-tag>
          <el-tag size="small" v-if="detailForm.role == 5 ">访客</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-c-scale-to-original"></i>
            与房主关系
          </template>
          <div v-if="detailForm.relation == 1">本人</div>
          <div v-if="detailForm.relation == 2">亲戚朋友</div>
          <div v-if="detailForm.relation == 3">租客</div>
        </el-descriptions-item>

        </el-descriptions> 
        <!-- v-if="detailForm.role == 4 || detailForm.role == 5" -->
        <el-descriptions class="margin-top" :column="2" border >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-timer"></i>
            到达本小区时间
          </template>
          <p v-if="detailForm.reachtime != null">{{detailForm.reachtime | dateFormat}}</p>
          <p v-else></p>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-alarm-clock"></i>
            预计停留时长
          </template>
          {{detailForm.stayTime}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-timer"></i>
            离开本小区时间
          </template>
          <p v-if="detailForm.leavetime != null">{{detailForm.leavetime | dateFormat}}</p>
          <p v-else></p>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            去向
          </template>
          {{detailForm.going}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-edit"></i>
            离开/访问事由
          </template>
          {{detailForm.registration}}
        </el-descriptions-item>

      </el-descriptions>
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
import cityData from './citydata.js'
import addressData from './address.js'
import nationData from './nation.js'
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
    var checkCardId = (rule, value, cb) => {
      const regIdCard=
        /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      if (regIdCard.test(value)) {
        return cb();
      }
      cb(new Error("身份证格式不正确"));
    };
    // 这里存放数据
    return {
      cityData,
      addressData,
      nationData,
      cityDataSec:[],
      //获取用户列表的参数对象
      searchForm: {
        current: 1,
        size: 5,
        role:[3,4],
      },
      residentList: [],
      roleList:[],
      total: 0,
      //控制添加居民的对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改居民的对话框的显示与隐藏
      editDialogVisible: false,
      //控制详情居民的对话框的显示与隐藏
      detailDialogVisible: false,
      //添加居民的表单数据
      addForm: {
        name: "",
        tel: "",
        registration:null
      },
      //添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3,max: 10,message: "居民名的长度在3~10个字符之间",trigger: "blur",},
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6,  max: 15, message: "密码的长度在6~15个字符之间", trigger: "blur"},
        ],
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        
        building: [{ required: false, message: "请选择关联的楼房地址", trigger: "blur" }],
        role: [{ required: true, message: "请选择一种角色" }],
        registration: [{ required: false, message: "请选择户口所在地" }],
      },
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3,max: 10,message: "居民名的长度在3~10个字符之间",trigger: "blur",},
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6,  max: 15, message: "密码的长度在6~15个字符之间", trigger: "blur"},
        ],
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        // cardid: [
        //   { required: false, message: "请输入身份证号", trigger: "blur" },
        //   { validator: checkCardId, trigger: "blur" },
        // ],
        role: [{ required: true, message: "请选择一种角色" }],
      },
      //详情表单的的表单数据
      detailForm: {},
      // 图片预览的url路径
      previewPath: '',
      // 图片预览对话框的显示与隐藏
      previewVisible: false,
      //图片上传路径
      uploadUrl:'http://localhost:8081/community/resident/upload',
      //本地资源路径
      localUrl:"http://localhost:8081/community/file/",
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
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  created() {
    this.getResidentList();
    this.getRoleList();
  },
  mounted() {

  },
  // 方法集合
  methods: {
    async getResidentList() {
      // if(this.searchForm.building !=null){
      //   for(let i = 0;i<this.searchForm.building.length;i++){
      //     一级不用分割
      //     if(this.searchForm.building[i].indexOf(",") != -1){
      //       this.searchForm.building[i] = this.searchForm.building[i].join(",")
      //       console.log("this-->"+this.searchForm.building[i])
      //     }
      //     if(this.searchForm.building[i].indexOf(",") != -1){
      //       this.searchForm.building[i] = this.searchForm.building[i].join()
      //       console.log("this-->"+this.searchForm.building[i])
      //     }
      //     console.log("this-->"+this.searchForm.building[i])
      //     //java对buiding循环eq

      //   }
      // }
      // console.log(this.searchForm)
      //如果是人工设置的空
      if(this.searchForm.role == null){
        this.searchForm.role = this.$options.data().searchForm.role
      }
      let form = JSON.parse(JSON.stringify(this.searchForm))
      form = this.$qs.stringify(form,{arrayFormat: 'repeat'})
      form = decodeURIComponent(form)
      // console.log("this.searchForm在这里",this.searchForm)
      
      const { data: res } = await this.$http.get("resident/search?"+form);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // console.log(res.data)
      //过滤访客
      // let newArr = res.data.records.filter(function(item){
      //   return item.role != 5
      // })
      // console.log(newArr)
      // this.residentList = newArr;
      this.residentList = res.data.records;
      // console.log(this.residentList)
      // this.total = this.residentList.length
      this.total = res.data.total;
      //为了搜索框显示空白
      if(this.searchForm.role.length == 2){
        this.searchForm.role = null
      }
      
      // console.log("在这里",this.$options.data().searchForm.role)
      this.$message.success("查询成功！");
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.searchForm.size = newSize;
      this.getResidentList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.searchForm.current = newPage;
      //如果是人工设置的空
      if(this.searchForm.role == null){
        this.searchForm.role = this.$options.data().searchForm.role
      }
      this.getResidentList();
    },
    //点击确定按钮，进行添加居民
    addResidentList() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return;
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
        console.log("要提交的居民表单",this.addForm)
        const { data: res } = await this.$http.post("resident/add", this.addForm);
        // console.log(res)
        if (res.meta.status !== 201)
          return this.$message.error("添加居民失败！");
        this.$message.success("添加居民成功!");
        //隐藏添加居民的对话框
        this.addDialogVisible = false;
        this.getResidentList();
      });
    },
    //监听添加居民对话框的关闭事件
    addDialogClosed() {
      // this.$refs.addFormRef.resetFields();
      this.addForm = this.$options.data().addForm
      console.log("已重置添加居民addform",this.addForm)
    },
    //展示修改居民的对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("resident/searchOneById?id=" + id);
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error("查询居民信息失败!");
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
      console.log(this.editForm)
    },
    //监听修改居民对话框的关闭事件
    editDialogClosed() {
      // this.$refs.editFormRef.resetFields();
      this.editForm = this.$options.data().editForm
      console.log("已重置修改居民editform",this.editForm)
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

        if(this.editForm.registration != null && this.editForm.registration.indexOf(",") == -1 && this.cityDataSec.indexOf(this.editForm.registration) == -1){
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

        // delete this.editForm[fileList]
        console.log("要提交的表单是",this.editForm)
        const { data: res } = await this.$http.post("resident/update",this.editForm);
        // //console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error("更新居民信息失败!");
        //隐藏添加居民的对话框
        this.editDialogVisible = false;
        //刷新数据列表
        this.getResidentList();
        //提示修改成功
        this.$message.success("更新居民信息居民成功!");
      });
    },
    //根据id删除居民信息
    async removeUserById(id) {
      //弹框询问居民是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该居民, 是否继续?",
        "提示",
        {confirmButtonText: "确定",cancelButtonText: "取消",type: "warning",}
      ).catch((err) => err);
      //如果居民确认删除，则返回值为字符串 confirm
      //如果居民取消删除，则返回值为字符串 cancel
      //console.log(confirmResult)
      if (confirmResult !== "confirm") {return this.$message.info("已取消删除");}
      const { data: res } = await this.$http.get("resident/delete?id=" + id);
      if (res.meta.status !== 200) return this.$message.error("删除居民失败！");
      this.$message.success("删除居民成功!");
      //刷新居民列表
      this.getResidentList();
    },
    //展示详情居民的对话框
    async showDetailDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("resident/searchOneById?id=" + id);
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error("查询居民信息失败!");
      this.detailForm = res.data;
      // console.log(this.detailForm)
      
      if(this.detailForm.nation != null){
        let index = this.nationData.findIndex(v => v.id == this.detailForm.nation)
        this.detailForm.nationName = this.nationData[index].name
      }
      
      if(this.detailForm.staytime != null){
        let index1 = this.stayTime.findIndex(v => v.value == this.detailForm.staytime)
        this.detailForm.stayTime = this.stayTime[index1].label
      }
      this.detailDialogVisible = true;
      
      
    },
    //监听详情居民对话框的关闭事件
    detailDialogClosed() {
      this.detailDialogVisible = false;
    },
    //监听搜索居民的重置事件
    searchDialogClosed() {
      // this.$refs.searchFormRef.resetFields();
      this.searchForm = this.$options.data().searchForm
      //为了显示空白
      this.searchForm.role = null
      console.log("已重置表单",this.searchForm)
    },
    async getRoleList() {
      // 在展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http.get("role/search");
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error("获取角色列表失败！");
      //去掉工作人员、管理员
      res.data.roleList.splice(0,2)
      res.data.roleList.splice(2,1)
      this.roleList = res.data.roleList;
    },
    //照片上传成功
    handleAvatarSuccess(response) {
        console.log(response)
        // this.addForm.imageurl = response.message.uploadFile.replace(/\\/g,'/')
        // this.addForm.imageurl = response.message.uploadFile
        if(this.addForm.imageurl == null)this.addForm.imageurl = response.message.dFileName
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
      if(this.detailForm.imageurl != null){
        this.previewPath = this.localUrl+this.detailForm.imageurl
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
</style>