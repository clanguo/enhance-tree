<template>
  <div class="tree" ref="container" @scroll="setPool">
    <div class="tree_container" :style="{ height: containerHeight + 'px' }">
      <div
        class="tree_item"
        v-for="poolItem in pool"
        :key="poolItem.item[keyField]"
        :style="{
          height: itemHeight + 'px',
          transform: `translateY(${poolItem.y}px)`
        }"
      >
        <slot :item="poolItem.item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => []
    },
    keyField: {
      type: String,
      default: 'id'
    },
    itemHeight: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      pool: [], // 渲染池, { item: 内容, y: y偏移 }
      prev: 5, // 最前面多显示个数
      next: 5 // 最后面多显示个数
    }
  },
  computed: {
    renderData() {
      return this.list
    },
    containerHeight() {
      return this.list.length * this.itemHeight
    }
  },
  mounted() {
    this.setPool()
    // this.$refs['container'].addEventListener('scroll', this.setPool)
  },
  methods: {
    setPool() {
      const height = this.$refs['container'].clientHeight
      const scrollTop = this.$refs['container'].scrollTop
      let startIndex = Math.floor(scrollTop / this.itemHeight)
      let endIndex = Math.ceil((scrollTop + height) / this.itemHeight)
      startIndex = Math.max(0, startIndex - this.prev)
      endIndex = Math.min(this.list.length, endIndex + this.next)
      const startY = startIndex * this.itemHeight
      this.pool = this.list.slice(startIndex, endIndex).map((item, index) => {
        return {
          item: item,
          y: startY + index * this.itemHeight
        }
      })
    }
  }
}
</script>

<style scoped>
.tree {
  position: relative;
  overflow: auto;
}

.tree::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

.tree::-webkit-scrollbar-thumb {
  background-color: #a1a1a1;
}

.tree_item {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
