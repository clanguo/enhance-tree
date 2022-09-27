<template>
  <div id="app">
    <tree class="tree" :list="list" keyField="id" v-slot="{ item }">
      <div>{{ item.content }}</div>
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
      list: data
    }
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
</style>
