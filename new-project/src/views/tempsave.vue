<template>
  <div class="mydiv">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="auto">
        <h3 style="font-size: 12px;color: rgba(101, 101, 101, 1);">模型列表</h3>
        <el-collapse v-model="activeNames" class="collapse-cls">
          <el-collapse-item v-for="(items, index) in menuData" :key="items.label" :index="items.label"
            :title="items.label" :name="items.label">
            <div v-for="item in items.children" style="text-align: center;" >
              <div  class="item" draggable @dragstart="handleDragStart($event, item)">
                <el-icon :class="item.icon" style="font-size: 32px;vertical-align:middle;"></el-icon>
                <div :key="item.ID" class="device-item" >
                  {{ item.label }}
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item v-for="(items, index) in tableData" :key="items.label" :index="items.label"
            :title="items.label" :name="items.label">
            <div v-for="item in items.children" style="text-align: center;">
              <div  class="item" draggable @dragstart="handleLinkDragStart($event, item)">
                <el-icon :class="item.icon" style="font-size: 32px;vertical-align:middle;"></el-icon>
                <div :key="item.ID" class="link-device" >
                  {{ item.label }}
                </div>
            </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <!-- 主要内容 -->
      <el-main width="auto">
        <!-- <el-button type="primary" @click="run" >运行</el-button> -->
        
        <el-button class="run" @click="run" type="primary"> 运行 </el-button>
        <div class="canvas-container" 
        @dragover.prevent 
        ref="container"
        @drop="handleDrop" 
        @click="handleCanvasClick">

          <!-- SVG （可缩放矢量图形）的根容器 -->
          <svg class="topology-svg" 
          @mousemove="trackCursor" 
          :width="width" 
          :height="height" 
          @wheel.prevent="handleWheel">



            <!-- 天蓝色背景 -->
            <rect 
              x="0" 
              y="0" 
              :width="width" 
              :height="height" 
              fill="#87CEEB" 
            />

            <!-- 动态虚线网格 -->
            <!-- X轴方向网格线 -->
            <g v-for="x in gridX" :key="'x'+x">
              <!-- 垂直线路径 -->
              <path 
                :d="`M ${x * cellSize} 0 V ${height}`" 
                stroke="black"
                :stroke-dasharray="dashStyle"
                stroke-width="1"
              />
              <!-- X轴标签（自动密度控制） -->
              <text 
                v-if="x % labelStep === 0 "
                :x="x * cellSize" 
                y="15" 
                fill="black"
                font-size="12"
              >{{ (x * cellSize).toFixed(0) }}</text>
            </g>

            <!-- Y轴方向网格线 -->
            <g v-for="y in gridY" :key="'y'+y">
              <!-- 水平线路径 -->
              <path 
                :d="`M 0 ${y * cellSize} H ${width}`" 
                stroke="black"
                :stroke-dasharray="dashStyle"
                stroke-width="1"
              />
              <!-- Y轴标签（自动密度控制） -->
              <text 
                v-if="y % labelStep === 0 && y !== 0"
                x="5" 
                :y="y * cellSize " 
                fill="black"
                font-size="12"
              >{{ (y * cellSize).toFixed(0) }}</text>
            </g>

            <!-- 坐标轴 -->
            <path 
              :d="`M 0 0 H ${width}`" 
              stroke="#333" 
              stroke-width="2" 
            />
            <path 
              :d="`M 0 0 V ${height}`" 
              stroke="#333" 
              stroke-width="2" 
            />



            <!-- 绘制连接线 -->
            <g v-for="conn in connections" :key="conn.ID" 
              @contextmenu.prevent="showConnectionMenu($event, conn)"
             class="connection">
            <!-- path用于绘制复杂的路径，可以是直线、曲线或其他复杂的形状。通过 d 属性定义路径 -->
            <path v-for="(conn, index) in connections" :key="index" :d="calculateConnectionPath(conn)" stroke="red"
              stroke-width="3" fill="none" />
            <!-- line适用于绘制两点之间的简单直线 -->
            <line v-if="traceMouse.isTracing" :x1="traceMouse.startX" :y1="traceMouse.startY" :x2="traceMouse.cursorX"
              :y2="traceMouse.cursorY" stroke="red" />
            </g>
            <!-- 绘制设备节点 -->
            <!-- 容器元素，将多个形状、路径、文本等元素组合成一个组 -->
            <g v-for="node in nodes" :key="node.ID" :data-id="node.ID" :transform="`translate(${node.x }, ${node.y }) `"
              @contextmenu.prevent="showContextMenu($event, node)" @mousedown="handleNodeMouseDown($event, node)"
              style="cursor: move;">
              <!-- 在 SVG 中嵌入 HTML 内容 -->
              <foreignObject :width="60 * scaleFactor" :height="60 * scaleFactor">
                <div class="node-wrapper"  :style="{ width: 60 * scaleFactor + 'px',height: 60 * scaleFactor + 'px' }">
                  <el-card shadow="hover" class="node-card">
                    <el-icon :class="node.icon" :style="{ fontSize: 24 * scaleFactor + 'px' }"></el-icon>
                    <div class="node-label" :style="{ fontSize: 15 * scaleFactor + 'px' }">{{ node.name }}</div>
                  </el-card>
                </div>
              </foreignObject>
            </g>
          </svg>


          <!-- 右键菜单 -->
          <el-dropdown ref="contextMenu" trigger="click" :visible="contextMenu.visible" :style="contextMenuStyle">
            <span class="el-dropdown-link" style=""></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editproperty">编辑属性</el-dropdown-item>
              <el-dropdown-item @click.native="deleteNode">删除设备</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      <el-dialog
        title="节点模型"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!-- 用户的表单信息 -->
        <el-form
          ref="nodeform"
          :model="nodeform"
          :inline="true"
          label-width="100px"
        >
          <el-form-item prop="label" label="名称">
            <el-input  v-model="nodeform.label"></el-input>
          </el-form-item>
          <el-form-item prop="application" label="应用程序">
            <!-- <el-input  v-model="form.application"></el-input> -->
            <el-select v-model="nodeform.application">
              <el-option v-for="item in appchoose" :label="item" :value="item"></el-option> 
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="网络设备">
            <el-input  v-model="form.net_device"></el-input>
          </el-form-item> -->
          <el-form-item prop="potocal" label="协议栈">
            <el-select v-model="nodeform.potocal">
              <el-option v-for="item in netchoose" :label="item" :value="item"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item prop="DataRate" label="数据传输速率">
            <el-input  v-model="nodeform.DataRate"></el-input>
          </el-form-item>
  
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
           <el-button type="primary" @click="submit">确 定</el-button> 
        </span>
      </el-dialog>
        </div>

      </el-main>

    </el-container>
  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader.vue';
