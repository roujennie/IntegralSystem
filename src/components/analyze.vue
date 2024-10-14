<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人员动态展示</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>数据分析</el-breadcrumb-item> -->
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <!-- 基本信息统计 -->
      <div class="baseAnalyze">
        <div class="cube">
          <div class="title">小区现有常住人口</div>
          <div class="des">
            <div class="number">{{residentCount+external}}</div>
            <div class="unit">人</div>
          </div>
        </div>

        <div class="cube">
          <div class="title">近{{day}}天 小区流入人口</div>
          <div class="des">
            <div class="number">{{inflowNumber}}</div>
            <div class="unit">人</div>
          </div>
        </div>

        <div class="cube">
          <div class="title">近{{day}}天 小区流出人口</div>
          <div class="des">
            <div class="number">{{outflowNumber}}</div>
            <div class="unit">人</div>
          </div>
        </div>
      </div>
      
      <div class="box">
        <div id="districtComposition"></div>
        <div id="sexComposition"></div>
      </div>
      <div class="map">
        <div style="width:100%;height:600px" id="chinaMap" @mouseover="mapOver" @mouseout='mapOut'></div>
      </div>
      <div class="wordcloud">
        <p style="font-weight:bolder;font-size:18px;">流动人口流动原因 词云</p>
        <img style="border:2px solid #fafafa;" :src="localUrl" alt="">
      </div>
    </el-card>
  </div>
</template>

<script>
// import getChinaMap from '../api/getChinaMap';
import chinaMap from '../api/china.json';
import * as echarts from 'echarts'

