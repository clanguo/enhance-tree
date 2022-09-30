<template>
  <div id="app">
    <tree
      ref="tree"
      class="tree"
      :list="list"
      keyField="id"
      v-slot="{ item }"
      :filterValue.sync="filterValue"
    >
      <div class="content">{{ item.content }}</div>
    </tree>
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
      list: data,
      filterValue: ''
    }
  },
  mounted() {
    window.tree = this.$refs['tree']
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
