<template>
  <el-container>
    <el-aside >  
      <el-menu>
      <h3 style="font-size: 12px;color: rgba(101, 101, 101, 1);">模型列表</h3>
      <!-- <el-menu-item
        @click="clickMenu(item)"
        v-for="item in noChildren"
        :key="item.name"
        :index="item.name"
        background-color: #f7f7f7ff;
      >
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item> -->
      <el-submenu v-for="(item,index) in menuData" :key="item.label" :index="item.label">
        <template slot="title">
          <div class="mytitle" @click="showlist(item)">
            <img slot="title" :src="require(`@/assets/images/${item.icon}.png`)"></img>
            <span slot="title">{{ item.label }}</span>
          </div>
        </template>
  
        <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
          <el-menu-item :index="subItem.path">{{
            subItem.label
          }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <el-dialog
        title="节点模型"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!-- 用户的表单信息 -->
        <el-form
          ref="form"
          :model="form"
          :inline="true"
          label-width="100px"
        >
          <el-form-item prop="label" label="名称">
            <el-input  v-model="form.label"></el-input>
          </el-form-item>
          <el-form-item prop="application" label="应用程序">
            <!-- <el-input  v-model="form.application"></el-input> -->
            <el-select v-model="form.application">
              <el-option v-for="item in appchoose" :label="item" :value="item"></el-option> 
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="网络设备">
            <el-input  v-model="form.net_device"></el-input>
          </el-form-item> -->
          <el-form-item prop="potocal" label="协议栈">
            <el-select v-model="form.potocal">
              <el-option v-for="item in netchoose" :label="item" :value="item"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item prop="DataRate" label="数据传输速率">
            <el-input  v-model="form.DataRate"></el-input>
          </el-form-item>
  
          <!-- 下拉选择框  -->
          <el-form-item prop="type" label="模型类型">
            <el-select v-model="form.type">
              <!-- <el-option label="男" :value="1"></el-option> 
              <el-option label="女" :value="0"></el-option>  -->
              <el-option v-for="item in menuData" :label="item.label" :value="item.label"></el-option> 
            </el-select>
          </el-form-item>
  
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="节点模型"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!-- 用户的表单信息 -->
        <el-form
          ref="form"
          :model="form"
          :inline="true"
          label-width="100px"
        >
          <el-form-item prop="label" label="名称">
            <el-input  v-model="form.label"></el-input>
          </el-form-item>
          <el-form-item prop="application" label="应用程序">
            <!-- <el-input  v-model="form.application"></el-input> -->
            <el-select v-model="form.application">
              <el-option v-for="item in appchoose" :label="item" :value="item"></el-option> 
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="网络设备">
            <el-input  v-model="form.net_device"></el-input>
          </el-form-item> -->
          <el-form-item prop="potocal" label="协议栈">
            <el-select v-model="form.potocal">
              <el-option v-for="item in netchoose" :label="item" :value="item"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item prop="DataRate" label="数据传输速率">
            <el-input  v-model="form.DataRate"></el-input>
          </el-form-item>
  
          <!-- 下拉选择框  -->
          <el-form-item prop="type" label="模型类型">
            <el-select v-model="form.type">
              <!-- <el-option label="男" :value="1"></el-option> 
              <el-option label="女" :value="0"></el-option>  -->
              <el-option v-for="item in menuData" :label="item.label" :value="item.label"></el-option> 
            </el-select>
          </el-form-item>
  
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="链路模型"
        :visible.sync="linkVisible"
        width="50%"
        :before-close="channelClose"
      >
        <!-- 用户的表单信息 -->
        <el-form
          ref="linkform"
          :model="linkform"
          :inline="true"
          label-width="100px"
        >
          <el-form-item prop="label" label="名称">
            <el-input  v-model="linkform.label"></el-input>
          </el-form-item>
          <el-form-item prop="channeltype" label="协议类型">
            <el-select v-model="linkform.channeltype">
              <el-option v-for="item in linkchoose" :label="item" :value="item"></el-option> 
            </el-select>
          </el-form-item>

          <el-form-item prop="delay" label="时延">
            <el-input  v-model="linkform.delay"></el-input>
          </el-form-item>
          <!-- 下拉选择框  -->
          <el-form-item prop="type" label="模型类型">
            <el-select v-model="linkform.type">
              <!-- <el-option label="男" :value="1"></el-option> 
              <el-option label="女" :value="0"></el-option>  -->
              <el-option v-for="item in menuData" :label="item.label" :value="item.label"></el-option> 
            </el-select>
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="linkcancel">取 消</el-button>
          <el-button type="primary" @click="linkSubmit">确 定</el-button>
        </span>
  
      </el-dialog>



      <el-dialog
        title="选择模型"
        :visible.sync="chooseVisible"
        width="50%"
        :before-close="closeFirst"
      >
        <!-- 用户的表单信息 -->
        <el-form
          ref="userForm"
          :model="userForm"
        >
          <!-- 下拉选择框  -->
          <el-form-item prop="type" label="模型类型" >
            <el-select v-model="userForm.type" >
              <!-- <el-option label="男" :value="1"></el-option> 
              <el-option label="女" :value="0"></el-option>  -->
              <el-option v-for="item in menuData" :label="item.label" :value="item.label"></el-option> 
            </el-select>
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleFirst">取 消</el-button>
          <el-button type="primary" @click="submitFirst">确 定</el-button>
        </span>
      </el-dialog>
  
      <div class="manage-header">
        <div class="liebiao">
          <div class="shu"></div>
          <span class="name">{{ itemname? `${itemname}列表`:''}}</span>
        </div>
        <div>
        <el-button class="add" @click="jump" type="primary"> 模型组装</el-button>
        <el-button class="add" @click="addFirst" type="primary"> + 新增 </el-button>
      </div>
      </div>
      <div class="common-tabel">
        <el-table 
        stripe  
        :data="tableData" 
        style="width: 100%;margin-top: 17px;" 
        :header-cell-style="{background:'rgba(19, 52, 216, 0.1)',color: 'rgba(36, 36, 36, 1)'}"
        :cell-style="{color:'rgba(51, 51, 51, 1)'}"
        :show-header="headervisible"
        empty-text=" "
        >
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
        ></el-table-column>
          <!-- <el-table-column prop="label" label="名称"></el-table-column>
          <el-table-column prop="type" label="类型名">
            <template slot-scope="scope">
              <span>{{ scope.row.sex == 1 ? "男" : "女" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="application" label="应用程序"> </el-table-column>
          <el-table-column prop="potocal" label="协议栈"> </el-table-column> -->
          <el-table-column prop="id" label="ID" v-if="isVisible"> </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)" style="display: inline-block;"
                >详情
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="handleDelete(scope.row)"
                style="display: inline-block;">
                
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager">
          <!-- <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="handlePage"
          >
          </el-pagination> -->
        </div>
      </div>
    </el-main>
  </el-container>
  </template>
  
   
  <script>
  import EventBus from '@/bus/eventbus.js';
  export default {
    data() {
      return {
        columns: [ 
                        // 默认表头
                        { prop:"label",label:"名称" },
                        { prop:"type",label:"类型名" },
                        { prop: 'application', label: '应用程序' },
                        { prop: 'potocal', label: '协议栈' },
                  ],
        menuData: [
          // {
          //   label: '节点模型',
          //   icon: 'exchange2',
          //   column:[ 
          // // 默认表头
          // { prop:"label",label:"名称" },
          // { prop:"type",label:"类型名" },
          // { prop: 'application', label: '应用程序' },
          // { prop: 'potocal', label: '协议栈' },
          //   ],
          //   children: [
          //     {
          //       type: '节点模型',
          //       label: 'node0',
          //       application:'serverApps',
          //       potocal:'Udp',
          //       DataRate:'5Mbps',
          //       ID:'124s8s',
          //       icon: 'el-icon-s-data',
          //       name:0
          //     },
          //     {
          //       type: '节点模型',
          //       label: 'node1',
          //       application:'clienApps',
          //       potocal:'Udp',
          //       DataRate:'5Mbps',
          //       ID:'1wed8s',
          //       icon: 'el-icon-s-platform',
          //       name:1
          //     }
          //   ]
          // },
          {
            label: '交换机',
            icon: 'exchange2',
            column:[ 
          // 默认表头
          { prop:"label",label:"名称" },
          { prop:"type",label:"类型名" },
          { prop: 'application', label: '应用程序' },
          { prop: 'potocal', label: '协议栈' },
            ],
            children: [
              {
                type: '节点模型',
                label: 'node0',
                application:'serverApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                ID:'124s8s',
                icon: 'el-icon-s-data',
                name:0
              },
              {
                type: '节点模型',
                label: 'node1',
                application:'clienApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                ID:'1wed8s',
                icon: 'el-icon-s-platform',
                name:1
              }
            ]
          },
          {
            label: '路由器',
            icon: 'router',
            column:[ 
          // 默认表头
          { prop:"label",label:"名称" },
          { prop:"type",label:"类型名" },
          { prop: 'application', label: '应用程序' },
          { prop: 'potocal', label: '协议栈' },
            ],
            children: [
              {
                type: '节点模型',
                label: 'node0',
                application:'serverApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                ID:'124s8s',
                icon: 'el-icon-s-data',
                name:0
              },
              {
                type: '节点模型',
                label: 'node1',
                application:'clienApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                ID:'1wed8s',
                icon: 'el-icon-s-platform',
                name:1
              }
            ]
          },
          {
            label: '移动终端',
            icon: 'move',
            column:[ 
          // 默认表头
          { prop:"label",label:"名称" },
          { prop:"type",label:"类型名" },
          { prop: 'application', label: '应用程序' },
          { prop: 'potocal', label: '协议栈' },
            ],
            children: [
              {
                type: '节点模型',
                label: 'node0',
                application:'serverApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                ID:'124s8s',
                icon: 'el-icon-s-data',
                name:0
              },
              {
                type: '节点模型',
                label: 'node1',
                application:'clienApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                ID:'1wed8s',
                icon: 'el-icon-s-platform',
                name:1
              }
            ]
          },
          {
            label: '无线链路',
            icon: 'stick',
            column:[ 
                      // 链路表头
                      { prop:"label",label:"名称" },
                      { prop:"type",label:"类型名" },
                      { prop: 'channeltype', label: '协议类型' },
                      { prop: 'delay', label: '时延' },
                   ],
            children: [
              {
   
                label: 'link0',
                type: '链路模型',
                channeltype:'pointTopoint',
                delay:'2ms',
                ID:'89ss47',
                icon: 'el-icon-share'
              },
              {
  
                label: 'link1',
                type: '链路模型',
                channeltype:'pointTopoint',
                delay:'2ms',
                ID:'7777qw',
                icon: 'el-icon-share'
              }
            ]
          },
          {
            label: '有线链路',
            icon: 'wire',
            column:[ 
                      // 链路表头
                      { prop:"label",label:"名称" },
                      { prop:"type",label:"类型名" },
                      { prop: 'channeltype', label: '协议类型' },
                      { prop: 'delay', label: '时延' },
                   ],
            children: [
              {
   
                label: 'link0',
                type: '链路模型',
                channeltype:'pointTopoint',
                delay:'2ms',
                ID:'89ss47',
                icon: 'el-icon-share'
              },
              {
  
                label: 'link1',
                type: '链路模型',
                channeltype:'pointTopoint',
                delay:'2ms',
                ID:'7777qw',
                icon: 'el-icon-share'
              }
            ]
          },
          // {
          //   label: '链路模型',
          //   icon: 'wire',
          //   column:[ 
          //             // 链路表头
          //             { prop:"label",label:"名称" },
          //             { prop:"type",label:"类型名" },
          //             { prop: 'channeltype', label: '协议类型' },
          //             { prop: 'delay', label: '时延' },
          //          ],
          //   children: [
          //     {
   
          //       label: 'link0',
          //       type: '链路模型',
          //       channeltype:'pointTopoint',
          //       delay:'2ms',
          //       ID:'89ss47',
          //       icon: 'el-icon-share'
          //     },
          //     {
  
          //       label: 'link1',
          //       type: '链路模型',
          //       channeltype:'pointTopoint',
          //       delay:'2ms',
          //       ID:'7777qw',
          //       icon: 'el-icon-share'
          //     }
          //   ]
          // },
        ],
        itemname:'',
        tableData:[],
        dialogVisible: false,
        modalType: 0, // 0表示新增的弹窗， 1表示编辑
        // 初始表单
        userForm: {
          type: "",
        },
        // 节点form
        form: {
          type:'',
          label: '',
          application:'',
          // net_device:'',
          potocal:'',
          DataRate:"",
          ID:'',
          
        },
        linkform:{
          type:'',
          label: '',
          channeltype:'',
          ID:'',
          delay:'',
        },
        appchoose:['serverApps','node','clienApps'],
        netchoose:['Udp','Tcp'],
        linkchoose:['CsmA','pointTopoint','WiFi',],
        headervisible:false,
        chooseVisible:false,
        isVisible:false,//ID
        linkVisible:false,
        receivedata:null,
      };
    },
    watch: {
      menuData: {
        handler(newVal) {
          sessionStorage.setItem('key',JSON.stringify(newVal))
        },
        deep: true
      }
    },
    mounted() {
      window.vue = this
      this.receivedata=JSON.parse(sessionStorage.getItem('key'))
      if(this.receivedata){
        this.menuData=this.receivedata
      }
    },
    methods: {
      // 点击菜单
      // clickMenu(item) {
      //   // 当页面的路由与跳转的路由不一致才允许跳转
      //   if (
      //     this.$route.path !== item.path &&
      //     !(this.$route.path === "/home" && item.path === "/")
      //   ) {
      //     this.$router.push(item.path);
      //   }
      //   //this.$store.commit("selectMenu", item);
      // },
      showlist(item){
        // console.log(item);
        this.itemname=item.label
        this.tableData=item.children
        this.changeHeader(item.column)
        this.headervisible=true
      },
      // 提交用户表单
      submit() {
        let test=JSON.parse(JSON.stringify(this.form))
        // console.log(test);
        
        this.$refs.form.validate((valid) => {
          // console.log(this.form);
          let index=0;
          for(let i=0;i<this.menuData.length;i++){
            if(this.form.type === this.menuData[i].label){
                index=i
                break
            }
          }
          if (this.modalType === 0) {
            let id=Math.random().toString(36).substring(3, 9);
            test.ID=id;
            test.icon='el-icon-s-platform'
            test.name= this.menuData[index].children.length
            this.menuData[index].children.push(test)}
  
          else{
              for(let i=0;i<this.menuData[index].children.length;i++){
  
                
                if(this.form.ID === this.menuData[index].children[i].ID){
                  this.menuData[index].children.splice(i,1,test);
                      break;
                  }
              }
              
          }
          
          Object.keys(this.form).forEach((key)=>{
            this.form[key] = '';
          })
          
           // 关闭弹窗
          this.dialogVisible = false;
          
        });
      },
      // 弹窗关闭的时候
      handleClose() {
        // 清空表单的数据
        Object.keys(this.form).forEach((key)=>{
            this.form[key] = '';
        })
        // console.log(this.form);
        
        this.dialogVisible = false;
  
      },
      cancel() {
        this.handleClose()
      },
      handleAdd(){
        this.modalType = 0;
        this.dialogVisible = true;
      },
      handleEdit(row) {
      //  console.log(row);
       this.modalType = 1;
       if(row.type === '节点模型')
       {
        this.form = JSON.parse(JSON.stringify(row))
        this.dialogVisible = true;
        
       }else{
        this.linkform = JSON.parse(JSON.stringify(row));
        // console.log(row);
        
        this.linkVisible = true;
        
       }
      },
      handleDelete(row) {
        // console.log(row);
        this.$confirm("此操作将删除该模型, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let index=0;
          for(let i=0;i<this.menuData.length;i++){
            if(row.type === this.menuData[i].label){
                index=i
                break
            }
          }
          for(let i=0;i<this.menuData[index].children.length;i++){
            if(row.ID === this.menuData[index].children[i].ID){
              this.menuData[index].children.splice(i,1)
                  break;
              }
          }
          })
        .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
  
  
      linkcancel(){
        this.channelClose()
      },
      channelClose(){
        // 清空表单的数据
        // this.$refs.linkform.resetFields();
        Object.keys(this.linkform).forEach((key)=>{
            this.linkform[key] = '';
        })
        this.linkVisible = false;
      },
      linkAdd(){
        this.modalType = 0;
        this.linkVisible = true;
      },
      linkSubmit(){
        // console.log(this.linkform);
        let test=JSON.parse(JSON.stringify(this.linkform))
        // console.log(test);
        
        this.$refs.linkform.validate((valid) => {
          let index=0;
          for(let i=0;i<this.menuData.length;i++){
            if(this.linkform.type === this.menuData[i].label){
                index=i
                break
            }
          }
          if (this.modalType === 0) {
            let id=Math.random().toString(36).substring(3, 9);
            test.ID=id;
            test.icon='el-icon-share'
            this.menuData[index].children.push(test)}
          else{
              for(let i=0;i<this.menuData[index].children.length;i++){
                if(this.linkform.ID === this.menuData[index].children[i].ID){
                  
                  this.menuData[index].children.splice(i,1,test);
                      break;
                  }
              }
          }
        })
        
          Object.keys(this.linkform).forEach((key)=>{
            this.linkform[key] = '';
          })
          this.linkVisible = false;
      },
      
  
  
      addFirst(){
        this.modalType = 0;
        this.chooseVisible = true;
      },
      submitFirst(){
        // console.log(this.userForm);
        switch(this.userForm.type){
          case '节点模型':{this.handleAdd();break;}
          case '链路模型':{this.linkAdd();break;}
        }
        this.closeFirst()
      },
      closeFirst(){
         // 清空表单的数据
        // this.$refs.userForm.resetFields();
        Object.keys(this.userForm).forEach((key)=>{
            this.userForm[key] = '';
        })
        this.chooseVisible = false;
      },
      cancleFirst(){
        this.closeFirst()
      },
      jump(){
      // console.log(item);
      // 当页面的路由与跳转的路由不一致才允许跳转
      if (
        this.$route.path !== '/connecting' &&
        !(this.$route.path === "/home" && item.path === "/")
      ) {
        this.$router.push('/connecting');
      }
       },
      changeHeader(newLabels) {
      // console.log(newLabels);
      newLabels.forEach((label, index) => {
      this.columns[index] = label; // 修改每一列的表头 label
    });
      }
  
  
    },
   
  };
  </script>
  
  <style lang="less" scoped>
  // .el-menu-vertical-demo:not(.el-menu--collapse) {
  //   width: 260px;
  //   min-height: 400px;
  // }
  .shu{
    left: 0px;
    top: 6px;
    width: 4px;
    height: 20px;
    opacity: 1;
    background: linear-gradient(90deg, rgba(20, 52, 216, 1) 0%, rgba(20, 98, 216, 1) 100%);
    display: inline-block;
    vertical-align: center;
  }
  .name{
    font-size: 16px;
    margin-left: 8px;
    vertical-align: top;
  }
  .add{
    background-color:rgba(19, 52, 216, 1);
    color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(19, 52, 216, 1);
  }
  .manage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  .el-aside{
    height: calc(100vh - 66px);
  }
  .el-menu {
    
    width: 260px;
    opacity: 1;
    background: rgba(255, 255, 255, 1);
    padding: 12px;
    border-right: none;
    h3 {
      text-align: center;
      line-height: 30px;
      font-weight: 400;
    }
  
    .el-submenu {
      background-color: #f7f7f7ff;
      opacity: 1;
    }
  
    .el-submenu.is-opened span {
      color: #1334d8ff;
    }
  
    .el-submenu span {
      color: rgba(36, 36, 36, 1);
  
    }
  
    // .el-submenu__title{
    //   background-color: linear-gradient(90deg, rgba(20, 52, 216, 1) 0%, rgba(20, 98, 216, 1) 100%);
    //   font-size: 14px;
    //   font-weight: 400;
    //   letter-spacing: 0px;
    //   line-height: 20.27px;
    //   color: rgba(255, 255, 255, 1);
    // }
    //   .el-submenu__title i {
    //     color: rgba(255, 255, 255, 1);
    // }
    .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
  }
  .el-main{
    padding: 20px;
    border: 20px solid rgba(242, 247, 251, 1);
    border-bottom: 0px;
    border-right: 0px;
    background-color:rgba(255, 255, 255, 1); 
  }
  .el-menu-item.is-active {
      color: #000000;
  }
  </style>
  