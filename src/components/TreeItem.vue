<template>
  <div>
    <tree
      ref="tree"
      class="tree"
      :list="list"
      keyField="i"
      textField="t"
      childrenField="c"
      v-slot="{ item }"
      :expandKeys="expandKeys"
      :filterValue.sync="filterValue"
      :enableFilter="enableFilter"
      :defaultExpand="defaultExpand"
      :defaultChecked="defaultChecked"
    >
      <div class="content">选项{{ item.t }}</div>
    </tree>
    <div style="text-align: center">
      <el-button type="primary" @click="expandTree">一键展开</el-button>
      <el-button type="primary" @click="collapseTree">一键收起</el-button>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/Tree'
export default {
  name: 'TreeItem',
  components: {
    Tree
  },
  props: {
    expandKeys: {
      type: Array,
      default: () => []
    },
    enableFilter: {
      type: Boolean,
      default: false
    },
    defaultChecked: {
      type: Boolean,
      default: false
    },
    defaultExpand: {
      type: Boolean,
      default: false
    },
    list: Array
  },
  data() {
    return {
      filterValue: '',
      // expandKeys: ['3cf46', '07217'],
      useFilter: true
    }
  },
  methods: {
    toggleFilter() {
      this.useFilter = !this.useFilter
    },
    expandTree() {
      if (this.$refs.tree) {
        this.$nextTick(() => {
          this.$refs.tree.expandAll()
        })
      }
    },
    collapseTree() {
      if (this.$refs.tree) {
        this.$nextTick(() => {
          this.$refs.tree.collapseAll()
        })
      }
    }
  }
}
</script>

<style scoped>
.tree {
  width: 400px;
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
