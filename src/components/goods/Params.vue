<template>
    <div>

      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数分类</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>

        <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类：</span>
            <el-cascader
              v-model="selectCatKeys"
              :options="cateList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children:'children',
                checkStrictly:false
                 }"
              @change="handleChange"
            ></el-cascader>
          </el-col>
        </el-row>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
          </el-tab-pane>
        </el-tabs>

      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'Params',
    data() {
      return {
        cateList:[],
        selectCatKeys:[],
        activeName:'many',
        manyTableData:[],
        onlyTableData:[]
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      async getCateList() {
        const { data : res } = await this.$http.get('categories');
        if(res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.cateList = res.data;
      },
      handleChange() {
        this.getParamData();
      },
      handleClick() {
        this.getParamData();
      },
      async getParamData() {
        const { data : res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: {
            sel: this.activeName
          }
        });
        if(res.meta.status != 200) return this.$message.error('获取参数失败!');
        if(this.activeName === 'many'){
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
      }
    },
    computed: {
      isBtnDisabled() {
        if(this.selectCatKeys.length !== 3) {
          return true
        }
        return false
      },
      cateId() {
        if(this.selectCatKeys.length === 3){
          console.log(this.selectCatKeys)
          return this.selectCatKeys[2];
        }
        return null
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin-top: 5px;
  }
</style>
