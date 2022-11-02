<template>
  <div class="container">
    <tree
      ref="tree"
      keyField="i"
      textField="t"
      childrenField="c"
      v-loading="loading"
      :expandKeys="['4ffb1', 'de614']"
      element-loading-text="数据下载中..."
      element-loading-spinner="el-icon-loading"
      enableFilter
    >
      <template #search>
        <el-input value="这是自定义的搜索框"></el-input>
      </template>
      <template v-slot="{ item }">
        <div class="content">
          <template v-if="item.c?.length">
            <i class="el-icon-folder" v-if="!item.expand"></i>
            <i class="el-icon-folder-opened" v-else></i>
          </template>
          <i class="el-icon-document" v-else></i> 选项{{ item.t }}
        </div>
      </template>
    </tree>
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
  name: 'CustomNode',
  mixins: [fetchData()],
  components: {
    Tree
  }
}
</script>

<style scoped></style>