export default {
  components: {},
  props: {},
  data() {
    return {
      searchForm: {
        current: 1,
        size: 5000,
      },
      day: 7,
      residentCount: 0,
      total: 0,
      external: 0,
      woman: 0,
      man: 0,
      chinaMap:chinaMap,
      area:[],
      areaMapData:[],
      inflowNumber:0,
      outflowNumber:0,
      //本地资源路径
      localUrl:'',
      imagename:''
    };
  },
  mounted() {},
  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  created() {
    this.getResidentList();
  },
  // 方法集合
  methods: {
    drawDistrictCompositionChart() {
      let myChart = this.$echarts.init(document.getElementById('districtComposition'), null, {
        width: 500,
        height: 200,
      });
      let option = {
        title: {
          text: '小区常住人口类型构成比例图',
        },
        tooltip: {},
        legend: {
          top: '15%',
          bottom: '10%',
          data: ['人数'],
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '人数',
            type: 'pie',
            // avoidLabelOverlap:true,
            data: [
              {
                value: null,
                name: '居民',
              },
              {
                value: null,
                name: '租客',
              },
            ],
            itemStyle: {
              normal: {
                color: function(colors) {
                  var colorList = ['#fc8251', '#5470c6'];
                  return colorList[colors.dataIndex];
                },
              },
            },
          },
        ],
      };
      // console.log(this.residentCount)
      option.series[0].data[0].value = this.residentCount;
      option.series[0].data[1].value = this.external;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart.resize();
    },
    drawSexCompositionChart() {
      let myChart = this.$echarts.init(document.getElementById('sexComposition'), null, {
        width: 500,
        height: 200,
      });
      let option = {
        title: {
          text: '小区常住人口性别构成比例图',
        },
        legend: {
          top: '15%',
          bottom: '10%',
          data: ['人数'],
          orient: 'vertical',
          left: 'left',
        },
        tooltip: {},
        series: [
          {
            name: '人数',
            type: 'pie',
            data: [
              {
                value: null,
                name: '男',
              },
              {
                value: null,
                name: '女',
              },
            ],
            itemStyle: {
              normal: {
                color: function(colors) {
                  var colorList = [
                    '#91cd77',
                    '#ef6567',
                    // '#f9c956',
                    // '#75bedc'
                  ];
                  return colorList[colors.dataIndex];
                },
              },
            },
          },
        ],
      };
      // console.log(this.residentCount)
      option.series[0].data[0].value = this.man;
      option.series[0].data[1].value = this.woman;

      myChart.setOption(option);
      myChart.resize();
    },
    drawChinaMapChart() {
      let myChart = this.$echarts.init(document.getElementById('chinaMap'));
      let mapData = this.areaMapData;
      echarts.registerMap('china', this.chinaMap);
      let option = {
        title: {
          text: '小区人员流出动向图（截至今天）',
        },
        // 地图配置
        geo: {
          nameMap: {
            China: '中国',
          },
          map: 'china',
          label: {
            emphasis: {
              show: false,
            },
            show:true
          },
          // 当前视角的缩放比例
          zoom: 1.2, // 2.3
          // left: -300,
          // top: 250,
          // scale 地图的长宽比
          aspectScale: 1,
          roam:true,
          itemStyle: {
            normal: {
              borderColor: '#21EAFD', // 区域边框颜色
              areaColor: 'rgba(255,255,255,0)', // 区域颜色
              borderWidth: 1, // 区域边框宽度
              shadowBlur: 5,
              shadowColor: 'rgba(107,91,237,.7)',
            },
            emphasis: {
              borderColor: '#FFD1A3',
              areaColor: 'rgba(102,105,240,.3)',
              borderWidth: 1,
              shadowBlur: 5,
              shadowColor: 'rgba(135,138,255,.5)',
            },
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}',
        },
        series: [{
          name: '测试数据',
          type: 'map',
          geoIndex: 0,
          data: mapData,
        }],
        visualMap:{
        min:0,
        max:10,
        inRange:{
          // color:['#83c4f3', '#4a9de4'], //控制颜色渐变的范围
          color:['#e0ffff', '#006edd']
        },
        calculable: true //出现滑块
      }
      };
      myChart.setOption(option);

      myChart.on('mousewheel', function (params) {
        // 阻止事件的默认行为
        params.event.preventDefault();
        // 阻止事件向上级元素冒泡
        params.event.stopPropagation();
        // 处理缩放逻辑
        // ...
      });
    },
    async getResidentList() {
      
      await this.$http.get('resident/search', { params: this.searchForm })
      .then(((res) => {
        //总人数
          this.total = res.data.data.total;
          console.log(res)
          let records = res.data.data.records;
          //统计男女
          // for (let i = 0; i < records.length; i++) {
          //   if (records[i].sex == 0) {
          //     this.woman++;
          //   } else if(records[i].sex == 1){
          //     this.man++;
          //   }
          // }
        }).bind(this),
      );
      // //小区人员性别组成
      // this.searchForm.role = ["3","4"];
      // let form = JSON.parse(JSON.stringify(this.searchForm))
      // form = this.$qs.stringify(form,{arrayFormat: 'repeat'})
      // form = decodeURIComponent(form)
      // await this.$http.get('resident/search'+form)
      // .then(((res) => {
      //     console.log(res)
      //     let records = res.data.data.records;
      //     //统计男女
      //     for (let i = 0; i < records.length; i++) {
      //       if (records[i].sex == 0) {
      //         this.woman++;
      //       } else if(records[i].sex == 1){
      //         this.man++;
      //       }
      //     }
      //   }).bind(this),
      // );
      // this.drawSexCompositionChart();
      //小区人员类型
      this.searchForm.role = 3;
      await this.$http.get('resident/search', { params: this.searchForm })
        .then(
          ((res) => {
            console.log(res)
            this.residentCount = res.data.data.total;
            let records = res.data.data.records;
            for (let i = 0; i < records.length; i++) {
              if (records[i].sex == 0) {
                this.woman++;
              } else if(records[i].sex == 1){
                this.man++;
              }
            }
            // this.external = this.total - this.residentCount;
          }).bind(this),
        );
      this.searchForm.role = 4;
      await this.$http.get('resident/search', { params: this.searchForm })
        .then(
          ((res) => {
            console.log(res)
            this.external = res.data.data.total;
            let records = res.data.data.records;
            for (let i = 0; i < records.length; i++) {
              if (records[i].sex == 0) {
                this.woman++;
              } else if(records[i].sex == 1){
                this.man++;
              }
            }
          }).bind(this),
        )
        .then((res) => {
          this.drawDistrictCompositionChart();
          this.drawSexCompositionChart();
          // this.drawChinaMapChart();
      });
      //小区人员流出动向
      await this.$http.get('resident/where', { params: this.searchForm })
        .then(
          ((res) => {
            // console.log(res)
            this.areaMapData = res.data.areaList;
          }).bind(this),
        )
      this.drawChinaMapChart();
      await this.$http.get('resident/flow', { params:  {day:this.day}})
      .then(((res) => {
          // console.log(res)
          this.inflowNumber = res.data.inflowList.length;
          this.outflowNumber = res.data.outflowList.length;
        }).bind(this),
      );
      await this.$http.get('resident/wordCloud')
        .then(
          ((res) => {
            console.log(res)
            this.localUrl = "http://localhost:8081/community/file/wordCloud.png"
            // this.imgname = "wordCloud.png"
          
          }).bind(this),
        );
    },
    mapOver(){
      // console.log("mouseover")
      let m = function(e){e.preventDefault();};
      document.body.style.overflow='hidden';
      document.addEventListener("touchmove",m,{ passive:false });
    },
    mapOut(){
      // console.log("mouseout")
      let m =function(e){e.preventDefault();};
      document.body.style.overflow='';//出现滚动条
      document.removeEventListener("touchmove",m,{ passive:true });
    },
    
    
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 18px;
}
.el-card {
  margin-bottom: 18px;
  .box {
    display: flex;
    justify-content: space-between;
    margin: 60px 0;
  }
  .map{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .baseAnalyze{
    display: flex;
    justify-content: space-between;
    padding: 0 4px;
    .cube{
    font-weight:bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title{
      font-size: 18px;
    }
    .des{
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .number{
        font-size:24px;
        color: #f9c540;
      }
      .unit{
        font-size: 24px;
        margin-left: 16px;
      }
    }
    
  }
  }
  
}
#districtComposition {
  display: flex;
  flex-direction: column;
}
</style>
