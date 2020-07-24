<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
       <el-col :span="8">
         <el-input
           placeholder="请输入内容"
           v-model="queryInfo.query"
           clearable
           @clear="getGoodsList"
         >
           <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
         </el-input>
       </el-col>

       <el-col :span="4">
         <el-button type="primary" @click="goAddPage">添加商品</el-button>
       </el-col>
      </el-row>

      <el-table
        :data="goodslist"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
        >
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
         >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="150px"
        >
          <template v-slot="scopedSlot">
            {{scopedSlot.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120px"
        >
          <template v-slot="scope">
            <el-tooltip  effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" :enterable="false" @click="showEditDialog(scope.row.goods_id)"></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" :enterable="false" @click="removeById(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 25, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'List',
    created () {
      this.getGoodsList()
    },
    data () {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        total:0,
        goodslist: []
      }
    },
    components: {},
    methods: {
      async getGoodsList() {
        const {data : res} = await this.$http.get('goods',{
          params: this.queryInfo
        });
        if (res.meta.status !== 200){
          return this.$message.error('获取商品列表失败！')
        }
        this.$message.success('获取商品列表成功！');
        this.goodslist = res.data.goods;
        this.total = res.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      removeById(goods_id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`goods/${goods_id}`);
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.$message.success('删除成功！');
          this.getGoodsList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      goAddPage() {
        this.$router.push('/goods/add')
      }
    },
    computed: {}
  }
</script>

<style lang="" scoped>

</style>
