<template>
    <div class="box" ref="box">
      <div class="left" ref="left">
        <!--左侧div内容-->
        我是左侧内容
      </div>
      <div
        class="resize"
        ref="resize"
        title="收缩侧边栏"
        :style="resizeStyleObj"
        @mousedown="on_MouseDown($event)"
      >
      </div>
      <div class="right" ref="right">
        <!--右侧div内容-->
        我是右侧内容
      </div>
    </div>
</template>

<script>
export default {
  name: 'DragControlDiv',
  mounted () {
    let resize = this.$refs.resize;
    let left = this.$refs.left;
    let right = this.$refs.right;
    let box = this.$refs.box;

    left.style.width = (box.offsetWidth * this.defaultLeftPercent - resize.offsetWidth) + 'px';
    right.style.width = box.offsetWidth * (1-this.defaultLeftPercent) + 'px';

    window.onresize = () => { //浏览器窗口resize时重新计算
      let currentPercent = (left.offsetWidth +  resize.offsetWidth)/ box.offsetWidth;
      left.style.width = (box.offsetWidth * currentPercent - resize.offsetWidth) + 'px';
      right.style.width = (box.offsetWidth * (1-currentPercent)) + 'px';
    }
  },
  data () {
    return {
      resizeStyleObj:{
        width: 10 + 'px'        //分栏初始宽度
      },
      minWidth: 100,            //左右div最小宽度
      defaultLeftPercent: 0.32, //左div初始宽度百分比
      startX:0,                 //分栏初始位置
      currentLeft: 0,           //分栏初始左边距离
      afterLeft:0,              //分栏移动后左边距离
      maxLength: 0
    }
  },
  methods: {
    on_MouseDown(event) {
      this.$refs.resize.setCapture && this.$refs.resize.setCapture()
      this.$refs.resize.style.background = '#818181';
      this.startX = event.x;
      this.currentLeft = event.target.offsetLeft;
      document.onmousemove = event => {
        this.afterLeft = (event.x-this.startX) + this.currentLeft;
        this.maxLength = this.$refs.box.clientWidth - this.$refs.resize.offsetWidth;

        // 左边区域的最小宽度为100px
        if (this.afterLeft < this.minWidth) {
          this.afterLeft = this.minWidth;
        }
        // 右边区域最小宽度为100px
        if (this.afterLeft > this.maxLength - this.minWidth) {
          this.afterLeft = this.maxLength - this.minWidth;
        }
        this.$refs.left.style.width = this.afterLeft + 'px';
        this.$refs.right.style.width = (this.$refs.box.clientWidth - this.afterLeft - this.$refs.resize.offsetWidth) + 'px';
      };
      document.onmouseup = () => {
        this.$refs.resize.style.background = '#d6d6d6';
        document.onmousemove = null;
        document.onmouseup = null;
        this.$refs.resize.releaseCapture && this.$refs.resize.releaseCapture();
      };
      this.$refs.resize.setCapture && this.$refs.resize.setCapture() ;// 该函数在属于当前线程的指定窗口里设置鼠标捕获
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  /*包围div样式*/
  .box {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
  }
  /*左侧div样式*/
  .left {
    /*width: calc(32% - 10px);  !*左侧初始化宽度*!*/
    height: 100%;
    background: #FFFFFF;
    float: left;
    text-align: center;
  }
  /*拖拽区div样式*/
  .resize {
    cursor: col-resize;
    float: left;
    position: relative;
    background-color: #d6d6d6;
    border-radius: 5px;
    height: 100%;
    background-size: cover;
    background-position: center;
    font-size: 30px;
    line-height: 100%;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  .resize:hover {
    color: #444444;
  }
  /*右侧div样式*/
  .right {
    float: left;
    /*width: 68%;   !*右侧初始化宽度*!*/
    height: 100%;
    background: #fff;
    box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
    text-align: center;
  }

</style>
