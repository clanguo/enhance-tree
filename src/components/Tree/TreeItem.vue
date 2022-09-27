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
        <div :style="{ height: itemHeight }">{{ child.content }}</div>
      </tree-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TreeItem',
  props: {
    itemHeight: {
      type: String,
      required: true
    }
  }
}
</script>

<style></style>
