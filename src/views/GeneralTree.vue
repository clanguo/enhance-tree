<template>
  <div class="container">
    <tree
      ref="tree"
      keyField="i"
      textField="t"
      childrenField="c"
      :defaultExpand="true"
      :defaultChecked="true"
      v-loading="loading"
      element-loading-text="数据下载中..."
      element-loading-spinner="el-icon-loading"
      :enableFilter="enableFilter"
      :filterValue.sync="filterValue"
    >
      <template v-slot:default="{ item }">
        <div class="content">选项{{ item.t }}</div>
      </template>
      <!-- <template v-slot:search="{ data }">
        <el-input
          placeholder="请输入内容1111"
          clearable
          :value="data.filterValue"
          ref="inputRef"
          @input="data.onInput"
        >
        </el-input>
      </template> -->
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
  name: 'GeneralTree',
  mixins: [fetchData('/generalData.json')],
  components: {
    Tree
  },
  data() {
    return {
      filterValue: '',
      enableFilter: false
    }
  }
}
</script>

<style></style>
