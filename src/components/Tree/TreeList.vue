<template>
  <div class="tree-list">
    <tree-item
      class="tree-item"
      v-for="item in pool"
      :key="item[keyField]"
      :itemHeight="itemHeight"
      :item="item"
      :keyField="keyField"
    >
      <div :style="{ height: itemHeight }">
        {{ item.content }}
      </div>
    </tree-item>
  </div>
</template>

<script>
import TreeItem from './TreeItem'

export default {
  name: 'TreeList',
  components: {
    TreeItem
  }
}
</script>

<style></style>
