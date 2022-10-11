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
      expandKeys: [],
      loading: true,
      useFilter: false
    }
  },
  created() {
    // this.list = data
    // this.loading = false
    fetch('/data.json')
      .then(r => r.json())
      .then(d => {
        this.list = d
        this.loading = false
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
