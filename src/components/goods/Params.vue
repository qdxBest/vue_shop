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
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >
            添加参数
          </el-button>

          <el-table
            :data="manyTableData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column
              type="expand"
            >
              <template v-slot="scope">
                <el-tag
                  v-for=" (item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>

            </el-table-column>

            <el-table-column type="index">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            >
            </el-table-column>

            <el-table-column
              label="操作"
            >
              <template v-slot="scopedSlot">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scopedSlot.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scopedSlot.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >
            添加属性
          </el-button>
          <el-table
            :data="onlyTableData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column
              type="expand"
            >
              <template v-slot="scope">
                <el-tag
                  v-for=" (item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>

            </el-table-column>

            <el-table-column type="index">
            </el-table-column>

            <el-table-column
              prop="attr_name"
              label="属性名称"
            >
            </el-table-column>

            <el-table-column
              label="操作"
            >
              <template v-slot="scopedSlot">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scopedSlot.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scopedSlot.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>

    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name" placeholder="请输入参数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name" placeholder="请输入参数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Params',
    data () {
      return {
        cateList: [],
        selectCatKeys: [],
        activeName: 'many',
        manyTableData: [],
        onlyTableData: [],
        addDialogVisible: false,
        addForm: {
          attr_name: ''
        },
        addFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }]
        },
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }]
        }
      }
    },
    created () {
      this.getCateList()
    },
    methods: {
      async getCateList () {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.cateList = res.data
      },
      handleChange () {
        this.getParamData()
      },
      handleClick () {
        this.getParamData()
      },
      async getParamData () {
        if (this.selectCatKeys.length !== 3) {
          this.selectCatKeys = [];
          this.manyTableData = [];
          this.onlyTableData = []
        }

        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        if (res.meta.status != 200) return this.$message.error('获取参数失败!')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      },
      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },
      addParams () {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败！')
          }
          this.$message.success('添加参数成功')
          this.addDialogVisible = false
          await this.getParamData()
        })
      },
      async showEditDialog (attr_id) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败！')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },
      editParams () {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 200) {
            return this.$message.error('参数更新失败！')
          }
          this.$message.success('参数更新成功！')
          await this.getParamData()
          this.editDialogVisible = false
        })
      },
      removeParams (attr_id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if (res.meta.status !== 200) {
            this.$message.error('删除失败！')
          }
          this.$message.success('删除成功！')
          await this.getParamData()
        }).catch(() => {
          this.$message.info('已取消删除！')
        })
      },
      handleInputConfirm (row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = '';
          row.inputVisible = false;
          return
        }
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = '';
        row.inputVisible = false;
        this.saveAttrVals(row);
      },
      showInput (row) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleClose(index, row) {
        row.attr_vals.splice(index, 1);
        this.saveAttrVals(row);
      },
      async saveAttrVals(row) {
        const { data : res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        });
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数项失败！')
        }
        this.$message.success('修改参数项成功！')
      }
    },
    computed: {
      isBtnDisabled () {
        if (this.selectCatKeys.length !== 3) {
          return true
        }
        return false
      },
      cateId () {
        if (this.selectCatKeys.length === 3) {
          console.log(this.selectCatKeys)
          return this.selectCatKeys[2]
        }
        return null
      },
      titleText () {
        if (this.activeName === 'many') {
          return '动态参数'
        } else {
          return '静态属性'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin-top: 5px;
  }

  .el-tag {
    margin: 5px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>
