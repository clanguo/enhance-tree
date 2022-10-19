<template>
  <div id="app">
    <tree
      ref="tree"
      class="tree"
      :list="list"
      keyField="id"
      v-slot="{ item }"
      :expandKeys="expandKeys"
      :filterValue.sync="filterValue"
      :enableFilter="useFilter"
    >
      <div class="content">{{ item.content }}</div>
    </tree>
    <div style="text-align: center">
      <button @click="toggleFilter">
        {{ (useFilter ? '禁用' : '启用') + '节点过滤' }}
      </button>
      <button @click="expandTree">一键展开</button>
      <button @click="collapseTree">一键收起</button>
    </div>
    <p v-if="loading" style="text-align: center">数据加载中...</p>
  </div>
</template>

<script>
import Tree from '@/components/Tree'
// import data from './data.json'
export default {
  name: 'App',
  components: {
    Tree
  },
  data() {
    return {
      list: [],
      filterValue: '',
      expandKeys: ['db00'],
      loading: false,
      useFilter: true
    }
  },
  created() {
    // this.list = data
    this.loading = true
    fetch('/data.json')
      .then(r => {
        performance.mark('initJson')
        return r.json()
      })
      .then(d => {
        performance.mark('endJson')
        console.log(
          '【json】 duration: %sms',
          performance.measure('json', 'initJson', 'endJson').duration
        )
        this.list = Object.freeze(d)
        this.loading = false
        performance.mark('endCreated')
        console.log(
          '【created】 duration: %sms',
          performance.measure('created', 'endJson', 'endCreated').duration
        )
      })
  },
  mounted() {
    window.tree = this.$refs['tree']
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     this.filterValue = '1-2-10'
    //   }, 10000)
    // })
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
  width: 240px;
  height: 400px;
  margin: 10px auto;
  border: 1px solid #ccc;
}

.content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
