<template>
  <div class="container">
    <tree
      :list="list"
      ref="tree"
      keyField="i"
      textField="t"
      childrenField="c"
      v-slot="{ item }"
      :expandKeys="expandKeys"
      v-loading="loading"
      element-loading-text="数据下载中..."
      element-loading-spinner="el-icon-loading"
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
  name: 'DefaultExpand',
  mixins: [fetchData()],
  components: {
    Tree
  },
  data() {
    return {
      expandKeys: ['3cf46', '07217']
    }
  }
}
</script>

<style></style>
