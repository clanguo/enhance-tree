<template>
  <div id="app">
    <el-container class="el-container">
      <el-aside width="240px" class="el-aside">
        <h1>树组件功能菜单</h1>
        <el-menu :default-active="$route.path" class="el-menu-vertical" router>
          <el-menu-item index="/">
            <template slot="title">
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/generalTree">
            <span>普通树</span>
          </el-menu-item>
          <el-menu-item index="/treeFilter">
            <span slot="title">节点搜索</span>
          </el-menu-item>
          <el-menu-item index="/defaultExpand">
            <span slot="title">默认展开</span>
          </el-menu-item>
          <el-menu-item index="/customNode">
            <span slot="title">自定义节点内容</span>
          </el-menu-item>
          <el-menu-item index="/selectNode">
            <span slot="title">节点选择与联动</span>
          </el-menu-item>
          <el-menu-item index="/disableNode">
            <span slot="title">禁用节点</span>
          </el-menu-item>
          <el-menu-item index="/eventEmit">
            <span slot="title">事件触发</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      filterValue: '',
      expandKeys: ['3cf46', '07217'],
      loading: false,
      useFilter: true
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}

.el-container {
  width: 100%;
  height: 100%;
}

.el-container .is-active {
  background-color: #ecf5ff;
}

.el-aside {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-aside h1 {
  text-align: center;
  color: #409eff;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;

  margin: 0;
  padding: 15px 0;
}

.el-menu-vertical {
  height: 100%;
}

.tree {
  width: 600px;
  height: 400px;
  margin: 10px auto;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
  user-select: none;
}
</style>
