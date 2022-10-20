<template>
  <div
    id="app"
    v-loading="loading"
    element-loading-text="数据下载中..."
    element-loading-spinner="el-icon-loading"
  >
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
      :enableFilter="useFilter"
    >
      <div class="content">选项{{ item.t }}</div>
    </tree>
    <div style="text-align: center">
      <el-button type="primary" @click="toggleFilter">
        {{ (useFilter ? '禁用' : '启用') + '节点过滤' }}
      </el-button>
      <el-button type="primary" @click="expandTree">一键展开</el-button>
      <el-button type="primary" @click="collapseTree">一键收起</el-button>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/Tree'
export default {
  name: 'App',
  components: {
    Tree
  },
  data() {
    return {
      list: [],
      filterValue: '',
      expandKeys: ['3cf46', '07217'],
      loading: false,
      useFilter: true
    }
  },
  created() {
    this.loading = true
    performance.mark('initJson')
    fetch('/data.json')
      .then(r => {
        return r.json()
      })
      .then(d => {
        performance.mark('endJson')
        console.log(
          '【加载json文件】 duration: %sms',
          performance.measure('json', 'initJson', 'endJson').duration
        )
        this.list = Object.freeze(d)
        // this.list = d
        this.loading = false
        performance.mark('endCreated')
        console.log(
          '【数据响应式】 duration: %sms',
          performance.measure('created', 'endJson', 'endCreated').duration
        )
      })
  },
  mounted() {
    window.tree = this.$refs['tree']
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
