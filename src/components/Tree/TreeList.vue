<template>
  <div class="tree_list">
    <div>
      <slot :listItem="item.item"></slot>
    </div>
    <template v-if="item.children">
      <tree-list
        v-for="child in item.children"
        :key="child.item.id"
        :item="child"
        v-slot="{ listItem }"
      >
        <slot :listItem="listItem"></slot>
      </tree-list>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TreeList',
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.tree_list {
  padding-left: 10px;
}
</style>
