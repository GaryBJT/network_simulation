
<template>
  <div class="container">
    <el-card class="box-card">
      
      <div slot="header" class="clearfix">
          <span>结果分析</span>
        </div>
        <!-- <div v-for="o in 4" :key="o" class="text item">
          {{'列表内容 ' + o }}
      </div> -->
      <el-container>
        <el-aside width="200px" >
        <div class="comprehensive" @click="showresult">综合指标分析</div>
        <el-collapse >
          <el-collapse-item v-for="(items, index) in menuData" :key="items.label" :index="items.label"
              :title="items.label" :name="items.label">
              <div v-for="item in items.children" style="text-align: center;" >
                <div  class="item" @click="showresult">
                  <el-icon :class="item.icon" style="font-size: 32px;vertical-align:middle;"></el-icon>
                  <div :key="item.ID" class="device-item"  >
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item v-for="(items, index) in tableData" :key="items.label" :index="items.label"
              :title="items.label" :name="items.label">
              <div v-for="item in items.children" style="text-align: center;">
                <div  class="item" >
                  <el-icon :class="item.icon" style="font-size: 32px;vertical-align:middle;"></el-icon>
                  <div :key="item.ID" class="link-device" >
                    {{ item.label }}
                  </div>
              </div>
              </div>
            </el-collapse-item>
        </el-collapse>
        </el-aside>
        <el-main>
          <div class="common-tabel">
          <el-table 
          :data="resultdata" 
          style="width: 100%" 
          :header-cell-style="{background:'rgba(19, 52, 216, 0.1)',color: 'rgba(36, 36, 36, 1)'}"
          :cell-style="{color:'rgba(51, 51, 51, 1)'}"
          :show-header="headervisible"
          empty-text=" "
          >
          <el-table-column
            label="丢包率"
            prop="丢包率"
            v-if="headervisible"
          >
        </el-table-column>
          <el-table-column
            label="平均吞吐量(bps)"
            prop="平均吞吐量(bps)"
            v-if="headervisible"
          >
        </el-table-column>
          <el-table-column
            label="平均抖动(秒)"
            prop="平均抖动(秒)"
            v-if="headervisible"
          >
        </el-table-column>
          <el-table-column
            label="平均时延(秒)"
            prop="平均时延(秒)"
            v-if="headervisible"
          >
        </el-table-column>
          </el-table>
        
        </div>
        </el-main>
    </el-container>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      receivedata:null,
      menuData:[],
      tableData:[],
      resultdata:[],
      headervisible:false,
    }
  },

  computed: {
   
  },
  mounted(){
    window.vue=this
    // this.receivedata=JSON.parse(sessionStorage.getItem('key'))
    // for(let i=0;i<this.receivedata.length;i++){
    //     if(this.receivedata[i].label === '节点模型'){
    //         this.menuData.push(this.receivedata[i])  
    //     }else if(this.receivedata[i].label ==='链路模型'){
    //       this.tableData.push(this.receivedata[i])
    //     }
    //   }
    this.resultdata.push(JSON.parse(sessionStorage.getItem('result')))
    // for (let item in data) {
    //   if (data.hasOwnProperty(item)) {
    //     const temp={
    //       key:item,
    //       value:String(data[item]),
    //     }
    //     this.resultdata.push(temp)
    //   }
    // }
    console.log(this.resultdata);
    
  },
  methods: {
    showresult(){
      this.headervisible=true

    }
  }
}
</script>

<style scoped>
.container{
  min-height: calc(100vh - 66px);
  height: auto;
  background: rgba(242, 247, 251, 1);
}
.box-card{
  margin: 0 auto;
  margin-top: 100px;
  width: 1200px;
  height: auto;
  opacity: 1;
  background: rgba(255, 255, 255, 1);

}
.box-card /deep/.el-card__body{
  padding-top: 0px;
}
.clearfix{
  text-align: center;
  font-size: 18px;
}
.item{
  border-bottom: 1px solid gray;
  cursor: pointer;
}
.comprehensive{
    align-items: center;
    height: 48px;
    line-height: 48px;
    background-color: #FFF;
    color: #303133;
    cursor: pointer;
    border-bottom: 1px solid #EBEEF5;
    font-size: 13px;
    font-weight: 500;
    transition: border-bottom-color .3s;
    outline: 0;
}

.device-item {
  margin: 10px 0;
  text-align: center;
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  vertical-align:middle;
  
}
.link-device {
  margin: 10px 0;
  /*  cursor: move; */
  text-align: center;
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  vertical-align:middle;
}

</style>