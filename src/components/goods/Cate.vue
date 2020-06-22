<template>
  <div>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-row>
        <el-col>
          <el-button type="primary" @click="cateDialogVisible = true; getParentCateList()">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
          class="treeTable"
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border>

          <!--是否有效-->
          <template v-slot:isok="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>

          <template v-slot:order="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>

          <template v-slot:opt="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeCate(scope.row.cat_id)">删除</el-button>
          </template>

      </tree-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

    </el-card>

    <!--添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      width="50%"
      @close="dialogClose">

      <span>
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="value"
              :options="parentCateList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
                }"
              @change="ParentCateChange"
              clearable
              style="width: 100%">
            </el-cascader>
          </el-form-item>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改分类名称的对话框-->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >

      <span>
        <el-form
          :model="editCateForm"
          :rules="editCateFormRules"
          ref="editCateFormRef"
          label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Cate',
    created() {
      this.getCateList();
    },
    data() {
      return {
        //对话框flag
        cateDialogVisible: false,
        editCateDialogVisible: false,
        //添加分类数据
        addCateForm: {
          cat_pid:0,
          cat_name:'',
          cat_level:0
        },
        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
        },
        //修改分类名称数据
        editCateForm: {},
        editCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
        },
        //页码数据
        queryInfo: {
          type: 3,
          pagenum: 1, //当前的页数
          pagesize: 5 //当前每页显示多少条数据
        },
        total: 0,
        //商品列表数据
        cateList: [],
        parentCateList: [],
        value:[],
        columns: [
          {
            label: "分类名称",
            prop: "cat_name"
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok',
          },
          {
            label: '排序',
            type: 'template',
            template: 'order',
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt',
          },
        ]
      }
    },
    methods:{
      async getCateList() {
        const { data : res } = await this.$http.get('categories', {
          params: this.queryInfo
        });
        if(res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.cateList = res.data.result;
        // console.log(res.data.result);
        this.total = res.data.total;
      },
      //页码：更改展示的用户数
      handleSizeChange(sizeChange) {
        this.queryInfo.pagesize = sizeChange;
        this.getCateList();
      },
      //更改当前的页数
      handleCurrentChange(currentSize) {
        this.queryInfo.pagenum = currentSize;
        this.getCateList();
      },
      dialogClose() {
        this.$refs.addCateFormRef.resetFields();
        this.value = [];
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      },
      //获取父级分类的数据
      async getParentCateList() {
        const { data : res } = await this.$http.get('categories', {
          params: {
            type: 2
          }
        });
        if(res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.parentCateList = res.data;
      },
      ParentCateChange() {
        if(this.value.length > 0) {
          this.addCateForm.cat_pid = this.value[this.value.length - 1];
          this.addCateForm.cat_level = this.value.length;
          return
        } else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      //添加分类
      async addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if(!valid) return;
          const { data : res } = await this.$http.post('categories', this.addCateForm);
          if(res.meta.status != 201) {
            return this.$message.error('添加分类失败！');
          }
          this.$message.success('添加分类成功！');
          this.cateDialogVisible = false;
          this.getCateList();
        })
      },
      //展示编辑用户的对话框
      async showEditCateDialog(id) {
        const { data : res } = await this.$http.get(`categories/${id}`);
        // console.log(res);
        if(res.meta.status != 200) {
          return this.$message.error('查询分类失败！');
        }
        this.editCateForm = res.data;
        this.editCateDialogVisible = true;
      },
      //修改分类名称函数
      editCate() {
        this.$refs.editCateFormRef.validate(async valid => {
          if(!valid) return;
          const { data : res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, {
            cat_name: this.editCateForm.cat_name,
          });
          if(res.meta.status != 200) {
            return this.$message.error('更新分类名称失败！');
          }
          this.$message.success('修改分类名称成功！');
          this.editCateDialogVisible = false;
          this.getCateList();
        })
      },
      //删除用户
      removeCate(id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const { data : res } = await this.$http.delete(`categories/${id}`);
          if(res.meta.status != 200) {
            return this.$message.error('删除分类失败！');
          }
          this.$message.success('删除分类成功！');
          this.getCateList();
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }
</style>
