<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>

      <el-aside :width="collapseFlag ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#D3DCE6"
          text-color="#000"
          active-text-color="#409EFF"
          unique-opened
          :collapse="collapseFlag"
          :collapse-transition="false"
          :router="true"
        >
          <!--一级菜单-->
          <!--index用于点击时单独展开-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class=iconsObj[item.id]></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index=" '/'+ subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"

            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        menulist: [],
        iconsObj: {
          '125' :'el-icon-user-solid',
          '103' :'el-icon-edit',
          '101' :'el-icon-shopping-bag-1',
          '102' :'el-icon-shopping-cart-2',
          '145' :'el-icon-document'
        },
        collapseFlag: false
      }
    },
    created() {
      this.getMenuList();
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      async getMenuList() {
        const { data : res } = await this.$http.get('menus');
        console.log(res);
        if(res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.menulist = res.data;
      },
      toggleCollapse() {
        this.collapseFlag = !this.collapseFlag
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: white;
    > div {
      display: flex;
      align-items: center;
      > img {
        height: 60px;
        width: 20%;
        border-radius: 50%;
      }
      > span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #D3DCE6;
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #E9EEF3;
  }

  .toggle-button {
    background-color: cadetblue;
    font-size: 15px;
    line-height: 36px;
    color: white;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
</style>
