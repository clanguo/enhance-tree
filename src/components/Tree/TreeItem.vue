<template>
  <div class="tree-item">
    <slot></slot>
    <template v-if="item.children">
      <tree-item
        v-for="child in item.children"
        :key="child[keyField]"
        :itemHeight="itemHeight"
        :keyField="keyField"
        :item="child"
      >
        <slot :item="child.item"></slot>
      </tree-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TreeItem'
}
</script>

<style></style>
