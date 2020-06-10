<template>
    <div>

      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" @click="setDialogVisible = true">添加角色</el-button>
          </el-col>
        </el-row>

        <el-table
          :data="rolesList"
          style="width: 100%"
          border>

          <el-table-column
            type="expand">
            <template slot-scope="scope">
              <el-row
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id">
                <el-col :span="5">
                  <el-tag
                    closable
                    @close="removeRights(scope.row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row
                    :class="[ i2 === 0 ? '' : 'bdtop', 'vcenter']"
                    v-for="(item2,i2) in item1.children"
                    :key="item2.id">
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRights(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="danger"
                        v-for="(item3) in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeRights(scope.row, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column
            type="index">
          </el-table-column>

          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>

          <el-table-column
            prop="roleDesc"
            label="角色描述">
          </el-table-column>

          <el-table-column
            label="操作"
            width="290px">
            <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeUser(scope.row.id)">删除</el-button>
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRight(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>

        </el-table>

      </el-card>

      <!--添加用户的对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="setDialogVisible"
        width="50%"
        @close="dialogClose">

      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>

        <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
      </el-dialog>

      <!--修改用户的对话框-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%">

        <span>
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--分配权限的对话框-->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClose">

        <span>
          <el-tree
            :data="rightsList"
            ref="treeRef"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-checked-keys="defKeys"
            :props="treeProps">
          </el-tree>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'Roles',
    created(){
      this.getRolesList();
    },
    data() {
      return {
        //角色列表
        rolesList: [],
        //权限列表
        rightsList: [],
        //添加角色的数据
        addForm: {},
        //修改角色的数据
        editForm: {},
        //修改角色对话框flag
        editDialogVisible: false,
        //添加角色对话框flag
        setDialogVisible: false,
        //编辑权限对话框flag
        setRightDialogVisible: false,
        editFormRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
          roleDesc:[
            { required: false }
          ]
        },
        addFormRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
          roleDesc:[
            { required: false }
          ]
        },
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        defKeys: [],
        roleId:''
      }
    },
    methods: {
      async getRolesList() {
        const {data:res} = await this.$http.get('roles');
        if (res.meta.status != 200) {
          return this.$message.error('获取权限列表失败！');
        }
        this.rolesList = res.data;
        console.log(this.rolesList);
      },
      //关闭对话框时刷新对话框
      dialogClose() {
        this.$refs.addFormRef.resetFields();
        // this.$refs.editFormRef.resetFields();
      },
      //添加用户
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if(!valid) return;
          const { data : res } = await this.$http.post('roles', this.addForm);
          // console.log(res);
          if(res.meta.status != 201) {
            return this.$message.error('添加用户失败！');
          }
          this.$message.success('添加用户成功！');
          this.setDialogVisible = false;
          this.getRolesList();
        })
      },
      //展示编辑用户的对话框
      async showEditDialog(id) {
        const { data : res } = await this.$http.get(`roles/${id}`);
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
          const { data : res } = await this.$http.put(`roles/${this.editForm.roleId}`, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          });
          console.log(res);
          if(res.meta.status != 200) {
            return this.$message.error('更新用户失败！');
          }
          this.$message.success('更新用户成功！');
          this.editDialogVisible = false;
          this.getRolesList();
        })
      },
      //删除用户
      removeUser(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const { data : res } = await this.$http.delete(`roles/${id}`);
          if(res.meta.status != 200) {
            return this.$message.error('删除用户失败！');
          }
          this.$message.success('删除用户成功！');
          this.dialogVisible = false;
          this.getRolesList();
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      //删除权限
      removeRights(role, rightId) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const { data : res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
          if(res.meta.status != 200) {
            return this.$message.error('删除权限失败！');
          }
          this.$message.success('删除权限成功！');
          role.children = res.data;
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      //展示分配权限的对话框
      async showSetRight(role) {
        this.roleId = role.id;
        const {data:res} = await this.$http.get('rights/tree');
        if (res.meta.status != 200) {
          return this.$message.error('获取权限列表失败！');
        }
        this.rightsList = res.data;
        this.getLeafKeys(role, this.defKeys);
        this.setRightDialogVisible = true;
      },
      //通过递归的形式，获取三级权限id
      getLeafKeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id);
        }
        node.children.forEach(item => {
          this.getLeafKeys(item, arr);
        })
      },
      setRightDialogClose() {
        this.defKeys = [];
      },
      async editRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ];
        const idStr = keys.join(',');
        const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr });
        if (res.meta.status != 200) {
          return this.$message.error('更新权限列表失败！');
        }
        this.$message.success('分配权限成功！');
        this.getRolesList();
        this.setRightDialogVisible = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eeeeee ;
  }

  .bdbottom {
    border-bottom: 1px solid #eeeeee ;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
