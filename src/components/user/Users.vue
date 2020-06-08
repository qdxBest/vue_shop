<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear = "getUserList()">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table
        :data="userList"
        style="width: 100%"
        border>
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip  effect="dark" content="修改" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" :enterable="false" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" :enterable="false" @click="removeUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose">

      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      >

      <span>
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'User',
    data() {
      let checkMobile = (rules, value, cb) => {
        const regMobile = /^1[3456789]\d{9}$/;
        if(!regMobile.test(value)) return cb(new Error('请输入合法的手机号！'));
        cb();
      };
      return {
        queryInfo: {
          query:'',
          pagenum: 1, //当前的页数
          pagesize: 2 //当前每页显示多少条数据
        },
        userList:[],
        total: 0,
        dialogVisible: false,
        //添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //添加用户的验证规则
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          email: [
            { required: false, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: ['blur', 'change']}
          ]
        },
        //修改用户对话框显示flag
        editDialogVisible: false,
        //查询到的用户信息
        editForm:{
          id:'',
          username: '',
          email: '',
          mobile: ''
        },
        editFormRules: {
          email: [
            { required: false, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: ['blur', 'change']}
          ]
        },
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      //获取用户列表
      async getUserList() {
        const { data : res } = await this.$http.get('users', {
          params: this.queryInfo
        });
        // console.log(res);
        if(res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.userList = res.data.users;
        this.total = res.data.total;
      },
      //页码：更改展示的用户数
      handleSizeChange(sizeChange) {
        this.queryInfo.pagesize = sizeChange;
        this.getUserList();
      },
      //更改当前的页数
      handleCurrentChange(currentSize) {
        this.queryInfo.pagenum = currentSize;
        this.getUserList();
      },
      //修改用户状态函数
      async userStateChange(userInfo) {
        console.log(userInfo);
        const { data : res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`, )
        if(res.meta.status != 200) {
          userInfo.mg_state = !userInfo.mg_state;
          return this.$message.error('更新用户状态失败！');
        }
        this.$message.success('更新用户状态成功！');
      },
      //关闭对话框时刷新对话框
      dialogClose() {
        this.$refs.addFormRef.resetFields();
        this.$refs.editFormRef.resetFields();
      },
      //添加用户函数
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if(!valid) return;
          const { data : res } = await this.$http.post('users', this.addForm);
          console.log(res);
          if(res.meta.status != 201) {
            return this.$message.error('添加用户失败！');
          }
          this.$message.success('添加用户成功！');
          this.dialogVisible = false;
          this.getUserList();
        })
      },
      //展示编辑用户的对话框
      async showEditDialog(id) {
        const { data : res } = await this.$http.get(`users/${id}`);
        // console.log(res);
        if(res.meta.status != 200) {
          return this.$message.error('查询用户失败！');
        }
        this.editForm = res.data;
        this.editDialogVisible = true;
      },
      //修改用户资料函数
      editUser() {
        this.$refs.editFormRef.validate(async valid => {
          if(!valid) return;
          const { data : res } = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          });
          console.log(res);
          if(res.meta.status != 200) {
            return this.$message.error('更新用户失败！');
          }
          this.$message.success('添加用户成功！');
          this.editDialogVisible = false;
          this.getUserList();
        })
      },
      //删除用户
      removeUser(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const { data : res } = await this.$http.delete(`users/${id}`);
          if(res.meta.status != 200) {
            return this.$message.error('删除用户失败！');
          }
          this.$message.success('删除用户成功！');
          this.dialogVisible = false;
          this.getUserList();
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