import { pastData } from '@/api';
export default {
  data() {
    return {
      activeNames: ['1'],
      menuData: [
      ],
      nodeData:[ 
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
                type: '交换机',
                label: '思科CISC0 CBS350-24P-4G-CN',
                application:'serverApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                // ID:'124s8s',
                icon: 'el-icon-s-platform',
                name:0
              },
              {
                type: '交换机',
                label: '海康威视DS-3E0318P-E/M',
                application:'clienApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                // ID:'1wed8s',
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
                type: '路由器',
                label: '华为AR6280-S',
                application:'serverApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                // ID:'124s8s',
                icon: 'el-icon-s-platform',
                name:0
              },
              {
                type: '路由器',
                label: '思科C8200L-1N-4T',
                application:'clienApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                // ID:'1wed8s',
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
                type: '移动终端',
                label: '无人机',
                application:'serverApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                // ID:'124s8s',
                icon: 'el-icon-s-platform',
                name:0
              },
              {
                type: '移动终端',
                label: '移动电话',
                application:'clienApps',
                potocal:'Udp',
                DataRate:'5Mbps',
                // ID:'1wed8s',
                icon: 'el-icon-s-platform',
                name:1
              }
            ]
          },
        ],
      tableData: [],
      linkData:[
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
   
                label: '1000BaseX',
                type: '无线链路',
                channeltype:'pointTopoint',
                delay:'2ms',
                // ID:'89ss47'
                icon: 'el-icon-share'
              },
              {
  
                label: '100BaseT',
                type: '无线链路',
                channeltype:'pointTopoint',
                delay:'2ms',
                // ID:'7777qw',
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
   
                label: '1000BaseX',
                type: '有线链路',
                channeltype:'pointTopoint',
                delay:'2ms',
                // ID:'89ss47',
                icon: 'el-icon-share'
              },
              {
  
                label: '100BaseT',
                type: '有线链路',
                channeltype:'pointTopoint',
                delay:'2ms',
                // ID:'7777qw',
                icon: 'el-icon-share'
              }
            ]
          },
      ],
      receivedata:[],
      // 节点
      nodes: [],
      // 连接线
      connections: [],
      // 右键菜单
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        targetNode: null
      },
      // 连接状态，源节点
      connectionState: {
        creating: false,
        sourceNode: null
      },
      // 连接线追踪
      traceMouse: {
        isTracing: false,
        cursorX: 0,
        cursorY: 0,
        startX: 0,
        startY: 0
      },
      // 设备节点拖拽
      dragState: {
        isDragging: false,
        targetNode: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
      },
      tempLink:'',
       // 画布尺寸
      width: 0,
      height: 0,

      // 网格系统
      cellSize: 50,       // 初始网格大小
      minCellSize: 10,    // 最小缩放粒度
      maxCellSize: 200,   // 最大缩放尺寸
      labelStep: 2 ,    // 初始标签步长


      // 鼠标交互
      currentX: null,      // 当前X坐标
      currentY: null,      // 当前Y坐标
      tooltipX: 0,        // 提示框X位置
      tooltipY: 0,        // 提示框Y位置
      showTooltip: false,  // 是否显示提示
      scaleFactor:1,
      dialogVisible:false,
      nodeform:{
          label: '',
          application:'',
          potocal:'',
          DataRate:"",

      },
      appchoose:['serverApps','node','clienApps'],
      netchoose:['Udp','Tcp'],
    }
  },
  components: {
    CommonHeader,

  },
  
  computed: {
    // 计算菜单位置
    contextMenuStyle() {
      return {
        position: 'fixed',
        left: `${this.contextMenu.x}px`,
        top: `${this.contextMenu.y}px`,
        display: this.contextMenu.visible ? 'block' : 'none'
      }
    },
    // 生成X轴网格线位置数组
    gridX() {
      return Array.from(
        { length: Math.ceil(this.width / this.cellSize) }, 
        (_, i) => i
      );
    },
     // 生成Y轴网格线位置数组
    gridY() {
      return Array.from(
        { length: Math.ceil(this.height / this.cellSize) }, 
        (_, i) => i
      );
    },
    // 动态虚线样式（根据网格大小优化显示）
    dashStyle() {
      return this.cellSize < 30 ? "2 2" : "4 2";
    },
  },
  watch: {
    // 监听单元格大小，从而自动调整标签密度
    cellSize(val) {
      if (val <= 30) {
        this.labelStep = 5;//0-30 每五个格一个标签
      } else if (val <= 60) {
        this.labelStep = 2;// 30-60 每2个格一个标签
      } else {
        this.labelStep = 1;// 60 以上一格一标签
      }
    }
  },
  mounted() {
    window.vue = this
    this.receivedata=JSON.parse(sessionStorage.getItem('key'))
    if(this.receivedata){
      for(let i=0;i<this.receivedata.length;i++){
        if(this.receivedata[i].label === '交换机'||this.receivedata[i].label === '路由器'||this.receivedata[i].label === '移动终端'){
            this.menuData.push(this.receivedata[i])
            console.log(this.menuData)
        }else if(this.receivedata[i].label ==='有线链路'||this.receivedata[i].label ==='无线链路'){
          this.tableData.push(this.receivedata[i])
          console.log(this.tableData)
        }
      }
  }else{
    this.menuData=this.nodeData
    this.tableData=this.linkData
  }
    // 初始化尺寸
    this.updateSize();

    // 监听窗口尺寸变化
    window.addEventListener('resize', this.updateSize);

    // 使用ResizeObserver监听容器尺寸变化
    this.observer = new ResizeObserver(this.updateSize);
    this.observer.observe(this.$refs.container);
  },
  
  methods: {
    // 鼠标滚轮缩放
   handleWheel(e) {
   
   // 获取容器位置和鼠标相对坐标
   const rect = this.$refs.container.getBoundingClientRect();

   //用于确定鼠标在容器内的具体位置
   const mouseX = e.clientX - rect.left;
   const mouseY = e.clientY - rect.top;

   // 计算缩放比例
   const delta = e.deltaY > 0 ? 0.9 : 1.1;

    // 计算新网格尺寸（限制在有效范围）
   const newCellSize = this.cellSize * delta;

   // 如果尺寸超范围则退出（不变）
   if (newCellSize < this.minCellSize || newCellSize > this.maxCellSize) return;
   
   // 应用变化，缩放网格
   this.cellSize = newCellSize;
  
   this.scaleFactor=this.scaleFactor * delta
   // this.scaleFactor = Math.min(2, Math.max(0.5, this.scaleFactor))



   // 计算滚动偏移量
   const scaleRatio = 1 - delta;
   const scrollLeft = mouseX * scaleRatio;
   const scrollTop = mouseY * scaleRatio;


   // 在缩放网格的同时，容器也会滚动，使得鼠标所在的位置始终保持在视觉中心，实现以鼠标位置为中心的缩放效果
   this.$refs.container.scrollLeft += scrollLeft;
   this.$refs.container.scrollTop += scrollTop;
 },
 //更新容器尺寸
 updateSize() {
   const container = this.$refs.container;
   if (!container) return;
   this.width = container.clientWidth;
   this.height = container.clientHeight;
 },

  // 处理鼠标移动事件
//  handleMouseMove(e) {
   //  // 获取容器位置
   // const rect = this.$refs.container.getBoundingClientRect();
   // // 计算鼠标相对坐标
   // this.currentX = e.clientX - rect.left;
   // this.currentY = e.clientY - rect.top;
   
   // // 提示框位置（偏移10px避免遮挡）
   // this.tooltipX = e.clientX + 10;
   // this.tooltipY = e.clientY + 10;
   // this.showTooltip = true;
//  },
 // 鼠标离开处理
//  handleMouseLeave() {
   // this.showTooltip = false;
   // this.currentX = null;
   // this.currentY = null;
//  },
    // 运行
    run(){
      // console.log(JSON.stringify(this.menuData));
      const node=this.menuData[0].children
      const link=this.tableData[0].children

      let newarray=[]
      for(let i=0;i<node.length;i++){
        newarray.push(node[i])
      }
      for(let i=0;i<link.length;i++){
        newarray.push(link[i])
      }
      
      const newObject={
        data:newarray
      }
      const mydata=JSON.stringify(newObject)
      // console.log(mydata);
      
      //发送请求
      pastData(mydata).then((response)=>{
        console.log(response.data);
        const data=response.data
        sessionStorage.setItem('result',JSON.stringify(data))
        this.$router.push('/result')
      }).catch(error=>{
        console.log(error);
      })
    },
    // #region移动设备
    handleNodeMouseDown(event, node) {
      this.dragState = {
        isDragging: true,
        targetNode: node,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - node.x,
        offsetY: event.clientY - node.y
      }

      // 添加事件监听
      document.addEventListener('mousemove', this.handleNodeMouseMove)
      document.addEventListener('mouseup', this.handleNodeMouseUp)
      event.preventDefault()
    },

    handleNodeMouseMove(event) {
      if (!this.dragState.isDragging) return

      // 计算新位置
      const newX = event.clientX - this.dragState.offsetX
      const newY = event.clientY - this.dragState.offsetY
      
      // 更新节点位置
      this.dragState.targetNode.x = newX
      this.dragState.targetNode.y = newY

      // 实时更新连接线（依赖Vue的响应式系统自动更新）
    },

    handleNodeMouseUp() {
      this.dragState.isDragging = false
      document.removeEventListener('mousemove', this.handleNodeMouseMove)
      document.removeEventListener('mouseup', this.handleNodeMouseUp)
    },
    // #endregion


    // #region菜单
    showContextMenu(event, node) {
      this.contextMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        targetNode: node
      }
      this.$refs.contextMenu.show()

    },
    deleteNode() {
      const nodeId = this.contextMenu.targetNode.ID
      this.nodes = this.nodes.filter(n => n.ID !== nodeId)
      this.connections = this.connections.filter(c =>
        c.source !== nodeId && c.target !== nodeId
      )
      this.closeContextMenu()
    },
    editproperty(){
      const nodeId = this.contextMenu.targetNode.ID
      for(let i=0;i<this.nodes.length;i++){
        if(this.nodes[i].ID===nodeId){
          this.nodeform=JSON.parse(JSON.stringify(this.nodes[i]))
          break
        }
      }
      
      this.dialogVisible=true
    },
    submit(){
      let test=JSON.parse(JSON.stringify(this.nodeform))
      for(let i=0;i<this.nodes.length;i++){
        if(this.nodes[i].ID===test.ID){
          this.nodes.splice(i,1,test);
          break
        }
      }
      this.handleClose()
    },
    handleClose(){
      // 清空表单的数据
      Object.keys(this.nodeform).forEach((key)=>{
          this.nodeform[key] = '';
      })
      this.dialogVisible=false
    },
    cancel(){
      this.handleClose()
    },
    closeContextMenu() {
      this.contextMenu.visible = false
    },
    // #endregion


    // #region初始化连接线
    handleLinkDragStart(event, device) {
      this.connectionState.creating = true
      event.dataTransfer.setData('linkType', JSON.stringify(device))
    },
    trackCursor(event) {
      if (!this.traceMouse.isTracing) return;
      const rect = event.currentTarget.getBoundingClientRect()
      // console.log(event);
      this.traceMouse.cursorX = event.clientX - rect.left;
      this.traceMouse.cursorY = event.clientY - rect.top;
    },
    // #endregion


    //#region设备实例化
    handleDragStart(event, device) {
      // console.log(event.dataTransfer);
      let id=Math.random().toString(36).substring(3, 9);
      device.ID=id
      if(this.nodes.length){
        device.number=this.nodes[this.nodes.length-1].number+1
      }else{
        device.number=0
      }
      device.name='node'+device.number
      const node=JSON.stringify(device)
      console.log(node);
      
      event.dataTransfer.setData('deviceType', node)
      // console.log(device);

    },
    handleDrop(event) {

      const rect = event.currentTarget.getBoundingClientRect()
      if (this.connectionState.creating) {
        const sourceNode = this.findNearestNode(event.clientX - rect.left, event.clientY - rect.top)
        // console.log(sourceNode);
        this.connectionState.sourceNode = sourceNode
        const device = JSON.parse(event.dataTransfer.getData('linkType'))
        this.tempLink=device.ID

        // 动态创建跟随线条（高级实现）
        this.traceMouse.startX = sourceNode.x + 40
        this.traceMouse.startY = sourceNode.y + 40
        this.traceMouse.isTracing = true;

      } else {
        const device = JSON.parse(event.dataTransfer.getData('deviceType'))
        this.nodes.push({
          // id: Date.now(),
          x: event.clientX - rect.left - 40,
          y: event.clientY - rect.top - 40,
          ...device
        })
      }



    },
    // #endregion

    // #region连接两个设备
    handleCanvasClick(event) {
      if (!this.connectionState.creating) return

      const element = document.elementFromPoint(event.clientX, event.clientY)
      const nodeElement = element.closest('.node-wrapper')
      this.traceMouse.isTracing = false;
      // console.log(nodeElement);

      if (nodeElement) {
        // const nodeId = Number(nodeElement.closest('g').ID)
        const nodeId = nodeElement.closest('g').dataset.id
        // console.log(nodeId);
        
        const targetNode = this.nodes.find(n => n.ID === nodeId)
        if (targetNode && targetNode !== this.connectionState.sourceNode) {
          const temp={
            source: this.connectionState.sourceNode.ID,
            target: targetNode.ID
          }
          this.connections.push(temp)
          const targetlink = this.tableData[0].children.find(n => n.ID === this.tempLink)

          // console.log(targetlink);
          targetlink.connection=temp
          
        }
      }
      this.connectionState = { creating: false, sourceNode: null }

    },
    findNearestNode(x, y) {
      return this.nodes.find(node => {
        const dx = x - (node.x + 50) // 节点中心X
        const dy = y - (node.y + 25) // 节点中心Y
        return Math.sqrt(dx * dx + dy * dy) < 100 // 有效连接半径
      })
    },
    calculateConnectionPath(conn) {
      const sourceNode = this.nodes.find(n => n.ID === conn.source)
      const targetNode = this.nodes.find(n => n.ID === conn.target)
      if (!sourceNode || !targetNode) return ''

      const start = { x: sourceNode.x + 25, y: sourceNode.y + 25 }
      const end = { x: targetNode.x + 25, y: targetNode.y + 25 }
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`//绝对定位


    },
    // #endregion
  }
}
</script>



<style lang="less" scoped>
.mydiv{
  height: calc(100vh - 66px)
}
.el-aside {
  width: 300px !important;
  opacity: 1;
  background: rgba(255, 255, 255, 1);
  padding: 12px;
  border-right: none;
  
  .el-collapse {
    height: calc(100vh - 132px);
  }

  h3 {
    text-align: center;
    width: 260px;
    line-height: 30px;
    font-weight: 400;
  }

  .el-collapse-item {
    width: 260px;
    // padding: 0 20px;
    color: rgba(36, 36, 36, 1);
    font-size: 14px;
    line-height: 56px;
    border-bottom: 0px;

  }

  /deep/.collapse-cls .el-collapse-item__content {
    padding-bottom: 0px !important;
  }

  /deep/.el-collapse-item__header {
    background-color: #F7F7F7;
    /* 背景颜色 */
    border-bottom: 1px solid #ebeef5;
    /* 边框 */
    color: rgba(36, 36, 36, 1);
    font-size: 14px;
    line-height: 56px;
    height: 56px;
    // margin: 0 20px;
    padding-left: 20px;
  }

}

.el-main {
  padding: 20px;
  border: 20px solid rgba(242, 247, 251, 1);
  border-bottom: 0px;
  border-right: 0px;
  background-color: rgba(255, 255, 255, 1);
  
}
.item{
  cursor: move;
  
  border-bottom: 1px solid gray;
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
  // cursor: move;
  text-align: center;
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  vertical-align:middle;
}
.canvas-container {
  flex: 1;
  position: relative;
  background: #fff;
  height: 580px;
  clear: both;
  overflow:hidden;
  // width: 1400px;
}

.topology-svg {
  width: 100%;
  height: 100%;
  transition: transform 0.2s; /* 平滑缩放效果 */
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.node-wrapper {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.node-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.node-label {
  font-size: 12px;
  // margin-top: 5px;
  text-align: center;
}


/* 拖拽时的悬浮效果 */
.g:active .node-card {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.2);
  transform: scale(1.05);
}
.el-card /deep/ .el-card__body{
  padding: 0;
  text-align: center;
}
.run{
    background-color:rgba(19, 52, 216, 1);
    color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(19, 52, 216, 1);
    float: right;
}

/* 禁用文本选择 */
text {
  user-select: none;
  pointer-events: none;
}

/* 坐标提示样式 */
.coord-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 999;
  transform: translate(10px, 10px); /* 与鼠标保持小距离 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
</style>