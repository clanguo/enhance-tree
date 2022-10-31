<template>
  <div class="container">
    <tree
      :list="list"
      ref="tree"
      keyField="i"
      textField="t"
      childrenField="c"
      v-slot="{ item }"
      v-loading="loading"
      element-loading-text="数据下载中..."
      element-loading-spinner="el-icon-loading"
      :defaultExpand="true"
      @expand="onExpand"
      @collapse="onCollapse"
      @checked="onChecked"
      ><div class="content" :style="{ color: item.disable ? '#ccc' : '' }">
        选项{{ item.t }}
      </div></tree
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
  name: 'EventEmit',
  mixins: [fetchData()],
  components: {
    Tree
  },
  methods: {
    onExpand(item) {
      alert(`展开了【${item.t}】节点`)
    },
    onCollapse(item) {
      alert(`收起了【${item.t}】节点`)
    },
    onChecked(item, value) {
      const msg = value
        ? `选择了【${item.t}】节点`
        : `取消了【${item.t}】节点的选择`
      alert(msg)
    }
  }
}
</script>

<style></style>
