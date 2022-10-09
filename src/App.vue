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
    >
      <div class="content">{{ item.content }}</div>
    </tree>
    <p v-if="loading" style="text-align: center">数据加载中...</p>
  </div>
</template>

<script>
import Tree from '@/components/Tree'
import data from './data.json'
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
      loading: true
    }
  },
  created() {
    this.list = data
    this.loading = false
    // fetch('http://10.188.131.179:5500/data.json')
    //   .then(r => r.json())
    //   .then(d => {
    //     this.list = d
    //     this.loading = false
    //   })
  },
  mounted() {
    window.tree = this.$refs['tree']
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     this.filterValue = '1-2-10'
    //   }, 10000)
    // })
  }
}
</script>

<style scoped>
.tree {
  width: 200px;
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
