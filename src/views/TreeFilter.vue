<template>
  <div class="container">
    <tree
      ref="tree"
      keyField="i"
      textField="t"
      childrenField="c"
      :enableFilter="true"
      :filterValue.sync="filterValue"
      v-loading="loading"
      element-loading-text="数据下载中..."
      element-loading-spinner="el-icon-loading"
      v-slot="{ item }"
      ><div class="content">选项{{ item.t }}</div></tree
    >
    <div style="text-align: center">
      <el-button type="primary" @click="expandTree">一键展开</el-button>
      <el-button type="primary" @click="collapseTree">一键收起</el-button>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/Tree'
import fetchData from '@/mixins/fetchData'

export default {
  name: 'Home',
  mixins: [fetchData()],
  components: {
    Tree
  },
  data() {
    return {
      filterValue: ''
    }
  }
}
</script>

<style></style>
